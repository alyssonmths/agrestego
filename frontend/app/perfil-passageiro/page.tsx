"use client";
 import Link from "next/link";
 import "./perfil-passageiro.css";

export default function PerfilPassageiro(){
    return(
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
                <h1>Meu perfil</h1>
                <p>Atualize suas informações e gerencie endereços salvos</p>
            </div>
            {/*esquerda*/}
            <section className="cards-container">
                <article className="card">
                    <header className="card-header">
                        <div className="avatar">M</div>
                        <div>
                        <h2>Informações da conta</h2>
                        <p>Mantenha seus dados em dia.</p>
                        </div>
                    </header>
            
            <div className="form-group">
                <label>NOME COMPLETO</label>
                <input 
                placeholder="Maria Bonita"
                maxLength={50}
                ></input>
            </div>
            <div className="form-group">
                <label>EMAIL</label>
                <input
                placeholder="maria@email.com"
                maxLength={50}></input>
            </div>
            <div className="form-group">
                <label>CELULAR</label>
                <input
                placeholder="(81)99999-0000"
                maxLength={15}></input>
            </div>
            <button className="btn-salvar">Salvar alterações</button>
        
            </article>

              {/*direita*/} 
               
                <article className="card">
                    <header className="card-header">
                        <div>
                        <h2>Endereços salvos</h2>
                        <p>Acesse rapidamente nas próximas corridas.</p>
                        </div>
                        <span className="badge-numero">2</span>
                    </header>
                    
                    <div className="endereco-item ">
                    <span className="icone">🏠</span>
                    <div>
                        <strong>Casa</strong>
                        <span>Rua das Acácias, 123 — Caruaru/PE</span>
                    </div>
                    <div className="endereco-acoes">
                    <button>✏️</button>
                    <button>🗑️</button>
                    </div>
                </div>
                    
                     <div className="endereco-item">
            <span className="icone-endereco">💼</span>
            <div>
                <strong>Trabalho</strong>
                <span>Polo de Confecções, Loja 42 — Caruaru/PE</span>
            </div>
            <div className="endereco-acoes">
                <button>✏️</button>
                <button>🗑️</button>
            </div>
        </div>

        <div className="adicionar-box">
            <p className="adicionar-titulo  ">+ Adicionar endereços</p>

            <div className="form-group">
                <label>RÓTULO</label>
                <input
                placeholder="Casa da vovó"></input>
            </div>
            <div className="form-group">
                <label>ENDEREÇO COMPLETO</label>
                <input
                placeholder="Rua, número, bairro, cidade"></input>
            </div>
            <button className="btn-adicionar">Adicionar</button>
        </div>
                </article>
               </section>
               </div>
    );
}