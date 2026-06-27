"use client"
import AuthGuard from "../../components/AuthGuard";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./corrida-em-andamento.css";
import Toast from "../../components/Toast";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function CorridaEmAndamento(){
    const params = useParams();
    const id = params.id;
    const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
        visible: false,
        type: 'success',
        message: '',
    });
    function showToast(type: 'success' | 'error', message: string) {
        setToast({ visible: true, type, message });
    }

    const finalizarCorrida = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/corrida/${id}/finalizar`,{
            method: "PUT",
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            showToast('success', 'Corrida finalizada com sucesso');
            setTimeout(() => {
                window.location.href = "/home-motorista";
            }, 700);
        } else {
            console.error('Falha ao finalizar corrida', response.status);
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