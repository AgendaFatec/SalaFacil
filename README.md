<div align="center">
  <h1>🏫 SalaFácil</h1>
  <img width="300" height="350" alt="image" src="https://github.com/user-attachments/assets/f99bb286-7e07-4db9-8282-2273e3a1f64f" />
</div>

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
