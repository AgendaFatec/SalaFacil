# 🏫 SalaFácil

> **Projeto Interdisciplinar - 4º Semestre | Desenvolvimento de Software Multiplataforma** > Faculdade de Tecnologia de São Paulo - FATEC Itaquera

O **SalaFácil** é uma solução integrada desenvolvida para otimizar a rotina operacional de instituições de ensino. Projetado para atender ambientes acadêmicos com alto fluxo diário de aulas, o sistema automatiza processos docentes e centraliza a administração das salas de aula e laboratórios.

---

## ✨ Principais Funcionalidades

* 🖥️ **Gestão de Inventário:** Mapeamento completo dos equipamentos da instituição (hardware e softwares/tecnologias instaladas), garantindo transparência sobre a disponibilidade de recursos.
* 📅 **Sistema de Reservas:** Agendamento de salas e laboratórios através de uma interface intuitiva, evitando conflitos de horários e centralizando o controle do fluxo diário.
* 🛠️ **Suporte Técnico Local:** Canal direto para abertura de chamados internos e resolução de problemas estruturais ou de TI, com painéis de controle de status (Pendente, Em análise, Resolvido).
* 🔐 **Segurança e Autenticação (SSO):** Autenticação integrada com o **Microsoft Azure Active Directory**, garantindo que apenas e-mails institucionais autorizados tenham acesso ao sistema.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando Arquitetura em Camadas (N-Tier Architecture), dividido entre Front-end e Back-end, ambos fortemente tipados.

### Front-End
* **[TypeScript](https://www.typescriptlang.org/)**
* **[React](https://reactjs.org/)** + **[Vite](https://vitejs.dev/)**
* **[Tailwind CSS](https://tailwindcss.com/)** (Estilização ágil e responsiva)

### Back-End
* **[Node.js](https://nodejs.org/)** + **[Express](https://expressjs.com/)**
* **[Prisma ORM](https://www.prisma.io/)** + **[PostgreSQL](https://www.postgresql.org/)** (Hospedado no Neon Tech)
* **[TSOA](https://tsoa-community.github.io/docs/)** + **Swagger UI** (Geração automática de rotas e documentação de API)
* **Passport.js** + **Azure AD** (Autenticação SSO OAuth 2.0)
* **JWT (JSON Web Token)** (Sessões Stateless)
* **Cloudinary SDK** + **Multer** + **Sharp** (Processamento e armazenamento em nuvem de imagens)
* **Zod** (Validação de schemas e payloads)
* **Brevo SDK** (Disparo de e-mails transacionais via API REST)

---

## ⚙️ Como executar o projeto localmente

Como o repositório agora unifica o Front-end e o Back-end, você precisará rodar ambos os serviços. 

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* Conta no [Neon Tech](https://neon.tech/) (para o banco de dados PostgreSQL)
* Conta no [Microsoft Azure](https://portal.azure.com/) (para as credenciais do Active Directory)
* *Opcional:* Docker Desktop (para rodar o backend via contêiner)

### 1. Clonando o repositório
\`\`\`bash
git clone https://github.com/SEU_USUARIO/salafacil.git
cd salafacil
\`\`\`

### 2. Configurando o Back-End
\`\`\`bash
cd backend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz da pasta backend baseado no .env.example e preencha suas variáveis
# (DATABASE_URL, CLIENT_ID, CLIENT_SECRET, SECRET_JWT, etc.)

# Sincronize o banco de dados com o Prisma
npx prisma db push

# (Opcional) Popule o banco com os usuários iniciais
npm run prisma:seed

# Gere as rotas automáticas do TSOA
npm run tsoa

# Inicie o servidor de desenvolvimento
npm run dev
\`\`\`
O servidor iniciará em \`http://localhost:3000\`. A documentação do Swagger estará disponível em \`http://localhost:3000/api-docs\`.

### 3. Configurando o Front-End
Em um novo terminal, navegue até a pasta do frontend:
\`\`\`bash
cd frontend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz do frontend e defina a URL da API, por exemplo:
# VITE_API_URL=http://localhost:3000

# Inicie a aplicação Vite
npm run dev
\`\`\`
O frontend estará acessível em \`http://localhost:5173\`.

---

## 🐳 Execução via Docker (Back-End)
Se preferir rodar o backend de forma isolada, utilize o Dockerfile incluso:

\`\`\`bash
cd backend
docker build -t salafacil-backend .
docker run -p 3000:3000 --env-file .env salafacil-backend
\`\`\`

---

## 👥 Equipe de Desenvolvimento
* Allan Martins
* Gabriel Marques
* Jhon Deyvid
* Pedro Henrique
* Roberto Tadashi
* Vitor Luiz

---

## 📄 Direitos Autorais

© 2026 SalaFácil. Todos os direitos reservados.
Este é um projeto de caráter acadêmico. O uso, distribuição ou modificação não autorizada do código fonte deste repositório é estritamente proibido.
