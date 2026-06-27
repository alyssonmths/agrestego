"use client"
import AuthGuard from "../../components/AuthGuard";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./corrida-em-andamento.css";

export default function CorridaEmAndamento(){
    const params = useParams();
    const id = params.id;

    const finalizarCorrida = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:3000/corrida/${id}/finalizar`,{
            method: "PUT",
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if(data){
            window.location.href = "/home-motorista";
        }
    }

    return(
        <AuthGuard>
            <div className="corrida-andamento">
                <header className="header-perfil">
                    <div className="logo">
                        <img src="/logos/2-removebg-preview.png" alt="AgresteGo" />
                    </div>
                    <nav className="links">
                        <Link href="/">Início</Link>
                    </nav>
                </header>

                <div className="andamento-content">
                    <h1>Corrida em andamento</h1>
                    <p>Quando chegar ao destino, finalize a corrida.</p>

                    <div className="corrida-card-andamento">
                        <p>Corrida #{id}</p>
                        <button className="btn-finalizar" onClick={finalizarCorrida}>
                            Finalizar corrida
                        </button>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}