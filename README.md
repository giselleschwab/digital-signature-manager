# Gerenciador de Documentos e Assinaturas

## Introdução

Este teste técnico foi desenvolvido para demonstrar minhas habilidades como desenvolvedor frontend, com foco em Next.js, NextAuth 4 e conhecimentos básicos de backend. O objetivo é criar um protótipo de uma aplicação de gerenciamento de documentos, simulando um ambiente de assinatura digital.

> **Observação:** A funcionalidade de assinatura digital será impplementada futuramente.

## Funcionalidades Implementadas

### 1. Autenticação
- Página de login/registro
- Proteção de rotas privadas
- Logout
- Gerenciamento básico de sessão

### 2. Gerenciamento de Documentos
- Listagem dos documentos do usuário logado
- Upload de novos documentos (PDF)
- Visualização de documento
- Exclusão de documentos

## Tecnologias Utilizadas

- **Next.js** com App Router
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes de interface
- **NextAuth 4** para autenticação
- **Prisma ORM** para interação com o banco de dados
- **SQLite** como banco de dados

## Estrutura do Projeto

A aplicação está organizada em duas partes principais:

- **Frontend:** Desenvolvido em Next.js com TypeScript, contendo as páginas de login, registro, upload, listagem e visualização de documentos.
- **Backend:** APIs criadas no próprio Next.js para o gerenciamento dos documentos e autenticação, utilizando o Prisma para interagir com o banco de dados SQLite.

## Como Baixar e Rodar a Aplicação

Siga os passos abaixo para configurar e executar o projeto localmente:

1. **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3. **Configure as variáveis de ambiente:**

    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis (exemplo):
    ```bash
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="<SUA_CHAVE_SECRETA>"
    ```

4. **Execute as migrações do banco de dados:**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

5. **Inicie a aplicação:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

6. **Acesse a aplicação:**
   
   Abra o navegador e acesse [http://localhost:3000](http://localhost:3000).

### Página de Login

Para realizar o login do usuário, acesse diretamente:
[http://localhost:3000/login](http://localhost:3000/login)

## Rotas e APIs

### Autenticação
- **POST /api/auth/callback** – Callback do NextAuth

### Documentos
- **GET /api/documents/list** – Listar documentos do usuário
- **POST /api/documents/upload** – Upload de novo documento
- **GET /api/documents/viewfile/[id]** – Visualizar documento
- **DELETE /api/documents/delete/[id]** – Deletar documento

## Decisões Técnicas
- Utilizei o App Router do Next.js por ser a abordagem mais moderna e recomendada pela documentação oficial.
- A autenticação foi feita com NextAuth 4 por ser a solução mais completa e flexível para Next.js.
- Escolhi o Prisma ORM com SQLite para facilitar a persistência local de dados durante o desenvolvimento.

##  Desafios Enfrentados
- Integração da autenticação com NextAuth e formulários personalizados de login/registro.
- Gerenciamento e visualização de PDFs em ambiente local.

## Próximos Passos
Implementar a funcionalidade de assinatura digital, incluindo:
- Interface para desenhar/selecionar assinatura.
- Registro da assinatura com timestamp.
- Status do documento (Pendente, Assinado).

## Deploy
- O deploy ainda não foi realizado, mas o projeto está preparado para ser publicado em plataformas como Vercel.

*Desenvolvido por Giselle Schwab*  
*Email: giselleschwab@gmail.com*
