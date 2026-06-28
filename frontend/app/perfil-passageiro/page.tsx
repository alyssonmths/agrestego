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

type EnderecoFormData = {
    apelido: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento: string;
};

type EnderecoFormErrors = Partial<Record<keyof EnderecoFormData, string>>;

type Endereco = {
    id: number;
    apelido: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
    criadoEm?: string;
};

export default function PerfilPassageiro() {
    const [formData, setFormData] = useState<PerfilFormData>({
        nome: "",
        email: "",
        celular: "",
    });
    const [errors, setErrors] = useState<PerfilFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [enderecoForm, setEnderecoForm] = useState<EnderecoFormData>({
        apelido: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        complemento: "",
    });
    const [enderecoErrors, setEnderecoErrors] = useState<EnderecoFormErrors>({});
    const [isSavingEndereco, setIsSavingEndereco] = useState(false);
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);

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

    function handleEnderecoChange(field: keyof EnderecoFormData, value: string) {
        setEnderecoForm((prev) => ({ ...prev, [field]: value }));

        if (enderecoErrors[field]) {
            setEnderecoErrors((prev) => {
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

    function validateEndereco() {
        let newErrors: EnderecoFormErrors = {};

        if (!enderecoForm.apelido) newErrors.apelido = 'Apelido obrigatório';
        if (!enderecoForm.logradouro) newErrors.logradouro = 'Logradouro obrigatório';
        if (!enderecoForm.numero) newErrors.numero = 'Número obrigatório';
        if (!enderecoForm.bairro) newErrors.bairro = 'Bairro obrigatório';
        if (!enderecoForm.cidade) newErrors.cidade = 'Cidade obrigatória';
        if (!enderecoForm.estado) newErrors.estado = 'Estado obrigatório';
        if (!enderecoForm.cep) newErrors.cep = 'CEP obrigatório';

        setEnderecoErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function showToast(type: 'success' | 'error', message: string) {
        setToast({ visible: true, type, message });
    }

    useEffect(() => {
        async function fetchProfileAndImage() {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                // Requisitar dados do perfil do passageiro
                const profileRes = await fetch(`${API_URL}/passageiro`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (profileRes.ok) {
                    const profileData = await profileRes.json().catch(() => ({}));
                    setFormData((prev) => ({
                        ...prev,
                        nome: profileData.nome || '',
                        email: profileData.email || '',
                        celular: formatCelular(profileData.celular || ''),
                    }));
                }

                // Requisitar endereços salvos
                try {
                    const addrRes = await fetch(`${API_URL}/passageiro/enderecos`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (addrRes.ok) {
                        const list = await addrRes.json().catch(() => []);
                        setEnderecos(list || []);
                    }
                } catch (e) {
                    // ignorar
                }

                // Requisitar imagem de perfil
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
                // ignorar
            }
        }

        fetchProfileAndImage();

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

    async function handleSaveEndereco(e: FormEvent) {
        e.preventDefault();
        if (!validateEndereco()) return;
        setIsSavingEndereco(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado. Faça login novamente.');
            }

            const response = await fetch(`${API_URL}/passageiro/enderecos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(enderecoForm),
            });

            const data = await response.json();
            if (!response.ok) {
                const message = data.message || 'Erro ao salvar o endereço. Tente novamente.';
                showToast('error', message);
                setIsSavingEndereco(false);
                return;
            }

            setEnderecoForm({
                apelido: '',
                logradouro: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
                complemento: '',
            });
            setEnderecoErrors({});
            showToast('success', 'Endereço salvo com sucesso!');
        } catch (error) {
            console.error(error);
            showToast('error', 'Erro ao salvar endereço. Verifique sua conexão ou faça login novamente.');
        } finally {
            setIsSavingEndereco(false);
        }
    }

    async function handleDeleteEndereco(id: number) {
        if (!confirm('Confirma exclusão deste endereço?')) return;
        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('Token não encontrado');

            const res = await fetch(`${API_URL}/passageiro/enderecos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                showToast('error', 'Não foi possível excluir o endereço');
                return;
            }

            setEnderecos((prev) => prev.filter((e) => e.id !== id));
            showToast('success', 'Endereço excluído');
        } catch (err) {
            console.error(err);
            showToast('error', 'Erro ao excluir endereço');
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
                        <Link href={"/corridas-finalizadas-passageiro"}>Corridas</Link>
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
                            <span className="badge-numero">{enderecos.length}</span>
                        </header>
                        {enderecos.map((endereco) => (
                            <div key={endereco.id} className="endereco-item">
                                <span className="icone">🏠</span>
                                <div>
                                    <strong>{endereco.apelido}</strong>
                                    <span>{`${endereco.logradouro}, ${endereco.numero} — ${endereco.cidade}/${endereco.estado}`}</span>
                                </div>
                                <div className="endereco-acoes">
                                    <button onClick={() => handleDeleteEndereco(endereco.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}

                        <div className="adicionar-box">
                            <p className="adicionar-titulo">+ Adicionar endereços</p>

                            <form onSubmit={handleSaveEndereco}>
                                <div className="form-group">
                                    <label>RÓTULO</label>
                                    <input
                                        value={enderecoForm.apelido}
                                        onChange={(e) => handleEnderecoChange('apelido', e.target.value)}
                                        placeholder="Casa da vovó"
                                        className={enderecoErrors.apelido ? 'error' : ''}
                                    />
                                    {enderecoErrors.apelido && <p className="error-text">{enderecoErrors.apelido}</p>}
                                </div>
                                <div className="form-group">
                                    <label>LOGRADOURO</label>
                                    <input
                                        value={enderecoForm.logradouro}
                                        onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                                        placeholder="Rua das Flores"
                                        className={enderecoErrors.logradouro ? 'error' : ''}
                                    />
                                    {enderecoErrors.logradouro && <p className="error-text">{enderecoErrors.logradouro}</p>}
                                </div>
                                <div className="form-group">
                                    <label>NÚMERO</label>
                                    <input
                                        value={enderecoForm.numero}
                                        onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                                        placeholder="123"
                                        className={enderecoErrors.numero ? 'error' : ''}
                                    />
                                    {enderecoErrors.numero && <p className="error-text">{enderecoErrors.numero}</p>}
                                </div>
                                <div className="form-group">
                                    <label>BAIRRO</label>
                                    <input
                                        value={enderecoForm.bairro}
                                        onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                                        placeholder="Centro"
                                        className={enderecoErrors.bairro ? 'error' : ''}
                                    />
                                    {enderecoErrors.bairro && <p className="error-text">{enderecoErrors.bairro}</p>}
                                </div>
                                <div className="form-group">
                                    <label>CIDADE</label>
                                    <input
                                        value={enderecoForm.cidade}
                                        onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                                        placeholder="Caruaru"
                                        className={enderecoErrors.cidade ? 'error' : ''}
                                    />
                                    {enderecoErrors.cidade && <p className="error-text">{enderecoErrors.cidade}</p>}
                                </div>
                                <div className="form-group">
                                    <label>ESTADO</label>
                                    <input
                                        value={enderecoForm.estado}
                                        onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                                        placeholder="PE"
                                        className={enderecoErrors.estado ? 'error' : ''}
                                    />
                                    {enderecoErrors.estado && <p className="error-text">{enderecoErrors.estado}</p>}
                                </div>
                                <div className="form-group">
                                    <label>CEP</label>
                                    <input
                                        value={enderecoForm.cep}
                                        onChange={(e) => handleEnderecoChange('cep', e.target.value)}
                                        placeholder="55000-000"
                                        className={enderecoErrors.cep ? 'error' : ''}
                                    />
                                    {enderecoErrors.cep && <p className="error-text">{enderecoErrors.cep}</p>}
                                </div>
                                <div className="form-group">
                                    <label>COMPLEMENTO (opcional)</label>
                                    <input
                                        value={enderecoForm.complemento}
                                        onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                                        placeholder="Apto 101"
                                    />
                                </div>
                                <button className="btn-adicionar" disabled={isSavingEndereco}>
                                    {isSavingEndereco ? 'Salvando...' : 'Adicionar'}
                                </button>
                            </form>
                        </div>
                    </article>
                </section>
            </div>

        </AuthGuard>
    );
}