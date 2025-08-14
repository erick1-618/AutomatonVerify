<h1 align="center">Automaton Verify</h1>

<p align="center">
    <img alt="logo" src="assets/logotype.png" width="150px"/>
</p>

<p align="center">Site para armazenamento eficiente de propriedades de software com base em autômatos celulares para funções hash.</p>

<h3 style="display: flex; align-items:center; gap:10px"><img alt="topic" src="assets/loading.gif" width="20px" height="20px">Funcionalidades</h3>

- Criação de títulos (arquivos) públicos para armazenamento de hashes
- Verificação de integridade de títulos registrados com base nos hashes
- Barra de pesquisa para busca
- Favoritar títulos para fácil acesso

<h3 style="display: flex; align-items:center; gap:10px"><img alt="topic" src="assets/loading.gif" width="20px" height="20px">Tecnologias utilizadas</h3>

- Frontend
    - React
    - CSS Modules (modular)
    - Redux
- Backend
    - Spring Boot
    - Spring Security
    - Maven
    - Hibernate
- Persistência
    - PostgreSQL
- Outros
    - Docker
    - Figma para prototipação de telas
    - JWT para autenticação de usuários

<h3 style="display: flex; align-items:center; gap:10px"><img alt="topic" src="assets/loading.gif" width="20px" height="20px">Instalação e Execução</h3>

Pré-requisito: Docker (versão mínima 20.x)

1. Clone este repositório em seu ambiente

```bash
git clone https://github.com/erick1-618/AutomatonVerify
```

2. Navegue até o diretório do projeto

```bash
cd AutomatonVerify
```

3. Crie o arquivo *.env* na raíz do projeto com base no template *.env.example* e edite-o com base em seu ambiente

```bash
cp .env.example .env
```

4. Faça o build com o docker compose

```bash
docker compose up
```

5. Em seu navegador acesse a porta 3000 para acessar o frontend.

Exemplo: ``http://localhost:3000/``

6. Para encerrar a execução do contêiner:

```bash
docker compose down
```

Para reiniciar o contêiner, reexecute o passo 3

<h3 style="display: flex; align-items:center; gap:10px"><img alt="topic" src="assets/loading.gif" width="20px" height="20px">Estrutura de pastas</h3>

```bash
project/
├── autoverify-front/ # Código React
├── autoverify-api/ # Código Spring Boot
├── docker-compose.yml # Docker Compose
├── .env.example # Modelo .env
└── README.md
```

<h3 style="display: flex; align-items:center; gap:10px"><img alt="topic" src="assets/loading.gif" width="20px" height="20px">Licença</h3>

Este projeto está licenciado sob a GNU General Public License v3.0 - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
    <img src="/assets/loading2.gif" alt="loading" width="200px" style="background-color: #ddeaf6; border-radius: 15px; margin: 15px">
</p>