import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setSubmitting(true)

    try {
      await signup({ email, password, nickname })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
    backgroundColor: '#316282', border: '1px solid #1b3a52', borderRadius: 3,
    color: '#c6d4df', fontSize: 14, outline: 'none',
  }

  const labelStyle = {
    display: 'block', fontSize: 10, fontWeight: 700,
    color: '#66c0f4', letterSpacing: '0.1em', marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
      background: '#1b2838',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'url(/images/steam-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'rgba(0,0,0,0.58)',
        backdropFilter: 'blur(2px)',
      }} />

      <div style={{
        width: '100%', maxWidth: 420, position: 'relative',
        backgroundColor: '#2a475e',
        borderRadius: 4,
        padding: '36px 40px 28px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.65)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/images/logo.png" alt="Patch Lens"
            style={{ width: 52, height: 52, borderRadius: 11, objectFit: 'contain' }} />
        </div>

        <h1 style={{ color: '#c6d4df', fontSize: 26, fontWeight: 700, margin: '0 0 24px' }}>
          Create account
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>NICKNAME</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              autoComplete="nickname"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>CONFIRM PASSWORD</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              color: '#fecaca',
              backgroundColor: 'rgba(239,68,68,0.14)',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: 4,
              padding: '8px 10px',
              fontSize: 12,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 4,
              width: '100%', padding: '11px',
              background: 'linear-gradient(180deg, #4db8ff 0%, #1a9fff 100%)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              border: 'none', borderRadius: 3,
              cursor: submitting ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em',
              opacity: submitting ? 0.65 : 1,
            }}
          >
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/login" style={{ fontSize: 12, color: '#66c0f4', textDecoration: 'none', opacity: 0.85 }}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}