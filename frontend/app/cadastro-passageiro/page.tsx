"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../components/Toast";
import "./cadastro-passageiro.css";
import { FormData, FormErrors } from "./interfaces/form";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CadastroPassageiro() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    celular: "",
    senha: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
    visible: false,
    type: 'success',
    message: '',
  });

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ visible: true, type, message });
  }

  function handleChange(field: keyof FormData, value: string) {
    let formattedValue = value;
    if (field === 'celular') {
      formattedValue = formatCelular(value);
    }
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));

    if (errors[field]) {
      setErrors((prev: FormErrors) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  function validate(): boolean {
    let newErrors: FormErrors = {};

    if (!formData.nome) newErrors.nome = "Nome obrigatório";
    if (!(/\S+@\S+\.\S+/).test(formData.email)) newErrors.email = "Email inválido";
    if (!(/^\(\d{2}\)\s\d{5}-\d{4}$/).test(formData.celular)) newErrors.celular = "Formato: (81) 90000-0000";
    if (formData.senha.length < 8) newErrors.senha = "Mínimo 8 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function formatCelular(value: string): string {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) return `(${cleaned}`
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup-passageiro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          celular: formData.celular,
          senha: formData.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || "Erro ao criar conta. Tente novamente.";
        showToast('error', msg);
        setIsSubmitting(false);
        return;
      }

      // Salvar token no localStorage
      localStorage.setItem("access_token", data.access_token);

      // Mostrar toast de sucesso e redirecionar
      showToast('success', 'Conta criada com sucesso!');
      setTimeout(() => router.push("/home-passageiro"), 1200);
    } catch (error) {
      console.error("Erro:", error);
      const msg = "Erro de conexão com o servidor. Tente novamente.";
      showToast('error', msg);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="cadastro-passageiro">

      {/* HEADER */}
      <header className="header-cadastro">
        <div className="logo">
          <img src="/logos/2-removebg-preview.png" alt="Logotipo AgresteGo" />
        </div>

        <Link href="/" className="back-link">
          ← Voltar ao início
        </Link>
      </header>

      {/* ESQUERDA */}
      <div className="left-panel">
        <div className="badge">
          <p>PARA PASSAGEIROS</p>
        </div>

        <h2>
          Chame uma corrida com a confiança de quem é da terra.
        </h2>

        <p>
          Cadastro rápido para começar a viajar com motoristas locais verificados.
        </p>
        <p className="left-footer">AGRESTE GO · DAQUI PRA ALI, SEM ARRODEIO</p>
      </div>

      {/* DIREITA */}
      <div className="right-panel">

        <div className="form-header">
          <h1>Cadastro de passageiro</h1>
          <p>Em menos de um minuto você está pronto para a primeira corrida.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <Toast
            visible={toast.visible}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast((s) => ({ ...s, visible: false }))}
          />

          <div className="form-grid single-column">
            <div className="form-group">
              <label>NOME COMPLETO</label>
              <input
                placeholder="Maria Bonita"
                maxLength={50}
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
              {errors.nome && <div className="error-text">{errors.nome}</div>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>EMAIL</label>
              <input
                placeholder="voce@email.com"
                maxLength={50}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>CELULAR</label>
              <input
                type="tel"
                placeholder="(81) 90000-0000"
                value={formData.celular}
                onChange={(e) => handleChange("celular", e.target.value)}
                maxLength={15}
                className={errors.celular ? 'error' : ''}
              />
              {errors.celular && <div className="error-text">{errors.celular}</div>}
            </div>
          </div>

          <div className="form-grid single-column">
            <div className="form-group">
              <label>SENHA</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                maxLength={20}
                value={formData.senha}
                onChange={(e) => handleChange("senha", e.target.value)} />

              {errors.senha && <div className="error-text">{errors.senha}</div>}
            </div>
          </div>

          <button className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar minha conta"}
          </button>

          <p className="login-link">Já tem conta? <Link href="/">Entrar</Link>
          </p>

        </form>
      </div>
    </div>
  );
}