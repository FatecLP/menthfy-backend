# Menthfy Backend (Node.js & Express)

API Gateway e microsserviço de usuários (alunos, professores, autenticação) da plataforma **Menthfy**.

---

## 🛠️ Tecnologias
- **Node.js** + **Express**
- **MySQL2** (Pool de conexões)
- **CORS** + Proxy reverso para o microsserviço de mentoria Java

---

## ⚙️ Variáveis de Ambiente (`.env`)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=menthfy_db
MENTORSHIP_API_URL=http://localhost:8080
```

---

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo produção
npm start

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test
```
