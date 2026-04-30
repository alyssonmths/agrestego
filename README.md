# 🚗 AgresteGo

Sistema acadêmico de mobilidade urbana inspirado em aplicativos como
Uber, desenvolvido para a disciplina de Desenvolvimento Web.

## 📍 Descrição

O **AgresteGo** é uma plataforma que conecta passageiros e motoristas
para realização de corridas dentro da cidade de Surubim. O sistema
permite solicitar, gerenciar e aceitar corridas de forma prática e
eficiente.

------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas

### Frontend

-   Next.js

### Backend

-   NestJS
-   Prisma ORM

### Banco de Dados

-   PostgreSQL (Supabase)

------------------------------------------------------------------------

## 👥 Funcionalidades

### Passageiro

-   Solicitar corridas
-   Editar perfil
-   Visualizar histórico de corridas
-   Acompanhar status da corrida

### Motorista

-   Buscar corridas disponíveis
-   Aceitar ou rejeitar corridas
-   Consultar histórico de corridas
-   Editar perfil
-   Atualizar status (disponível/ocupado)

------------------------------------------------------------------------

## 🔐 Autenticação e Segurança

-   Sistema de login e cadastro para motoristas e passageiros
-   Validação de dados
-   Proteção de rotas no backend

------------------------------------------------------------------------

## 📡 Arquitetura do Sistema

-   API RESTful construída com NestJS
-   ORM Prisma para comunicação com banco de dados
-   Integração com Supabase para hospedagem do banco

------------------------------------------------------------------------

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   Node.js instalado
-   PostgreSQL ou conta no Supabase

### Backend

``` bash
cd backend
npm install
npx prisma migrate dev
npm run start
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

## 📌 Melhorias Futuras

-   Implementação de geolocalização em tempo real
-   Sistema de pagamento integrado
-   Avaliação de motoristas e passageiros
-   Notificações em tempo real (WebSockets)

------------------------------------------------------------------------

## 📚 Objetivo Acadêmico

Este projeto tem como objetivo aplicar conceitos de desenvolvimento web
moderno, incluindo: - Arquitetura cliente-servidor - Consumo de APIs -
Modelagem de banco de dados - Autenticação e segurança

------------------------------------------------------------------------
