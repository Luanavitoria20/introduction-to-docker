# 🐳 Introduction to Docker

---

## 📖 Descrição
Projeto para praticar a criação de um back-end com **NestJS**, implementando um **CRUD completo** e conectando a um banco de dados **PostgreSQL** usando **Docker** e **Docker Compose**. 

O objetivo é aprender a containerizar aplicações, subir o banco e a API juntos, e testar os endpoints de forma prática.

---

## 🛠️ Tecnologias
- 🏗️ **NestJS**
- 🗄️ **PostgreSQL**
- 🐳 **Docker / Docker Compose**
- 🧪 **Jest** (para testes)
- 📄 **Swagger** (documentação da API)

---

## ⚡ Como rodar

### 1️⃣ Clonar o repositório
git clone https://github.com/Luanavitoria20/introduction-to-docker.git

### 2️⃣ Subir os contêineres
- Para subir normalmente:  
docker-compose up

- Para reconstruir imagens e subir (quando fizer alterações no código ou dependências):  
docker-compose up --build

### 3️⃣ Instalar dependências (caso necessário)
npm install

### 4️⃣ Rodar a aplicação localmente (sem Docker)
npm run start:dev

### 5️⃣ Rodar os testes
npm test  
npm run start:cov

### 6️⃣ A aplicação estará disponível
- API: http://localhost:3002/api
---

### 📌 Endpoints CRUD

👥 **Usuários**
- GET /users → Listar todos os usuários  
- GET /users/:id → Buscar usuário por ID  
- POST /users → Criar novo usuário  
- PUT /users/:id → Atualizar usuário  
- DELETE /users/:id → Deletar usuário  

🎬 **Filmes**
- GET /filmes → Listar todos os filmes  
- GET /filmes/:id → Buscar filme por ID  
- POST /filmes → Criar novo filme  
- PUT /filmes/:id → Atualizar filme  
- DELETE /filmes/:id → Deletar filme  

---

### 📝 Observações
- Projeto feito do zero, para fins de aprendizado.  
- CRUD completo implementado e conectado ao PostgreSQL.  
- Código simples, feito para praticar Docker e NestJS.  
- 🚀 Docker e Swagger permitem testar rapidamente os endpoints.
  
  ### Autores
| [<img loading="lazy" widht= 150 height= 150 src=https://avatars.githubusercontent.com/u/206602777?s=400&u=822619fc7be63ed9a459272707f3f43e427ec6d7&v=4 widht=50><br><sub>Luana Vitoria</sub>](https://github.com/Luanavitoria20) 
| :---: |
