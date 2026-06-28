'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AuthGuard from '../components/AuthGuard'
import './acompanhar-corrida.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

type Bairro = {
  id: number
  nome: string
}

type Motorista = {
  id: number
  nome: string
  placa: string
  veiculo: string
}

type Pagamento = {
  id: number
  metodo: string | null
  status: string
  valor: number
}

type Avaliacao = {
  notaCorrida: number | null
  notaPassageiro: number | null
  notaMotorista: number | null
}

type RideDetails = {
  id: number
  status: string
  valor: number
  inicio: string
  fim: string | null
  origem: Bairro
  destino: Bairro
  motorista: Motorista | null
  pagamento: Pagamento | null
  avaliacao: Avaliacao | null
}

function AcompanharCorridaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [ride, setRide] = useState<RideDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'CARTAO' | 'PIX' | 'DINHEIRO'>('CARTAO')
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)
  const [reviewCorrida, setReviewCorrida] = useState<number>(0)
  const [reviewMotorista, setReviewMotorista] = useState<number>(0)
  const [reviewMessage, setReviewMessage] = useState<string | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const refreshRide = async (rideId: string) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/')
      return null
    }

    try {
      const response = await fetch(`${API_URL}/corrida/${rideId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Não foi possível carregar os detalhes da corrida.')
      }

      const data = await response.json()
      setRide(data)

      if (data.avaliacao) {
        setReviewCorrida(data.avaliacao.notaCorrida ?? 0)
        setReviewMotorista(data.avaliacao.notaMotorista ?? 0)
      } else {
        setReviewCorrida(0)
        setReviewMotorista(0)
      }

      return data
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes da corrida.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) {
      setError('ID da corrida não informado.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    refreshRide(id)
  }, [searchParams, router])

  const handlePay = async () => {
    const id = searchParams.get('id')
    if (!id) {
      setError('ID da corrida não informado.')
      return
    }

    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/')
      return
    }

    setIsPaying(true)
    setPaymentMessage(null)

    try {
      const response = await fetch(`${API_URL}/corrida/${id}/pagar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metodo: paymentMethod }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Não foi possível realizar o pagamento.')
      }

      await refreshRide(id)
      setPaymentMessage(`Pagamento realizado com sucesso via ${paymentMethod.toLowerCase()}.`)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao processar o pagamento.')
    } finally {
      setIsPaying(false)
    }
  }

  const handleSubmitReview = async () => {
    const id = searchParams.get('id')
    if (!id) {
      setReviewError('ID da corrida não informado.')
      return
    }

    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/')
      return
    }

    if (reviewCorrida < 1 || reviewMotorista < 1) {
      setReviewError('Selecione as duas notas antes de enviar sua avaliação.')
      return
    }

    setIsSubmittingReview(true)
    setReviewMessage(null)
    setReviewError(null)

    try {
      const response = await fetch(`${API_URL}/corrida/avaliar-passageiro`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corridaId: Number(id),
          notaCorrida: reviewCorrida,
          notaMotorista: reviewMotorista,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Não foi possível enviar a avaliação.')
      }

      await refreshRide(id)
      setReviewMessage('Avaliação enviada com sucesso. Obrigado pelo feedback!')
    } catch (err) {
      console.error(err)
      setReviewError(err instanceof Error ? err.message : 'Erro ao enviar a avaliação.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="acompanhar-corrida">
          <div className="ride-status-card">
            <p>Carregando os detalhes da corrida...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error || !ride) {
    return (
      <AuthGuard>
        <div className="acompanhar-corrida">
          <div className="ride-status-card error-card">
            <p>{error || 'Corrida não encontrada.'}</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const reviewSubmitted = Boolean(
    ride.avaliacao?.notaCorrida != null && ride.avaliacao?.notaMotorista != null
  )

  return (
    <AuthGuard>
      <div className="acompanhar-corrida">
        <header className="header-acompanhar">
          <div className="logo-section">
            <img src="/logos/2-removebg-preview.png" alt="Logotipo AgresteGo" />
          </div>

          <div className="title-section">
            <h1>Acompanhamento da corrida</h1>
            <p>Veja o status, origem, destino e valores da sua viagem.</p>
          </div>
        </header>

        <main className={`detail-content${ride.status.toLowerCase() === 'finalizada' ? ' with-review' : ''}`}>
          <div className="ride-status-card">
            <div className="status-header">
              <h2>Status atual</h2>
              <span className={`status-badge status-${ride.status.toLowerCase()}`}>{ride.status}</span>
            </div>

            <div className="ride-info-grid">
              <div>
                <strong>Origem</strong>
                <p>{ride.origem.nome}</p>
              </div>
              <div>
                <strong>Destino</strong>
                <p>{ride.destino.nome}</p>
              </div>
              <div>
                <strong>Valor</strong>
                <p>R$ {ride.valor.toFixed(2)}</p>
              </div>
              <div>
                <strong>Início</strong>
                <p>{new Date(ride.inicio).toLocaleString()}</p>
              </div>
              <div>
                <strong>Fim previsto</strong>
                <p>{ride.fim ? new Date(ride.fim).toLocaleString() : 'Em andamento'}</p>
              </div>
            </div>

            {ride.motorista ? (
              <div className="driver-card">
                <h3>Motorista</h3>
                <p>{ride.motorista.nome}</p>
                <p>{ride.motorista.veiculo} • {ride.motorista.placa}</p>
              </div>
            ) : (
              <div className="driver-card pending-card">
                <h3>Motorista</h3>
                <p>Aguardando motorista aceitar a corrida.</p>
              </div>
            )}

            {ride.status.toLowerCase() === 'finalizada' && (
              <div className="payment-card">
                <button type="button"
                className="btn-voltar-inicio"
                onClick={() => window.location.href= '/home-passageiro'}>
                  Voltar ao inicio
                </button>
                <div className="payment-card-header">
                  <h3>Pagamento</h3>
                  <div className="payment-actions">
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value as 'CARTAO' | 'PIX' | 'DINHEIRO')}
                      disabled={isPaying || ride.pagamento?.status === 'PAGO'}
                    >
                      <option value="CARTAO">CARTÃO</option>
                      <option value="PIX">PIX</option>
                      <option value="DINHEIRO">DINHEIRO</option>
                    </select>
                    <button type="button" onClick={handlePay} disabled={isPaying || ride.pagamento?.status === 'PAGO'}>
                      {isPaying ? 'Processando...' : 'PAGAR'}
                    </button>
                  </div>
                </div>

                {ride.pagamento ? (
                  <>
                    <p>Status: {ride.pagamento.status}</p>
                    <p>Valor: R$ {ride.pagamento.valor.toFixed(2)}</p>
                    <p>Método: {ride.pagamento.metodo ?? 'Não definido'}</p>
                  </>
                ) : (
                  <p>Ainda não há informações de pagamento para esta corrida.</p>
                )}

                {paymentMessage && <p className="payment-message">{paymentMessage}</p>}
              </div>
            )}
          </div>

          {ride.status.toLowerCase() === 'finalizada' && (
            <div className="review-card">
              <h3>Avaliação da corrida</h3>
              <p>Como foi sua viagem?</p>

              <div className="review-rating-group">
                <span>Nota corrida</span>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={`corrida-${star}`}
                      type="button"
                      className={`review-star ${reviewCorrida >= star ? 'selected' : ''}`}
                      onClick={() => !reviewSubmitted && setReviewCorrida(star)}
                      disabled={reviewSubmitted}
                      aria-label={`Nota corrida ${star} estrela${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-rating-group">
                <span>Nota motorista</span>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={`motorista-${star}`}
                      type="button"
                      className={`review-star ${reviewMotorista >= star ? 'selected' : ''}`}
                      onClick={() => !reviewSubmitted && setReviewMotorista(star)}
                      disabled={reviewSubmitted}
                      aria-label={`Nota motorista ${star} estrela${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {reviewSubmitted ? (
                <div className="review-summary">
                  <p>Avaliação registrada</p>
                  <p>Nota corrida: {ride.avaliacao?.notaCorrida ?? '—'}</p>
                  <p>Nota motorista: {ride.avaliacao?.notaMotorista ?? '—'}</p>
                </div>
              ) : (
                <button
                  type="button"
                  className="review-submit-button"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? 'Enviando...' : 'Enviar avaliação'}
                </button>
              )}

              {reviewMessage && <p className="review-message">{reviewMessage}</p>}
              {reviewError && <p className="review-error">{reviewError}</p>}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

export default function AcompanharCorridaPage() {
  return (
    <Suspense fallback={<div className="acompanhar-corrida"><div className="ride-status-card"><p>Carregando...</p></div></div>}>
      <AcompanharCorridaContent />
    </Suspense>
  )
}
