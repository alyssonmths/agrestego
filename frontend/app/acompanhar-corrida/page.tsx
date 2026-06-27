'use client'

import { useEffect, useState } from 'react'
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

export default function AcompanharCorridaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [ride, setRide] = useState<RideDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) {
      setError('ID da corrida não informado.')
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/')
      return
    }

    const loadRide = async () => {
      try {
        const response = await fetch(`${API_URL}/corrida/${id}`, {
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
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes da corrida.')
      } finally {
        setIsLoading(false)
      }
    }

    loadRide()
  }, [searchParams, router])

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

        <main className="detail-content">
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

            {ride.pagamento && (
              <div className="payment-card">
                <h3>Pagamento</h3>
                <p>Status: {ride.pagamento.status}</p>
                <p>Valor: R$ {ride.pagamento.valor.toFixed(2)}</p>
                <p>Método: {ride.pagamento.metodo ?? 'Não definido'}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
