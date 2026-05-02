'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import './cadastro-motorista.css'
import { FormData, FormErrors } from './interfaces/form'


export default function CadastroMotorista() {
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        celular: '',
        cnh: '',
        veiculo: '',
        placa: '',
        senha: ''
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Nome
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome completo é obrigatório'
        } else if (formData.nome.trim().length < 3) {
            newErrors.nome = 'Nome deve ter pelo menos 3 caracteres'
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        // Celular
        const celularRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/
        if (!formData.celular.trim()) {
            newErrors.celular = 'Celular é obrigatório'
        } else if (!celularRegex.test(formData.celular)) {
            newErrors.celular = 'Formato: (81) 90000-0000'
        }

        // CNH
        const cnhRegex = /^\d{11}$/
        if (!formData.cnh.trim()) {
            newErrors.cnh = 'CNH é obrigatória'
        } else if (!cnhRegex.test(formData.cnh.replace(/\D/g, ''))) {
            newErrors.cnh = 'CNH deve ter 11 dígitos'
        }

        // Veículo
        if (!formData.veiculo.trim()) {
            newErrors.veiculo = 'Veículo é obrigatório'
        } else if (formData.veiculo.trim().length < 3) {
            newErrors.veiculo = 'Descrição do veículo muito curta'
        }

        // Placa
        const placaRegex = /^[A-Z]{3}-\d[A-Z]\d{2}$/
        if (!formData.placa.trim()) {
            newErrors.placa = 'Placa é obrigatória'
        } else if (!placaRegex.test(formData.placa.toUpperCase())) {
            newErrors.placa = 'Formato: ABC-1D23'
        }

        // Senha
        if (!formData.senha) {
            newErrors.senha = 'Senha é obrigatória'
        } else if (formData.senha.length < 8) {
            newErrors.senha = 'Senha deve ter pelo menos 8 caracteres'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
            newErrors.senha = 'Senha deve conter maiúscula, minúscula e número'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const formatCelular = (value: string): string => {
        const cleaned = value.replace(/\D/g, '')
        if (cleaned.length <= 2) return `(${cleaned}`
        if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
        if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
    }

    const formatPlaca = (value: string): string => {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        if (cleaned.length <= 3) return cleaned
        if (cleaned.length <= 4) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
        if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}${cleaned.slice(4)}`
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5, 7)}`
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        let formattedValue = value

        if (field === 'celular') {
            formattedValue = formatCelular(value)
        } else if (field === 'placa') {
            formattedValue = formatPlaca(value)
        } else if (field === 'cnh') {
            formattedValue = value.replace(/\D/g, '').slice(0, 11)
        }

        setFormData(prev => ({ ...prev, [field]: formattedValue }))

        // Limpar erro do campo quando usuário começa a digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setSubmitMessage(null)

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // TODO: Integrar com API do backend
            const response = await fetch('/api/cadastro/motorista', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    tipo: 'motorista'
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setSubmitMessage({
                    type: 'success',
                    text: 'Conta criada com sucesso! Você será redirecionado em breve.'
                })

                setFormData({
                    nome: '',
                    email: '',
                    celular: '',
                    cnh: '',
                    veiculo: '',
                    placa: '',
                    senha: ''
                })

                // TODO: Redirecionar para dashboard ou página de confirmação
                setTimeout(() => {
                    window.location.href = '/dashboard-motorista'
                }, 2000)

            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Erro ao criar conta')
            }

        } catch (error) {
            console.error('Erro no cadastro:', error)
            setSubmitMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="cadastro-motorista">
            <header className="header-cadastro">
                <div className="logo">
                    <div className="dot"></div>
                    <h1>AgresteGo</h1>
                </div>
                <Link href="/" className="back-link">
                    ← Voltar ao início
                </Link>
            </header>

            <div className="left-panel">
                <div className="badge">
                    <p>PARA MOTORISTAS</p>
                </div>
                <h2>
                    Dirija no seu<br />
                    ritmo, conheça<br />
                    quem você leva.
                </h2>
                <p>
                    Receba corridas próximas de você no Agreste,
                    com tarifas justas e suporte de gente da região.
                </p>
            </div>

            <div className="right-panel">
                <div className="form-header">
                    <h1>Cadastro de motorista</h1>
                    <p>Leva uns 2 minutinhos. Tenha seu CNH em mãos.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid single-column">
                        <div className="form-group">
                            <label>NOME COMPLETO</label>
                            <input
                                type="text"
                                placeholder="João da Silva"
                                value={formData.nome}
                                onChange={(e) => handleInputChange('nome', e.target.value)}
                                className={errors.nome ? 'error' : ''}
                            />
                            {errors.nome && <div className="error-text">{errors.nome}</div>}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>EMAIL</label>
                            <input
                                type="email"
                                placeholder="voce@email.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <div className="error-text">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label>CELULAR</label>
                            <input
                                type="tel"
                                placeholder="(81) 90000-0000"
                                value={formData.celular}
                                onChange={(e) => handleInputChange('celular', e.target.value)}
                                maxLength={15}
                                className={errors.celular ? 'error' : ''}
                            />
                            {errors.celular && <div className="error-text">{errors.celular}</div>}
                        </div>
                    </div>

                    <div className="form-grid single-column">
                        <div className="form-group">
                            <label>CNH</label>
                            <input
                                type="text"
                                placeholder="00000000000"
                                value={formData.cnh}
                                onChange={(e) => handleInputChange('cnh', e.target.value)}
                                className={errors.cnh ? 'error' : ''}
                            />
                            <div className="helper-text">11 dígitos sem traço</div>
                            {errors.cnh && <div className="error-text">{errors.cnh}</div>}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>VEÍCULO</label>
                            <input
                                type="text"
                                placeholder="Fiat Mobi 2022 Branco"
                                value={formData.veiculo}
                                onChange={(e) => handleInputChange('veiculo', e.target.value)}
                                className={errors.veiculo ? 'error' : ''}
                            />
                            {errors.veiculo && <div className="error-text">{errors.veiculo}</div>}
                        </div>

                        <div className="form-group">
                            <label>PLACA</label>
                            <input
                                type="text"
                                placeholder="ABC-1D23"
                                value={formData.placa}
                                onChange={(e) => handleInputChange('placa', e.target.value)}
                                maxLength={8}
                                className={errors.placa ? 'error' : ''}
                            />
                            {errors.placa && <div className="error-text">{errors.placa}</div>}
                        </div>
                    </div>

                    <div className="form-grid single-column">
                        <div className="form-group">
                            <label>SENHA</label>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={formData.senha}
                                onChange={(e) => handleInputChange('senha', e.target.value)}
                                className={errors.senha ? 'error' : ''}
                            />
                            {errors.senha && <div className="error-text">{errors.senha}</div>}
                        </div>
                    </div>

                    {submitMessage && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            backgroundColor: submitMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: submitMessage.type === 'success' ? '#155724' : '#721c24',
                            border: `1px solid ${submitMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                        }}>
                            {submitMessage.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <span className="loading"></span>}
                        {isSubmitting ? 'Criando conta...' : 'Criar conta de motorista'}
                    </button>
                </form>
            </div>
        </div>
    )
}