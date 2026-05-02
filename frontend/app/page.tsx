import Link from 'next/link'
import './home.css'

export default function Home() {
  return (
    <>
      <nav className="navbar-home">
        <h1>Agreste Go</h1>
        <p>● Rodando no agreste</p>
      </nav>

      <section className="hero">
        <div className="content">
          <div className="badge">
            <p>Daqui pra ali, sem arrodeio</p>
          </div>
          <h1>Pegue carona com quem conhece <span style={{ color: 'var(--primary)' }}>cada atalho.</span></h1>
          <p>O Agreste Go conecta você a vizinhos profissionais que vivem e entendem a nossa terra. Preço justo, trajeto direto, sem surpresa nenhuma.</p>
        </div>

        <div className="image-container">
          <img src="https://picsum.photos/900/500" alt="Imagem do banner inicial" />
          <div className="security-badge">
            <div className="dot"></div>
            <p>Segurança verificada<span>Toda corrida monitorada</span></p>
          </div>
        </div>
      </section>

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

      <section className="cta-section">
        <div className="cta-content">
          <h2>Pronto para começar?</h2>
          <p>Crie sua conta ou entre para chamar sua próxima corrida no Agreste.</p>
        </div>

        <div className="cta-cards">
          <div className="card">
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
            <p className="subtitle"></p>
            <div className="button-group">
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Senha" />
              <button className="login-btn">Entrar</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Agreste Go - Feito no sertão, para o sertão.</p>
      </footer>
    </>
  )
}