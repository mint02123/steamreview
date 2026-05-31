# Patch Lens — AWS 티어다운 체크리스트

이 프로젝트가 `ap-northeast-1`(Tokyo), 계정 `510490942540`에 만든 **모든 리소스**를 안전한 순서로 제거한다.
모든 명령에 `--region ap-northeast-1`을 붙인다. **삭제는 되돌릴 수 없으니** 각 단계 전에 ID를 눈으로 확인할 것.

> 💸 비용 큰 순서: **NAT Gateway(+EIP)** > RDS > App Runner > CloudFront/S3.
> 돈을 빨리 멈추려면 NAT부터, 전파가 오래 걸리는 CloudFront 비활성화는 일찍 걸어두는 게 유리하다.

## 빠른 체크리스트

```
[ ] 0. (선택) CloudFront 비활성화를 먼저 걸어둠 (전파 ~15분, 병렬 진행)
[ ] 1. NAT Gateway 삭제 → (삭제 완료 후) EIP 해제
[ ] 2. App Runner 서비스 삭제
[ ] 3. RDS 인스턴스 삭제 (관리형 시크릿 동반 삭제)
[ ] 4. CloudFront 배포 삭제 (비활성+Deployed 후)
[ ] 5. S3 버킷 비우고 삭제
[ ] 6. VPC 커넥터 삭제 (App Runner 삭제 이후)
[ ] 7. IAM 롤 2개 삭제 (인라인 정책 제거 후)
[ ] 8. Secrets 3개 삭제
[ ] 9. (추가 정리) ECR / 보안그룹 / 프라이빗 서브넷·라우트테이블
```

---

## 1. NAT Gateway + EIP  ⚠️ 먼저

EIP는 NAT에 붙어있는 동안 해제 불가 → **NAT 삭제 완료를 기다린 뒤** EIP 해제.

```bash
# NAT 삭제
aws ec2 delete-nat-gateway --region ap-northeast-1 --nat-gateway-id nat-041504d36f3679dbd

# 상태가 deleted 될 때까지 대기 (수 분)
aws ec2 describe-nat-gateways --region ap-northeast-1 --nat-gateway-ids nat-041504d36f3679dbd \
  --query 'NatGateways[0].State'

# deleted 확인 후 EIP 해제
aws ec2 release-address --region ap-northeast-1 --allocation-id eipalloc-09f57f67a68d25ce6
```
> 프라이빗 라우트 테이블의 `0.0.0.0/0 → NAT` 경로는 NAT 삭제 후 blackhole이 됨(무해). 9단계에서 라우트 테이블째 정리.

## 2. App Runner 서비스

VPC 커넥터(6단계)는 이 서비스가 살아있는 한 삭제 불가 → App Runner를 먼저.

```bash
aws apprunner delete-service --region ap-northeast-1 \
  --service-arn arn:aws:apprunner:ap-northeast-1:510490942540:service/patch-lens-backend/c7ff5433dbf3464d8616f8267ca0dc42

# DELETED 까지 대기
aws apprunner describe-service --region ap-northeast-1 \
  --service-arn arn:aws:apprunner:ap-northeast-1:510490942540:service/patch-lens-backend/c7ff5433dbf3464d8616f8267ca0dc42 \
  --query 'Service.Status'
```

## 3. RDS 인스턴스

`--skip-final-snapshot`(스냅샷 불필요 시) + `--delete-automated-backups`. RDS 관리형 시크릿(`rds!db-…`)은 인스턴스와 함께 사라진다.

```bash
aws rds delete-db-instance --region ap-northeast-1 \
  --db-instance-identifier patch-lens-db \
  --skip-final-snapshot --delete-automated-backups

# deleted 까지 대기
aws rds describe-db-instances --region ap-northeast-1 \
  --db-instance-identifier patch-lens-db --query 'DBInstances[0].DBInstanceStatus'
```
> 데이터를 남기고 싶으면 `--skip-final-snapshot` 대신 `--final-db-snapshot-identifier patch-lens-db-final` 사용.

## 4. CloudFront 배포

배포는 **Enabled=false → Deployed 전파 → delete**. ETag가 필요하다.

```bash
# 1) 현재 config + ETag 받아 저장
aws cloudfront get-distribution-config --id E1Z2UPSO3E3PIE > cf.json
#    cf.json에서 ETag 확인, DistributionConfig의 "Enabled"를 false로 수정해 cf-disabled.json 작성

# 2) 비활성화
aws cloudfront update-distribution --id E1Z2UPSO3E3PIE \
  --distribution-config file://cf-disabled.json --if-match <ETag>

# 3) Status=Deployed 까지 대기 (~15분)
aws cloudfront get-distribution --id E1Z2UPSO3E3PIE --query 'Distribution.Status'

# 4) 삭제 (update 후 새 ETag 사용)
aws cloudfront delete-distribution --id E1Z2UPSO3E3PIE --if-match <newETag>
```
> OAC `ESHMVSM7ZRCT2`도 배포 삭제 후 정리:
> `aws cloudfront delete-origin-access-control --id ESHMVSM7ZRCT2 --if-match <oacETag>`

