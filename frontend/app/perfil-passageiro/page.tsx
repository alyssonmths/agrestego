"use client";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import Toast from "../components/Toast";
import "./perfil-passageiro.css";
import { useState, FormEvent, useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type PerfilFormData = {
    nome: string;
    email: string;
    celular: string;
};

type PerfilFormErrors = Partial<Record<keyof PerfilFormData, string>>;

export default function PerfilPassageiro() {
    const [formData, setFormData] = useState<PerfilFormData>({
        nome: "",
        email: "",
        celular: "",
    });
    const [errors, setErrors] = useState<PerfilFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
        visible: false,
        type: 'success',
        message: '',
    });

    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const prevObjectUrlRef = useRef<string | null>(null);

    function formatCelular(value: string): string {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) return `(${cleaned}`;
        if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }

    function handleChange(field: keyof PerfilFormData, value: string) {
        let formattedValue = value;
        if (field === 'celular') {
            formattedValue = formatCelular(value);
        }

        setFormData((prev) => ({ ...prev, [field]: formattedValue }));

        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    }

    function validate() {
        let newErrors: PerfilFormErrors = {};

        if (!formData.nome) newErrors.nome = "Nome obrigatório";
        if (!(/\S+@\S+\.\S+/).test(formData.email)) newErrors.email = "Email inválido";
        if (!(/^\(\d{2}\)\s\d{5}-\d{4}$/).test(formData.celular)) newErrors.celular = "Formato: (81) 90000-0000";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function showToast(type: 'success' | 'error', message: string) {
        setToast({ visible: true, type, message });
    }

    useEffect(() => {
        async function fetchImage() {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const res = await fetch(`${API_URL}/passageiro/image`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) return;

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                prevObjectUrlRef.current && URL.revokeObjectURL(prevObjectUrlRef.current);
                prevObjectUrlRef.current = url;
                setProfileImageUrl(url);
            } catch (err) {
                // silently ignore
            }
        }

        fetchImage();

        return () => {
            if (prevObjectUrlRef.current) {
                URL.revokeObjectURL(prevObjectUrlRef.current);
            }
        };
    }, []);

    async function handleFileChange(e: any) {
        const file = e.target?.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('Token de autenticação não encontrado');

            const formData = new FormData();
            formData.append('arquivo', file);

            const res = await fetch(`${API_URL}/passageiro/image`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const message = data?.message || 'Erro ao enviar imagem';
                showToast('error', message);
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            prevObjectUrlRef.current && URL.revokeObjectURL(prevObjectUrlRef.current);
            prevObjectUrlRef.current = url;
            setProfileImageUrl(url);
            showToast('success', 'Imagem atualizada com sucesso');
        } catch (err) {
            console.error(err);
            showToast('error', 'Erro ao atualizar imagem');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    function handleAvatarClick() {
        if (isUploading) return;
        fileInputRef.current?.click();
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado. Faça login novamente.');
            }

            const response = await fetch(`${API_URL}/passageiro`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    celular: formData.celular,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                const message = data.message || 'Erro ao salvar alterações. Tente novamente.';
                showToast('error', message);
                setIsSubmitting(false);
                return;
            }

            showToast('success', 'Alterações salvas!');
        } catch (error) {
            console.error(error);
            showToast('error', 'Erro ao atualizar perfil. Verifique sua conexão ou faça login novamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthGuard>
            <div className="perfil-passageiro">
                <header className="header-perfil">
                    <div className="logo">
                        <img src="/logos/2-removebg-preview.png" alt="Logotipo AgresteGo" />
                    </div>
                    <nav className="links">
                        <Link href={"/home-passageiro"}>Início</Link>
                        <Link href={"corridas"}>Corridas</Link>
                        <Link href={"/perfil-passageiro"}>Perfil</Link>
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
                            <div className="avatar-container">
                                <div className="avatar" onClick={handleAvatarClick} role="button" tabIndex={0}>
                                    {profileImageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={profileImageUrl} alt="Avatar" />
                                    ) : (
                                        <span>M</span>
                                    )}

                                    <div className={`avatar-overlay ${isUploading ? 'uploading' : ''}`}>
                                        {isUploading ? (
                                            <div className="spinner" aria-hidden="true"></div>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 3v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 8l5-5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M21 21H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                            </div>
                            <div>
                                <h2>Informações da conta</h2>
                                <p>Mantenha seus dados em dia.</p>
                            </div>
                        </header>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>NOME COMPLETO</label>
                                <input
                                    placeholder="Maria Bonita"
                                    maxLength={50}
                                    value={formData.nome}
                                    onChange={(e) => handleChange("nome", e.target.value)}
                                    className={errors.nome ? 'error' : ''}
                                />
                                {errors.nome && <p className="error-text">{errors.nome}</p>}
                            </div>
                            <div className="form-group">
                                <label>EMAIL</label>
                                <input
                                    placeholder="maria@email.com"
                                    maxLength={50}
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <p className="error-text">{errors.email}</p>}
                            </div>

                            <div className="form-group">
                                <label>CELULAR</label>
                                <input
                                    type="tel"
                                    placeholder="(81) 90000-0000"
                                    maxLength={15}
                                    value={formData.celular}
                                    onChange={(e) => handleChange("celular", e.target.value)}
                                    className={errors.celular ? 'error' : ''}
                                />
                                {errors.celular && <p className="error-text">{errors.celular}</p>}

                            </div>
                            <button className="btn-salvar" disabled={isSubmitting}>
                                {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                            </button>
                        </form>
                    </article>
                    <Toast
                        visible={toast.visible}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
                    />
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

        </AuthGuard>
    );
}