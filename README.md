# API - Só mais um livro

Uma **API RESTful** desenvolvida em Node.js para gerenciamento de listas de leitura personalizadas.

**URL:** [https://api.somaisumlivro.estradatech.com](https://api.somaisumlivro.estradatech.com)

## Funcionalidades

Regras de negócio disponíveis para consumo pelo front-end:

- **Gestão de usuários:** cadastro e login de usuários.
- **Gestão de livros (CRUD):** adição, listagem, alteração do estado de leitura (lido ou não lido) e exclusão de livros na biblioteca pessoal.
- **Proteção de rotas:** bloqueio de recursos privados, garantindo que apenas usuários autenticados acessem e gerenciem suas próprias listas.

## Endpoints da API

Para acessar as rotas protegidas, é necessário enviar o token JWT no cabeçalho da requisição: `Authorization: Bearer <token>`.

| Método | Rota             | Descrição                                                  | Autenticação |
| ------ | ---------------- | ---------------------------------------------------------- | ------------ |
| POST   | `/signup`        | Cria um novo usuário e retorna o token JWT                 | -            |
| POST   | `/signin`        | Autentica o usuário e retorna o token JWT                  | -            |
| GET    | `/users/me`      | Retorna os dados do usuário logado                         | Obrigatória  |
| GET    | `/books`         | Lista todos os livros salvos pelo usuário                  | Obrigatória  |
| POST   | `/books`         | Adiciona um novo livro à lista                             | Obrigatória  |
| PATCH  | `/books/:bookId` | Alterna estado de leitura de um livro entre `true`/`false` | Obrigatória  |
| DELETE | `/books/:bookId` | Remove livro da lista                                      | Obrigatória  |

## Tecnologias e arquitetura

**Stack:**

- Node.js com Express.js
- MongoDB Atlas (Cloud) com ODM Mongoose

**Segurança, validação e monitoramento:**

- **Segurança:** Helmet (proteção de cabeçalhos HTTP) e Express Rate Limit (prevenção contra ataques de força bruta)
- **Autenticação:** JWT e Bcrypt.js
- **Validação de dados:** Celebrate / Joi (valida os dados da requisição antes de tocar no banco de dados)
- **Logs:** Winston e Express-Winston (registro de acessos e erros)
- **Tratamento de erros:** centralizado com middleware e captura de rotas inexistentes (404).

**Infraestrutura e deploy:**

- **Servidor:** máquina virtual Ubuntu no Google Cloud
- **Gerenciamento de processos:** PM2 (reinício automático da API em caso de falhas)
- **Roteamento:** Nginx como proxy reverso
- **Criptografia:** Ccertificado SSL/TLS (HTTPS) via Certbot

## Como rodar este projeto localmente

1. Clone o repositório.
2. Entre na pasta do projeto e instale as dependências: `npm install`
3. Inicie o servidor em modo de desenvolvimento: `npm run dev`

##

**Desenvolvido por Lorena Mendes**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lorenans)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lorimendes)
