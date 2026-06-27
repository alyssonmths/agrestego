'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../components/AuthGuard'
import './home-passageiro.css'
import { RideRequest } from './interfaces/ride-request'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

type Bairro = {
  id: number
  nome: string
}

export default function HomePassageiro() {
  const [rideRequest, setRideRequest] = useState<RideRequest>({
    origemId: '',
    destinoId: ''
  });
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [isLoadingBairros, setIsLoadingBairros] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'BOM DIA';
    if (hour < 18) return 'BOA TARDE';
    return 'BOA NOITE';
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoadingBairros(false);
      return;
    }

    const loadBairros = async () => {
      try {
        const response = await fetch(`${API_URL}/bairro`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar os bairros.');
        }

        const data = await response.json();
        setBairros(data);
      } catch (error) {
        console.error(error);
        setSubmitMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Erro ao carregar bairros.',
        });
      } finally {
        setIsLoadingBairros(false);
      }
    };

    loadBairros();
  }, []);

  const handleInputChange = (field: keyof RideRequest, value: number | '') => {
    setRideRequest(prev => ({ ...prev, [field]: value }));
    setSubmitMessage(null); // Limpar mensagens de erro ao digitar
  }

  const validateForm = (): boolean => {
    if (rideRequest.origemId === '') {
      setSubmitMessage({ type: 'error', text: 'Por favor, informe a origem da viagem.' });
      return false;
    }

    if (rideRequest.destinoId === '') {
      setSubmitMessage({ type: 'error', text: 'Por favor, informe o destino da viagem.' });
      return false;
    }

    if (rideRequest.origemId === rideRequest.destinoId) {
      setSubmitMessage({ type: 'error', text: 'Origem e destino não podem ser iguais.' });
      return false;
    }

    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setSubmitMessage({ type: 'error', text: 'Token de autenticação não encontrado.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/corrida`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origemId: rideRequest.origemId,
          destinoId: rideRequest.destinoId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao solicitar corrida');
      }

      const data = await response.json();
      setSubmitMessage({
        type: 'success',
        text: 'Corrida solicitada! Redirecionando para acompanhamento...',
      });

      setRideRequest({ origemId: '', destinoId: '' });
      router.push(`/acompanhar-corrida?id=${data.id}`);
    } catch (error) {
      console.error('Erro na solicitação:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <div className="home-passageiro">
      <header className="header-passageiro">
        <div className="logo-section">
          <img src="/logos/2-removebg-preview.png" alt="Logotipo AgresteGo" />
        </div>

        <nav className="nav-links">
          <Link href="/home-passageiro" className="nav-link active">Início</Link>
          <Link href="/corridas" className="nav-link">Corridas</Link>
          <Link href="/perfil-passageiro" className="nav-link">Perfil</Link>
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
                    <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor" />
                  </svg>
                </div>
                <select
                  value={rideRequest.origemId === '' ? '' : String(rideRequest.origemId)}
                  onChange={(e) => handleInputChange('origemId', e.target.value ? Number(e.target.value) : '')}
                  disabled={isLoadingBairros}
                >
                  <option value="">Selecione a origem</option>
                  {bairros.map((bairro) => (
                    <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>DESTINO</label>
              <div className="input-field">
                <div className="icon destination">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor" />
                  </svg>
                </div>
                <select
                  value={rideRequest.destinoId === '' ? '' : String(rideRequest.destinoId)}
                  onChange={(e) => handleInputChange('destinoId', e.target.value ? Number(e.target.value) : '')}
                  disabled={isLoadingBairros}
                >
                  <option value="">Selecione o destino</option>
                  {bairros.map((bairro) => (
                    <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>
                  ))}
                </select>
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
    </AuthGuard>
  )
}