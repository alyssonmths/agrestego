
"use client"
import "./home-motorista.css";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

export default function HomeMotorista(){
    return(
      <AuthGuard>
         <div className="perfil-passageiro">
            <header className="header-perfil">
                <div className="logo">
                    <img src="/logos/2-removebg-preview.png" alt="Logotipo AgresteGo" />
                </div>
                <nav className="links">
                <Link href={"/"}>Início</Link>
                <Link href={"corridas"}>Corridas</Link>
                <Link href={"perfil"}>Perfil</Link>
                </nav>
            </header>
            <div className="titulo-perfil">
                <div>
                <h1>Corridas disponíveis</h1>
                <p>Você está online-receba pedidos próximos da sua região.</p>
                </div>
            <span className="badge-online">● Online</span>
            </div>

            <section className="corridas-lista">
                <article className="card-corridas">
                    <div className="card-info">
                        <div className="ponto-linha">
                            <span className="ponto-origem"></span>
                            <div>
                                <small>ORIGEM</small>
                                <p>Centro, Caruaru</p>
                            </div>
                        </div>
                         <div className="ponto-linha">
                <span className="ponto-destino"></span>
                <div>
                    <small>DESTINO</small>
                    <p>Universidade FAVIP</p>
                </div>
            </div>
            <div className="card-badges">
                <span className="badge-info">1 pessoa</span>
                <span className="badge-info">4.2 km</span>
                <span className="badge-preco">R$ 14,50</span>
            </div>
        </div>
        <div className="card-corrida-acoes">
            <button className="btn-aceitar">Aceitar</button>
            <button className="btn-rejeitar">Rejeitar</button>
   
                    </div>
                </article>
                
                 </section>
            </div>
      </AuthGuard>
        );
}
