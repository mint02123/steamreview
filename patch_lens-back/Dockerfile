FROM python:3.11-slim

# psycopg2-binary / bcrypt 빌드에 필요한 최소 시스템 패키지
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# 의존성 먼저 복사 → 레이어 캐시 활용
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드와 데이터
COPY app ./app
COPY data ./data

EXPOSE 8000

# main.py 가 BASE_DIR.parent/.env 를 로드하므로 /app/.env 도 인식됨.
# 실제 비밀값은 compose의 environment / env_file 로 주입한다.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
