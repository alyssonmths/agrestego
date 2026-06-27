'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../components/AuthGuard'
import './corridas.css'

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

type CorridaFinalizada = {
  id: number
  valor: number
  inicio: string
  fim: string | null
  status: string
  origem: Bairro
  destino: Bairro
  motorista: Motorista | null
}

export default function CorridasPage() {
  const [corridas, setCorridas] = useState<CorridaFinalizada[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadCorridas = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Você precisa estar autenticado para ver suas corridas.')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/corrida/minhas-finalizadas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || 'Não foi possível carregar suas corridas.')
        }

        const data = await response.json()
        setCorridas(data)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Erro inesperado ao carregar corridas.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCorridas()
  }, [])

  const handleOpenCorrida = (id: number) => {
    router.push(`/acompanhar-corrida?id=${id}`)
  }

  return (
    <AuthGuard>
      <div className="corridas-passageiro">
        <header className="header-corridas">
          <div className="logo-section">
            <img src="/logos/2-removebg-preview.png" alt="Logotipo AgresteGo" />
          </div>

          <nav className="nav-links">
            <Link href="/home-passageiro" className="nav-link">Início</Link>
            <Link href="/corridas" className="nav-link active">Corridas</Link>
            <Link href="/perfil-passageiro" className="nav-link">Perfil</Link>
          </nav>
        </header>

        <main className="corridas-content">
          <div className="titulo-corridas">
            <div>
              <h1>Minhas corridas</h1>
              <p>Veja o histórico das viagens que você já concluiu.</p>
            </div>
            <span className="badge-finalizadas">● Finalizadas</span>
          </div>

          {isLoading ? (
            <div className="estado-card">Carregando corridas...</div>
          ) : error ? (
            <div className="estado-card error-card">{error}</div>
          ) : corridas.length === 0 ? (
            <div className="estado-card">Você ainda não possui corridas finalizadas.</div>
          ) : (
            <section className="corridas-lista">
              {corridas.map((corrida) => (
                <article
                  key={corrida.id}
                  className="card-corridas"
                  onClick={() => handleOpenCorrida(corrida.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleOpenCorrida(corrida.id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-info">
                    <div className="ponto-linha">
                      <span className="ponto-origem"></span>
                      <div>
                        <small>Origem</small>
                        <p>{corrida.origem?.nome || 'Origem não informada'}</p>
                      </div>
                    </div>

                    <div className="ponto-linha">
                      <span className="ponto-destino"></span>
                      <div>
                        <small>Destino</small>
                        <p>{corrida.destino?.nome || 'Destino não informado'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-corrida-acoes">
                    <span className="badge-status">Finalizada</span>
                    <span className="badge-valor">R$ {corrida.valor}</span>
                    <span className="badge-data">
                      {corrida.fim ? new Date(corrida.fim).toLocaleString('pt-BR') : 'Data indisponível'}
                    </span>
                    {corrida.motorista && (
                      <span className="badge-motorista">Motorista: {corrida.motorista.nome}</span>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
