# Aplicação de Gestão e API de Jogadores

Aplicação Fullstack para cadastro, consulta e análise de desempenho de jogadores de futebol, desenvolvida com **Java (Spring Boot)** no Backend e **Vue.js (Vite)** no Frontend.

Os dados dos jogadores são armazenados no banco de dados **PostgreSQL** através do Spring JDBC. Todo o ambiente pode ser executado com **Docker**, sem precisar instalar Java, Node.js ou PostgreSQL.

---

## 🚀 Tecnologias Utilizadas

### Backend

- **Java 17**
- **Spring Boot 3.5** (Spring Web, Spring JDBC)
- **Maven**
- **PostgreSQL**

### Frontend

- **Vue.js 3**
- **Vite**
- **Vue Router**
- **Axios**

### Infraestrutura

- **Docker** e **Docker Compose**
- **Nginx** (servindo o build do Frontend)

---

## 📌 Funcionalidades

- **Gerenciamento Completo:** Cadastrar, editar e excluir jogadores (incluindo nome, posição, clube, número da camisa, idade, partidas, gols e status);
- **Interface Visual:** Interface web reativa em Vue.js para navegação e preenchimento de formulários;
- **Consultas de Dados:** Listagem de todos os jogadores e filtragem de jogadores ativos;
- **Análise de Desempenho:** Cálculo automático de médias de gols e status do jogador;
- **Tratamento de Erros:** Validações de entrada (`400 Bad Request`) e tratamento para registros inexistentes (`404 Not Found`).

---

## ⚙️ Regras de Negócio

Um jogador está **apto para ser titular** quando está **ativo** e possui pelo menos **5 partidas**.

A classificação de desempenho considera a média de gols por partida ($\text{Média} = \frac{\text{Gols}}{\text{Partidas}}$):

- **Média $\ge 0,5$:** Excelente
- **Média $\ge 0,2$:** Bom
- **Média $< 0,2$:** Regular
- **Nenhuma partida:** Sem partidas suficientes

### Validações

| Campo          | Regra                                     |
| :------------- | :---------------------------------------- |
| `nome`         | Obrigatório, até 100 caracteres           |
| `posicao`      | Obrigatório, até 50 caracteres            |
| `clube`        | Opcional, até 150 caracteres              |
| `numeroCamisa` | Opcional; quando informado, entre 1 e 99  |

---

## 🛠️ Endpoints da API (Backend)

| Método   | Endpoint                     | Descrição                                               |
| :------- | :--------------------------- | :------------------------------------------------------ |
| `POST`   | `/jogadores`                 | Cadastra um novo jogador (`201 Created`)                |
| `PUT`    | `/jogadores/{id}`            | Atualiza um jogador (`200 OK` ou `404 Not Found`)       |
| `DELETE` | `/jogadores/{id}`            | Exclui um jogador (`204 No Content` ou `404 Not Found`) |
| `GET`    | `/jogadores`                 | Lista todos os jogadores cadastrados                    |
| `GET`    | `/jogadores/{id}`            | Busca os detalhes de um jogador por ID                  |
| `GET`    | `/jogadores/ativos`          | Lista apenas os jogadores ativos                        |
| `GET`    | `/jogadores/{id}/desempenho` | Consulta a análise de desempenho do jogador             |

### Estrutura do JSON (Cadastro / Edição)

```json
{
  "nome": "Neymar Jr",
  "posicao": "Atacante",
  "clube": "Santos",
  "numeroCamisa": 10,
  "idade": 32,
  "quantidadeGols": 400,
  "quantidadePartidas": 600,
  "ativo": true
}
```

### Exemplo de resposta (Desempenho)

```json
{
  "id": 1,
  "nome": "Neymar Jr",
  "mediaGolsPorPartida": 0.6666666666666666,
  "classificacao": "Excelente",
  "aptoParaSerTitular": true
}
```

---

## 🐳 Como Executar a Aplicação (Docker Desktop)

Toda a aplicação roda no **Docker Desktop**. Não é necessário instalar Java, Maven, Node.js ou PostgreSQL.

### 1. Pré-requisito

- **Docker Desktop** instalado e **aberto** (o ícone da baleia precisa estar ativo na barra do sistema).

### 2. Primeira execução

Abra um terminal na raiz do projeto (ou o terminal integrado do Docker Desktop, no ícone **>_** no canto inferior direito) e execute:

```bash
docker compose up --build -d
```

O comando cria e inicia três containers dentro do grupo **`api_jogadores`**:

| Container  | Função                      | Endereço                |
| :--------- | :-------------------------- | :---------------------- |
| `frontend` | Interface web (Vue + Nginx) | `http://localhost:3000` |
| `backend`  | API (Spring Boot)           | `http://localhost:8080` |
| `db`       | Banco de dados (PostgreSQL) | `localhost:5433`        |

A tabela `jogador` é criada automaticamente na primeira vez que o banco sobe.

> Dados de acesso ao banco: banco `bd_jogadores`, usuário `jogadores`, senha `jogadores`.

### 3. Usando pelo Docker Desktop

Depois da primeira execução, tudo pode ser feito pela interface:

1. Abra o Docker Desktop e vá na aba **Containers**;
2. Localize o grupo **`api_jogadores`**;
3. Clique em **▶ Start** para iniciar ou **■ Stop** para parar todos os containers;
4. Clique na porta **`3000:80`** do container `frontend` para abrir a aplicação no navegador;
5. Clique no nome de um container para ver os **logs** (útil para investigar erros no `backend`).

### 4. Comandos úteis

Execute na raiz do projeto:

| Comando                              | O que faz                                              |
| :----------------------------------- | :----------------------------------------------------- |
| `docker compose up --build -d`       | Cria/atualiza as imagens e inicia os containers        |
| `docker compose up -d`               | Inicia os containers sem reconstruir                   |
| `docker compose stop`                | Para os containers                                     |
| `docker compose logs -f backend`     | Acompanha os logs do backend                           |
| `docker compose down`                | Remove os containers (os dados do banco são mantidos)  |
| `docker compose down -v`             | Remove os containers **e apaga os dados do banco**     |

> Sempre que alterar o código do backend ou do frontend, execute novamente `docker compose up --build -d` para que as mudanças apareçam.

### 5. Problemas comuns

- **`Cannot connect to the Docker daemon` / `failed to connect to the docker API`:** o Docker Desktop está fechado. Abra-o e aguarde ficar pronto.
- **`port is already allocated`:** a porta já está em uso (por exemplo, o backend rodando pela IDE na porta 8080). Pare o outro processo ou troque a porta:

  ```bash
  BACKEND_PORT=8081 FRONTEND_PORT=3001 DB_PORT=5434 docker compose up --build -d
  ```

---

## 👨‍💻 Autor

Desenvolvido por **Davi Silva Soares**.
