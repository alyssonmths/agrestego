"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import "./cadastro-passageiro.css";

export default function CadastroPassageiro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    celular: "",
    senha: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    let newErrors: any = {};

    if (!formData.nome) newErrors.nome = "Nome obrigatório";
    if (!formData.email.includes("@")) newErrors.email = "Email inválido";
    if (formData.celular.length < 15) newErrors.celular = "Celular inválido";
    if (formData.senha.length < 8) newErrors.senha = "Mínimo 8 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      alert("Cadastro realizado!");
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="cadastro-passageiro">

      {/* HEADER */}
      <header className="header-cadastro">
        <div className="logo">
          <div className="dot"></div>
          <h1>AgresteGo</h1>
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

          <div className="form-grid single-column">
            <div className="form-group">
              <label>NOME COMPLETO</label>
              <input
              placeholder="Maria Bonita"
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
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>CELULAR</label>
              <input  
              placeholder="(81) 90000-0000"
              value={formData.celular}
              onChange={(e) => handleChange("celular", e.target.value)}/>
              {errors.celular && <div className="error-text">{errors.celular}</div>}
            </div>
          </div>

          <div className="form-grid single-column">
            <div className="form-group">
              <label>SENHA</label>
              <input 
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.senha}
              onChange={(e) => handleChange("senha", e.target.value)}/>
             
              {errors.senha && <div className="error-text">{errors.senha}</div>}
            </div>
          </div>

          <button className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar minha conta"}
            </button>
            
            <p className="login-link">Já tem conta? <Link href="/login">Entrar</Link>
            </p>

        </form>
      </div>
    </div>
  );
}