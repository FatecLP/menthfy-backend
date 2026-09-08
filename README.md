# Menthfy - Backend API & Gateway (Node.js & Express)

[![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)](https://github.com/FatecLP/menthfy-backend)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-9.6-4479A1?logo=mysql&logoColor=white)](https://mysql.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-blue)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

API Gateway e microsserviço de usuários responsável pela autenticação, catálogo de professores, perfis de alunos e proxy reverso da plataforma **Menthfy**.

---

## 🏛️ Arquitetura do Sistema (Clean Architecture)

O backend foi estruturado seguindo os princípios de **Clean Architecture**, promovendo desacoplamento, testabilidade unitária e independência de frameworks e banco de dados:

```
src/
├── domain/                      # Camada de Domínio (Entidades e Contratos)
│   ├── models/                  # Modelos de negócio puros (Professor, Aluno, Usuario)
│   └── repositories/            # Interfaces de Repositório (contratos abstratos)
│       ├── ProfessorRepository.js
│       └── AlunoRepository.js
│
├── application/                 # Camada de Aplicação (Casos de Uso)
│   └── usecases/                # Orquestração das regras de negócio
│       ├── professor/           # GetAllProfessors, GetById, GetByName, CreateProfessor
│       ├── aluno/               # GetAllAlunos, GetById, CreateAluno
│       └── auth/                # LoginUseCase (autenticação unificada de usuários)
│
├── infrastructure/              # Camada de Infraestrutura (Implementações concretas)
│   ├── database/                # Conexão MySQL (Pool de conexões)
│   ├── persistence/             # Implementações com queries SQL (MySqlProfessorRepository, MySqlAlunoRepository)
│   └── http/                    # Proxy HTTP para o microsserviço de mentorias
│
└── presentation/                # Camada de Apresentação (HTTP / Express)
    ├── controllers/             # Controladores que adaptam HTTP para Use Cases
    └── routes/                  # Definição modular de rotas Express
```

---

## 💻 Tecnologias Utilizadas

* **Node.js (v20+)**
* **Express.js** (Roteamento e middlewares)
* **MySQL2 / Promise** (Pool de conexões assíncrono com banco de dados)
* **CORS** (Habilitação para origens web autorizadas)
* **Dotenv** (Gerenciamento de variáveis de ambiente)
* **Proxy Reverso Integrado** (Encaminhamento de requisições de mentoria para o `mentorship-service`)
* **Clean Architecture**
* **Princípios SOLID**

---

## 🌐 Integração no Ecossistema Menthfy

- 🎨 **[FatecLP/menthfy](https://github.com/FatecLP/menthfy)**: Frontend SPA em React 19 + Vite.
- 🟢 **[FatecLP/menthfy-backend](https://github.com/FatecLP/menthfy-backend)** (Este Repositório): Backend API Gateway em Node.js & Express.
- ☕ **[FatecLP/mentorship-service](https://github.com/FatecLP/mentorship-service)**: Microsserviço de mentorias em Java + Spring Boot.

---

## 📡 Endpoints Principais da API

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/usuarios/login` | Autenticação unificada de Alunos e Professores |
| `GET` | `/api/professores` | Listagem de professores com filtros e ordenação |
| `GET` | `/api/professores/:id` | Detalhes do professor e histórico de avaliações |
| `GET` | `/api/professores/nome/:nome` | Busca de professor por nome |
| `POST` | `/api/professores` | Cadastro de novo professor |
| `GET` | `/api/alunos` | Listagem de alunos |
| `GET` | `/api/alunos/:id` | Consulta de perfil do aluno |
| `POST` | `/api/alunos` | Cadastro de novo aluno |
| `ALL` | `/api/mentorships/*` | Proxy reverso transparente para o microsserviço de mentorias |

---

## ⚙️ Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto com base no `.env-example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=menthfy_db
MENTORSHIP_API_URL=http://localhost:8080
```

---

## 🗄️ Banco de Dados

Os scripts SQL para inicialização e população de dados de teste estão localizados no diretório [`docs/database/`](docs/database/):

* **`schema.sql`**: Definição de tabelas (`alunos`, `professores`, `avaliacoes`, `mentorias`).
* **`seed.sql`**: Carga inicial de usuários e avaliações.

---

## 🚀 Como Executar Localmente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar o Servidor

* **Modo Produção:**

  ```bash
  npm start
  ```

* **Modo Desenvolvimento (com auto-reload):**

  ```bash
  npm run dev
  ```

O servidor estará disponível por padrão em: **`http://localhost:3000`**

### 3. Executar Testes Automatizados

```bash
npm test
```

---

## 📜 Licença

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este projeto está sob a licença MIT.

---

<div align="center">
  <strong>Desenvolvido com 💙 pela equipe Menthfy</strong><br>
  FATEC Luigi Papaiz - Diadema/SP - 2026
</div>
