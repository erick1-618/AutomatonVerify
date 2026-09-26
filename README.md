<h1 align="center">Automaton Verify</h1>

<p align="center">
    <img alt="logo" src="assets/logotype.png" width="150px"/>
</p>

<p align="center">Site para armazenamento eficiente de propriedades de software com base em autômatos celulares para funções hash.</p>

<p align="center">
  🌐 <strong>Acesse o projeto online:</strong> <a href="https://autov.erickborba.dev.br" target="_blank">https://autov.erickborba.dev.br</a>
</p>

### Funcionalidades

- Criação de títulos (arquivos) públicos para armazenamento de hashes
- Verificação de integridade de títulos registrados com base nos hashes
- Barra de pesquisa para busca
- Favoritar títulos para fácil acesso

### Stack

- **Frontend**:
  - [React](https://react.dev/)
  - [Redux Toolkit](https://redux-toolkit.js.org/)
  - [React Router](https://reactrouter.com/)
  - CSS Modules
  - Hosting: [Vercel](https://vercel.com/) ([autov.erickborba.dev.br](https://autov.erickborba.dev.br))
- **Backend**:
  - [Java 21](https://www.oracle.com/java/) / [Spring Boot](https://spring.io/projects/spring-boot)
  - Spring Security & JWT
  - Hibernate & Spring Data JPA
  - Hosting: [VPS Oracle Cloud (Always Free)](https://www.oracle.com/cloud/free/)
- **Database**:
  - [PostgreSQL](https://www.postgresql.org/)
- **DevOps & Infra**:
  - [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
  - [GitHub Actions](https://github.com/features/actions) (CI/CD)
  - [GitHub Container Registry (GHCR)](https://github.com/features/packages)

---

### Arquitetura de Deploy

A arquitetura segue o mesmo fluxo desacoplado:
1. **Frontend (Vercel)**:
   - Deployado diretamente na Vercel como Single Page Application.
   - Comunica-se com o backend via variável de ambiente `REACT_APP_API_URL`.
   - Gerencia rotas SPA através do `vercel.json` (rewrites para `/index.html`).
2. **Backend & Database (VPS Oracle)**:
   - Orquestrados via `docker-compose.yml`.
   - O PostgreSQL persiste seus dados no volume nomeado `pgdata`.
   - O backend Spring Boot consome a imagem `ghcr.io/erick1-618/automatonverify-backend:latest`.
3. **CI/CD Automatizado (GitHub Actions)**:
   - A cada `push` na branch `main` alterando `autoverify-api/**`:
     1. Build da imagem Docker multi-plataforma (`linux/arm64` para processadores Ampere A1 da Oracle Cloud).
     2. Push da imagem no GitHub Container Registry (`ghcr.io`).
     3. Conexão SSH na VPS da Oracle para executar `docker compose pull && docker compose up -d --force-recreate`.

---

### Configuração de Deploy

#### 1. Na VPS Oracle

1. Conecte-se à sua máquina da Oracle e crie a pasta do projeto:
   ```bash
   mkdir -p ~/AutomatonVerify && cd ~/AutomatonVerify
   ```
2. Copie o `docker-compose.yml` e crie o arquivo `.env`:
   ```bash
   cp .env.example .env
   # Edite as credenciais e variáveis
   nano .env
   ```
3. Garanta que as portas necessárias estejam liberadas no firewall da VM e na **Security List** da Oracle Cloud (VCN Ingress Rules):
   - Porta `8080` (API Spring Boot) ou porta `80`/`443` se utilizar um Reverse Proxy (NGINX/Caddy).

#### 2. Segredos no GitHub Actions

No repositório do GitHub, vá em **Settings** > **Secrets and variables** > **Actions** e cadastre as seguintes *Repository Secrets*:

- `ORACLE_HOST`: Endereço IP público da sua máquina Oracle.
- `ORACLE_USER`: Usuário SSH da VM (ex: `ubuntu` ou `opc`).
- `ORACLE_SSH_KEY`: Sua chave privada SSH para acesso à máquina.

#### 3. Na Vercel

1. Importe o repositório na [Vercel](https://vercel.com/).
2. Defina o **Root Directory** como:
   ```text
   autoverify-front
   ```
3. Em **Environment Variables**, adicione:
   - `REACT_APP_API_URL`: URL pública da sua API na VPS Oracle (ex: `http://<IP_DA_ORACLE>:8080` ou `https://api.seudominio.com`).
4. Realize o deploy.

---

### Execução Local para Desenvolvimento

#### Executando apenas Backend e Banco via Docker:
```bash
docker compose up -d db backend
```

Para rodar o frontend localmente em modo de desenvolvimento:
```bash
cd autoverify-front
npm install
npm start
```

#### Executando toda a stack localmente com Docker Compose:
```bash
docker compose --profile dev up --build
```
Acesse `http://localhost:3000`.

---

### Estrutura do Projeto

```text
AutomatonVerify/
├── .github/
│   └── workflows/
│       └── backend-deploy.yml    # CI/CD: build arm64, push GHCR e deploy SSH
├── autoverify-api/               # API Spring Boot (Java 21)
│   ├── Dockerfile
│   └── src/
├── autoverify-front/             # Frontend React
│   ├── vercel.json               # Configuração SPA para Vercel
│   ├── .env.example
│   └── src/
├── docker-compose.yml            # Orquestração de containers (db + backend)
├── .env.example                  # Template de variáveis da VPS
└── README.md
```

### Licença

Este projeto está licenciado sob a GNU General Public License v3.0 - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
    <img src="assets/loading2.gif" width="200">
</p>
