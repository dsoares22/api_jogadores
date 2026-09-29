# Aplicação de Gestão e API de Jogadores

Aplicação Fullstack para cadastro, consulta e análise de desempenho de jogadores de futebol, desenvolvida com **Java (Spring Boot)** no Backend e **Vue.js (Vite)** no Frontend.

Os dados dos jogadores são armazenados no banco de dados **PostgreSQL** através do Spring JDBC.

---

## 🚀 Tecnologias Utilizadas

### Backend

- **Java 17+**
- **Spring Boot** (Spring Web, Spring JDBC)
- **Maven**
- **PostgreSQL**

### Frontend

- **Vue.js 3**
- **Vite**
- **Vue Router**
- **Axios**

---

## 📌 Funcionalidades

- **Gerenciamento Completo:** Cadastrar e editar jogadores (incluindo nome, posição, clube, número da camisa, idade, partidas, gols e status);
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

---

## 🛠️ Endpoints da API (Backend)

| Método | Endpoint                     | Descrição                                         |
| :----- | :--------------------------- | :------------------------------------------------ |
| `POST` | `/jogadores`                 | Cadastra um novo jogador (`201 Created`)          |
| `PUT`  | `/jogadores/{id}`            | Atualiza um jogador (`200 OK` ou `404 Not Found`) |
| `GET`  | `/jogadores`                 | Lista todos os jogadores cadastrados              |
| `GET`  | `/jogadores/{id}`            | Busca os detalhes de um jogador por ID            |
| `GET`  | `/jogadores/ativos`          | Lista apenas os jogadores ativos                  |
| `GET`  | `/jogadores/{id}/desempenho` | Consulta a análise de desempenho do jogador       |

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

---

## 💻 Como Executar a Aplicação

### 1. Pré-requisitos

- **JDK 17+** instalado;
- **Node.js 18+** instalado;
- **PostgreSQL** em execução com o banco configurado conforme o `application.properties`.

Antes de iniciar o backend em um banco existente, execute `sql/adicionar_numero_camisa.sql` no PostgreSQL. O número da camisa é opcional e, quando informado, deve estar entre 1 e 99.

---

### 2. Executando o Backend (Java / Spring Boot)

No terminal, a partir da raiz do projeto:

```bash
mvn spring-boot:run
```

> O servidor Backend estará rodando em: `http://localhost:8080`

---

### 3. Executando o Frontend (Vue.js / Vite)

Em um novo terminal, navegue até a pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd frontend_api_jogadores
npm install
npm run dev
```

> O aplicativo Frontend estará acessível no endereço indicado pelo terminal (geralmente `http://localhost:5173`).

---

## 👨‍💻 Autor

Desenvolvido por **Davi Silva Soares**.