## 5. S3 버킷

버킷은 비어야 삭제 가능.

```bash
aws s3 rm s3://patch-lens-frontend-510490942540 --recursive
aws s3api delete-bucket --region ap-northeast-1 --bucket patch-lens-frontend-510490942540
```

## 6. VPC 커넥터  (App Runner 삭제 이후)

```bash
aws apprunner delete-vpc-connector --region ap-northeast-1 \
  --vpc-connector-arn arn:aws:apprunner:ap-northeast-1:510490942540:vpcconnector/patch-lens-vpc-connector-private/1/6892b5c0dfa8401dbdb07daafb0fdb94
```

## 7. IAM 롤 2개

롤은 정책을 떼어낸 뒤 삭제. 인스턴스 롤은 인라인 시크릿 정책이 붙어 있음.

```bash
# 인스턴스 롤: 인라인 정책 이름 확인 후 제거
aws iam list-role-policies --role-name patch-lens-apprunner-instance-role
aws iam delete-role-policy --role-name patch-lens-apprunner-instance-role --policy-name <inline-policy-name>
aws iam delete-role --role-name patch-lens-apprunner-instance-role

# 액세스 롤: 관리형 정책(AWSAppRunnerServicePolicyForECRAccess 등)이 attach돼 있으면 detach 후 삭제
aws iam list-attached-role-policies --role-name patch-lens-apprunner-access-role
aws iam detach-role-policy --role-name patch-lens-apprunner-access-role --policy-arn <attached-arn>
aws iam delete-role --role-name patch-lens-apprunner-access-role
```

## 8. Secrets Manager (3개)

복구 대기 없이 즉시 삭제하려면 `--force-delete-without-recovery`.

```bash
for s in patch-lens/DATABASE_URL patch-lens/JWT_SECRET_KEY patch-lens/ANTHROPIC_API_KEY; do
  aws secretsmanager delete-secret --region ap-northeast-1 \
    --secret-id "$s" --force-delete-without-recovery
done
```
> PowerShell이라면 `foreach ($s in 'patch-lens/DATABASE_URL','patch-lens/JWT_SECRET_KEY','patch-lens/ANTHROPIC_API_KEY') { aws secretsmanager delete-secret --region ap-northeast-1 --secret-id $s --force-delete-without-recovery }`
> RDS 관리형 시크릿(`rds!db-…`)은 3단계에서 RDS와 함께 삭제됨.

---

## 9. 추가 정리 (선택 — 사용자 목록엔 없지만 이 프로젝트가 만든 것)

순서 주의: 보안그룹은 RDS(3) + VPC 커넥터(6)가 사라진 뒤에야 삭제 가능(참조 해제).

```bash
# ECR 리포지토리 (이미지째)
aws ecr delete-repository --region ap-northeast-1 --repository-name patch-lens-backend --force

# 보안그룹 (rds → apprunner 순서; rds SG가 apprunner SG를 참조)
aws ec2 delete-security-group --region ap-northeast-1 --group-id sg-0ab6c561d89517025   # rds
aws ec2 delete-security-group --region ap-northeast-1 --group-id sg-0729327ae278416cc   # apprunner

# 프라이빗 라우트 테이블: 서브넷 연결 해제 후 삭제
aws ec2 describe-route-tables --region ap-northeast-1 --route-table-ids rtb-091a8740c7be13ee7 \
  --query 'RouteTables[0].Associations[].RouteTableAssociationId'
aws ec2 disassociate-route-table --region ap-northeast-1 --association-id <assoc-id>   # 1a, 1c 각각
aws ec2 delete-route-table --region ap-northeast-1 --route-table-id rtb-091a8740c7be13ee7

# 이 프로젝트가 만든 프라이빗 서브넷 (기본 VPC는 남겨둠)
aws ec2 delete-subnet --region ap-northeast-1 --subnet-id subnet-0db17026c90ffa180   # 1a
aws ec2 delete-subnet --region ap-northeast-1 --subnet-id subnet-064d37550da109403   # 1c
```

> ⚠️ **남겨두는 것**: 기본 VPC(`vpc-0606a433…`), 기본 IGW, 기본 퍼블릭 서브넷(`subnet-08ab13f4…` 등 계정 기본 리소스). NAT가 쓰던 퍼블릭 서브넷이 다른 기본 리소스면 삭제하지 말 것.

---

## 완료 검증

```bash
aws apprunner list-services --region ap-northeast-1
aws rds describe-db-instances --region ap-northeast-1 --query 'DBInstances[].DBInstanceIdentifier'
aws ec2 describe-nat-gateways --region ap-northeast-1 --filter Name=state,Values=available
aws cloudfront list-distributions --query 'DistributionList.Items[].Id'
aws s3 ls | grep patch-lens
aws secretsmanager list-secrets --region ap-northeast-1 --query 'SecretList[].Name'
aws ecr describe-repositories --region ap-northeast-1 --query 'repositories[].repositoryName'
```
위 결과에 patch-lens 관련 항목이 모두 사라지면 청소 완료. 마지막으로 **Billing → Cost Explorer**에서 NAT/RDS 과금이 멈췄는지 확인.
```
