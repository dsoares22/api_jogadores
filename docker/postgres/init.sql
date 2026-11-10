-- Executado automaticamente pelo PostgreSQL na primeira vez que o container sobe
CREATE TABLE IF NOT EXISTS jogador (
    id                  BIGSERIAL PRIMARY KEY,
    nome                VARCHAR(100) NOT NULL,
    posicao             VARCHAR(50)  NOT NULL,
    clube               VARCHAR(150),
    numero_camisa       INTEGER CHECK (numero_camisa BETWEEN 1 AND 99),
    idade               INTEGER NOT NULL,
    quantidade_gols     INTEGER NOT NULL DEFAULT 0,
    quantidade_partidas INTEGER NOT NULL DEFAULT 0,
    ativo               BOOLEAN NOT NULL DEFAULT TRUE
);
