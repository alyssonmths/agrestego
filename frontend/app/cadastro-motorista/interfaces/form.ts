export interface FormData {
    nome: string
    email: string
    celular: string
    cnh: string
    veiculo: string
    placa: string
    senha: string
}

export interface FormErrors {
    nome?: string
    email?: string
    celular?: string
    cnh?: string
    veiculo?: string
    placa?: string
    senha?: string
}