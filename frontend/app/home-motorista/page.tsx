
"use client"
import "./home-motorista.css";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import {useState, useEffect} from "react";
import Toast from "../components/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'


export default function HomeMotorista(){
    const [corridas, setCorridas] = useState<any[]>([]);
    const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
        visible: false,
        type: 'success',
        message: '',
    });
    function showToast(type: 'success' | 'error', message: string) {
        setToast({ visible: true, type, message });
    }
    useEffect(() => {
        buscarCorridas();
    }, []);
    const buscarCorridas = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/corrida`, {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.json();
        setCorridas(data);
    };
    const aceitarCorrida= async (id: number) =>{
        const token =localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/corrida/${id}/aceitar`,{
            method: "PUT",
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        // endpoint returns corrida when accepted; if it does, redirect and show toast
        try{
            const data = await response.json();
            if (data?.id){
                showToast('success', 'Corrida aceita com sucesso');
                // give user a moment to see toast, then navigate
                setTimeout(() => {
                    window.location.href = `/corrida-em-andamento/${data.id}`;
                }, 700);
            }
        } catch (e) {
            // fallback: if no body but success status, navigate
            if (response.ok) {
                showToast('success', 'Corrida aceita com sucesso');
                setTimeout(() => {
                    window.location.href = `/corrida-em-andamento/${id}`;
                }, 700);
            }
        }
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
                                <p>Bairro {corrida.origem?.nome}</p>
                            </div>

                        </div>
                        <div className="ponto-linha">
                            <span className="ponto-destino"></span>
                            <div>
                                <small>Destino</small>
                                <p>Bairro {corrida.destino?.nome}</p>

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
                            <Toast
                                visible={toast.visible}
                                type={toast.type}
                                message={toast.message}
                                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
                        />
              </div>
      </AuthGuard>
        );
}
