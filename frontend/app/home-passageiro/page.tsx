'use client'

import { useState } from 'react'
import Link from 'next/link'
import './home-passageiro.css'
import { RideRequest } from './interfaces/ride-request'

export default function HomePassageiro() {
  const [rideRequest, setRideRequest] = useState<RideRequest>({
    origem: '',
    destino: '',
    passageiros: 1
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'BOM DIA'
    if (hour < 18) return 'BOA TARDE'
    return 'BOA NOITE'
  }

  const quickDestinations = [
    { name: 'Caruaru', icon: '📍' },
    { name: 'Garanhuns', icon: '📍' },
    { name: 'Bezerros', icon: '📍' }
  ]

  const handleInputChange = (field: keyof RideRequest, value: string | number) => {
    setRideRequest(prev => ({ ...prev, [field]: value }))
    setSubmitMessage(null) // Limpar mensagens de erro ao digitar
  }

  const handlePassengerChange = (increment: boolean) => {
    setRideRequest(prev => ({
      ...prev,
      passageiros: increment
        ? Math.min(prev.passageiros + 1, 4) // Máximo 4 passageiros
        : Math.max(prev.passageiros - 1, 1) // Mínimo 1 passageiro
    }))
  }

  const validateForm = (): boolean => {
    if (!rideRequest.origem.trim()) {
      setSubmitMessage({ type: 'error', text: 'Por favor, informe a origem da viagem.' })
      return false
    }

    if (!rideRequest.destino.trim()) {
      setSubmitMessage({ type: 'error', text: 'Por favor, informe o destino da viagem.' })
      return false
    }

    if (rideRequest.origem.trim().toLowerCase() === rideRequest.destino.trim().toLowerCase()) {
      setSubmitMessage({ type: 'error', text: 'Origem e destino não podem ser iguais.' })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitMessage(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Integrar com API do backend
      const response = await fetch('/api/corridas/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rideRequest,
          tipo: 'passageiro',
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSubmitMessage({
          type: 'success',
          text: `Corrida solicitada! Procurando motoristas próximos... ID: ${data.corridaId || 'ABC123'}`
        })

        setRideRequest({
          origem: '',
          destino: '',
          passageiros: 1
        })

        // TODO: Redirecionar para tela de acompanhamento da corrida
        setTimeout(() => {
          window.location.href = '/acompanhar-corrida'
        }, 3000)

      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao solicitar corrida')
      }

    } catch (error) {
      console.error('Erro na solicitação:', error)
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectQuickDestination = (destination: string) => {
    setRideRequest(prev => ({ ...prev, destino: destination }))
  }

  return (
    <div className="home-passageiro">
      <header className="header-passageiro">
        <div className="logo-section">
          <div className="dot"></div>
          <h1>AgresteGo</h1>
        </div>

        <nav className="nav-links">
          <Link href="/" className="nav-link active">Início</Link>
          <Link href="/corridas" className="nav-link">Corridas</Link>
          <Link href="/perfil" className="nav-link">Perfil</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="left-panel">
          <div className="greeting-badge">
            <p>🌞 {getGreeting()}, MARIA</p>
          </div>

          <h1 className="main-headline">
            Pra onde a<br />
            gente vai <span className="highlight">hoje?</span>
          </h1>

          <p className="subtitle">
            Informe o trajeto e a gente conecta com motoristas locais em segundos.
          </p>

          <div className="quick-destinations">
            {quickDestinations.map((dest) => (
              <button
                key={dest.name}
                className="destination-btn"
                onClick={() => selectQuickDestination(dest.name)}
              >
                <div className="icon">
                  <span role="img" aria-label="location">{dest.icon}</span>
                </div>
                <span>{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <div className="panel-header">
            <h2>Solicitar corrida</h2>
            <p>Tarifa estimada antes de confirmar.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ORIGEM</label>
              <div className="input-field">
                <div className="icon origin">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Onde você está?"
                  value={rideRequest.origem}
                  onChange={(e) => handleInputChange('origem', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>DESTINO</label>
              <div className="input-field">
                <div className="icon destination">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Pra onde vai?"
                  value={rideRequest.destino}
                  onChange={(e) => handleInputChange('destino', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>QUANTIDADE DE PESSOAS</label>
              <div className="passenger-count">
                <div className="input-field">
                  <div className="passenger-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="currentColor"/>
                      <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: '19px', fontWeight: '600', color: '#1F1F1F' }}>
                    {rideRequest.passageiros}
                  </span>
                  <div className="count-controls">
                    <button
                      type="button"
                      className="count-btn"
                      onClick={() => handlePassengerChange(false)}
                      disabled={rideRequest.passageiros <= 1}
                    >
                      <svg width="14" height="2" viewBox="0 0 14 2">
                        <line x1="0" y1="1" x2="14" y2="1" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="count-btn"
                      onClick={() => handlePassengerChange(true)}
                      disabled={rideRequest.passageiros >= 4}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <line x1="7" y1="0" x2="7" y2="14" stroke="currentColor" strokeWidth="2"/>
                        <line x1="0" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {submitMessage && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: submitMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                color: submitMessage.type === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${submitMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                fontSize: '14px'
              }}>
                {submitMessage.text}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Solicitando...' : 'Solicitar corrida'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}