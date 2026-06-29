# 🚖 AgresteGo

O **AgresteGo** é uma plataforma acadêmica de mobilidade urbana inspirada em serviços de transporte como Uber, desenvolvida para a disciplina de Desenvolvimento Web. O projeto conecta passageiros e motoristas para a realização de corridas dentro da cidade de Surubim, oferecendo cadastro, autenticação, solicitação de corridas, acompanhamento de status e gestão de pagamentos e avaliações.

---

# 📖 Visão Geral

Este sistema foi pensado como uma aplicação full-stack com:

* 🌐 Frontend em **Next.js** para a experiência do usuário
* ⚙️ Backend em **NestJS** para a API REST e regras de negócio
* 🗄️ **Prisma ORM** para modelagem e acesso ao banco de dados
* 🐘 **PostgreSQL** com **Supabase** como infraestrutura de persistência
* 🔐 Autenticação baseada em **JWT** para proteção das rotas

---

# ✨ Funcionalidades Principais

## 👤 Passageiro

* Cadastro e login
* Solicitação de corridas
* Cadastro e gerenciamento de endereços
* Acompanhamento do status da corrida
* Visualização do histórico de corridas finalizadas
* Pagamento e avaliação da corrida

## 🚗 Motorista

* Cadastro e login
* Aceitação ou rejeição de corridas solicitadas
* Finalizar corridas

---

# 🛠️ Tecnologias Utilizadas

## 🌐 Frontend

* Next.js 16
* React 19
* TypeScript

## ⚙️ Backend

* NestJS 11
* TypeScript
* Prisma ORM 7
* Passport + JWT
* Swagger para documentação da API
* Class Validator / Class Transformer

## 🗄️ Banco de Dados

* PostgreSQL
* Supabase

---

# 🏗️ Arquitetura do Sistema

A aplicação segue uma arquitetura cliente-servidor simples e organizada:

* 🎨 **Frontend:** interface web para passageiros e motoristas
* ⚙️ **Backend:** API REST com módulos separados para autenticação, passageiros, motoristas, corridas e bairros
* 🗄️ **Banco de dados:** modelo relacional com entidades como Passageiro, Motorista, Corrida, Endereço, Pagamento, Avaliação e Imagem

---

# 📚 Documentação e Materiais

* 📄 Documentação da API Swagger: http://localhost:3000/docs
* 🎨 Protótipos e telas no Figma: https://www.figma.com/design/goQyAaFmdQcBa35T5EaNGk/Agreste-Go---Design?node-id=0-1&t=lIILLzCSBzuWoIY7-1
* 📑 Diagramas de caso de uso: `docs/diagrama_casos_uso_v3.pdf`
* 🧩 Diagrama de classes do backend: `docs/diagrama_classes_backend.png`
* 🧩 Diagrama de classes do frontend: `docs/diagrama_classes_frontend.png`

---

# 📂 Estrutura do Projeto

```text
backend/   -> API NestJS, módulos, DTOs, autenticação e integração com Prisma
frontend/  -> Aplicação Next.js
docs/      -> Arquivos de documentação e diagramas
figma/     -> Assets e telas exportadas
```

---

# 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

* Node.js 18 ou superior
* npm
* PostgreSQL ou uma instância no Supabase

---

# Como Executar Localmente

## 1️⃣ Clone o repositório

```bash
git clone <url-do-repositorio>
cd agrestego
```

---

## 2️⃣ Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
DIRECT_URL="postgresql://usuario:senha@host:5432/banco"
JWT_SECRET_KEY="uma-chave-secreta-forte"
CORS_ORIGIN="http://localhost:3001"
```

Execute as migrações:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run start:dev
```

O backend ficará disponível em:

* http://localhost:3000
* Swagger: http://localhost:3000/docs

---

## 3️⃣ Configure o Frontend

```bash
cd ../frontend
npm install
```

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Inicie o frontend:

```bash
npm run dev
```

A aplicação ficará disponível em:

* http://localhost:3001

---

# 🔒 Autenticação e Segurança

* Login e cadastro para passageiros e motoristas
* Proteção das rotas utilizando JWT
* Validação de dados com DTOs
* Controle de acesso por papéis (Passageiro e Motorista)

---

# ☁️ Deploy

O serviço de hospedagem e deploy escolhido foi o Railway.

* Frontend: Railway
* Backend: Railway

**Link do sistema:**

Acesse o AgresteGo [aqui](https://frontend-production-41b0.up.railway.app/)

---

# 🎓 Objetivo Acadêmico

Este projeto foi desenvolvido com foco na aplicação prática de conceitos modernos de desenvolvimento web, incluindo:

* Arquitetura cliente-servidor
* Consumo de APIs REST
* Modelagem de banco de dados relacional
* Autenticação e segurança
* Desenvolvimento Full Stack utilizando tecnologias atuais

---

Projeto desenvolvido para a disciplina de **Desenvolvimento Web**, com fins acadêmicos.
