
"use client"
import "./home-motorista.css";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import {useState, useEffect} from "react";


export default function HomeMotorista(){
    const [corridas, setCorridas] = useState<any[]>([]);
    useEffect(() => {
        buscarCorridas();
    }, []);
    const buscarCorridas = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:3000/corrida", {
            headers:{
                Authorization: `Bearer ${token}`,
            }
    });
    const data = await response.json();
    setCorridas(data);
};

    const aceitarCorrida= async (id: number) =>{
        const token =localStorage.getItem("access_token");
        console.log(token);
        const response = await fetch(`http://localhost:3000/corrida/${id}/aceitar`,{
            method: "PUT",
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json(); 
        console.log(data);
    }
    const finalizaCorrida= async (id: number) =>{
        const token =localStorage.getItem("access_token");
        console.log(token);
        const response =await fetch(`http://localhost:3000/corrida/${id}/finalizar`,{
            method: "PUT",
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json(); 
        console.log(data);
    }
    return(
      <AuthGuard>
         <div className="perfil-passageiro">
            <header className="header-perfil">
                <div className="logo">
                    <img src="/logos/2-removebg-preview.png" alt="Logotipo AgresteGo" />
                </div>
                <nav className="links">
                <Link href={"/"}>Início</Link>
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
            {corridas.map((corrida) => (
                <article key={corrida.id} className="card-corridas">
                    <div className="card-info">
                        <div className="ponto-linha">
                            <span className="ponto-origem"></span>
                            <div>
                                <small>Origem</small>
                                <p>Bairro{corrida.origemId}</p>
                            </div>

                        </div>
                        <div className="ponto-linha">
                            <span className="ponto-destino"></span>
                            <div>
                                <small>Destino</small>
                                <p>Bairro {corrida.destinoId}</p>

                            </div>
                        </div>   
                        <div className="card-badges">
                            <span className="badge-valor">R$ {corrida.valor}</span>
                            </div>    
                    </div>
                    <div className="card-corrida-acoes">
                        <button className="btn-aceitar" onClick={() => aceitarCorrida(corrida.id)}>Aceitar</button>
                    </div>
                </article>
            ))}
              </section>
              </div>
      </AuthGuard>
        );
}
