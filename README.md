# Menthfy - Backend API & Gateway (Node.js & Express)

[![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)](https://github.com/FatecLP/menthfy-backend)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-9.6-4479A1?logo=mysql&logoColor=white)](https://mysql.com/)

API Gateway e microsserviço de usuários responsável pela autenticação, catálogo de professores, perfis de alunos e proxy reverso da plataforma **Menthfy**.

---

## 🏛️ Arquitetura da Plataforma

Este serviço atua como o ponto de entrada principal e gateway para o ecossistema distribuído do Menthfy:
- 🎨 **[FatecLP/menthfy](https://github.com/FatecLP/menthfy)**: Frontend SPA em React 19 + Vite.
- 🟢 **[FatecLP/menthfy-backend](https://github.com/FatecLP/menthfy-backend)** (Este Repositório): Backend API Gateway em Node.js & Express.
- ☕ **[FatecLP/mentorship-service](https://github.com/FatecLP/mentorship-service)**: Microsserviço de mentorias em Java + Spring Boot.

---

## 💻 Tecnologias Utilizadas

- **Node.js (v20+)**
- **Express.js** (Roteamento e middlewares)
- **MySQL2 / Promise** (Pool de conexões assíncrono com banco de dados)
- **CORS** (Habilitação para origens web autorizadas)
- **Dotenv** (Gerenciamento de variáveis de ambiente)
- **Proxy Reverso Integrado** (Encaminhamento de requisições de mentoria para o `mentorship-service`)

---

## 📡 Endpoints Principais da API

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/usuarios/login` | Autenticação unificada de Alunos e Professores |
| `GET` | `/api/professores` | Listagem de professores com suporte a filtro por disciplina |
| `GET` | `/api/professores/:id` | Dados detalhados do professor e histórico de avaliações |
| `GET` | `/api/alunos/:id` | Consulta de perfil do aluno |
| `ALL` | `/api/mentorships/*` | Proxy reverso transparente para o microsserviço de mentorias |

### Exemplos de Requisição:

#### 1. Autenticação (`POST /usuarios/login`):
```json
{
  "email": "alberto@menthfy.com",
  "senha": "123"
}
```
**Resposta (200 OK):**
```json
{
  "usuario": {
    "id": 1,
    "nome": "Alberto",
    "email": "alberto@menthfy.com",
    "tipoUsuario": "Professor"
  }
}
```

#### 2. Catálogo de Professores (`GET /api/professores`):
**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Alberto",
    "disciplinaPrincipal": "Programação",
    "descricao": "Especialista em desenvolvimento web completo...",
    "mediaAvaliacao": 4.90,
    "quantidadeAlunos": 120,
    "precoHora": 50.00,
    "fotoUrl": "/assets/images/img1.jpg"
  }
]
```

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
- **`schema.sql`**: Definição de tabelas (`alunos`, `professores`, `avaliacoes`, `mentorias`).
- **`seed.sql`**: Carga inicial de usuários e avaliações.

---

## 🚀 Como Executar Localmente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar o Servidor
- **Modo Produção:**
  ```bash
  npm start
  ```
- **Modo Desenvolvimento (com auto-reload):**
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
