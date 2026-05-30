'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Toast from './components/Toast'
import './home.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
    visible: false,
    type: 'success',
    message: ''
  })

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ visible: true, type, message })
  }

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }))

  const getRedirectPath = (role: string) => {
    return role === 'motorista' ? '/home-motorista' : '/home-passageiro'
  }

  const parseRoleFromToken = (token: string) => {
    try {
      const payload = token.split('.')[1]
      const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')
      const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
      const parsed = JSON.parse(decoded)
      return parsed.role || 'passageiro'
    } catch {
      return 'passageiro'
    }
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setToast((prev) => ({ ...prev, visible: false }))
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Email ou senha inválidos')
      }

      const role = data.role || parseRoleFromToken(data.access_token)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user_role', role)

      showToast('success', 'Login realizado com sucesso! Redirecionando...')
      setTimeout(() => {
        router.push(getRedirectPath(role))
      }, 600)
    } catch (error) {
      console.error('Erro no login:', error)
      showToast('error', error instanceof Error ? error.message : 'Erro de conexão. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <nav className="navbar-home">
        <img src="logos/2-removebg-preview.png" alt="Logotipo" />
        <ul>
          <li><Link href="/">Início</Link></li>
          <li><Link href="#create-account">Cadastre-se</Link></li>
        </ul>
      </nav>

      <Toast visible={toast.visible} type={toast.type} message={toast.message} onClose={closeToast} />

      <section className="hero">
        <div className="content">
          <div className="badge">
            <p>Daqui pra ali, sem arrodeio</p>
          </div>
          <h1>Pegue carona com quem conhece <span style={{ color: 'var(--primary)' }}>cada atalho.</span></h1>
          <p>O Agreste Go conecta você a vizinhos profissionais que vivem e entendem a nossa terra. Preço justo, trajeto direto, sem surpresa nenhuma.</p>

          <section className="stats">
            <div className="stat-item">
              <div className="number">100%</div>
              <div className="label">Motoristas locais</div>
            </div>
            <div className="stat-item">
              <div className="number">32+</div>
              <div className="label">Cidades cobertas</div>
            </div>
            <div className="stat-item">
              <div className="number">0</div>
              <div className="label">Tarifa surpresa</div>
            </div>
          </section>
        </div>

        <div className="image-container">
          <img src="background-hero.jpg" alt="Imagem do banner inicial" />
          <div className="security-badge">
            <div className="dot"></div>
            <p>Segurança verificada<span>Toda corrida monitorada</span></p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Pronto para começar?</h2>
          <p>Crie sua conta ou entre para chamar sua próxima corrida no Agreste.</p>
        </div>

        <div className="cta-cards">
          <div id="create-account" className="card">
            <h3>Crie sua conta</h3>
            <p className="subtitle">Como você quer usar?</p>
            <div className="button-group">
              <Link className="nav-link" href="/cadastro-passageiro">
                Sou Passageiro
              </Link>
              <Link className="nav-link" href="/cadastro-motorista">
                Sou Motorista
              </Link>
            </div>
          </div>

          <div className="card">
            <h3>Já é cliente?</h3>
            <p className="subtitle">Faça login com seu email e senha.</p>
            <form className="button-group" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="login-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Agreste Go - Feito no sertão, para o sertão.</p>
      </footer>
    </>
  )
}