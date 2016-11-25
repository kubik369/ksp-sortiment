-- Up
PRAGMA foreign_keys = ON;

CREATE TABLE products (
  id    INTEGER      PRIMARY KEY,
  label VARCHAR(20)  NOT NULL,
  price REAL         NOT NULL,
  stock INTEGER      NULL
);

CREATE TABLE users (
  id       INTEGER      PRIMARY KEY,
  username VARCHAR(20)  NOT NULL UNIQUE,
  balance  REAL         NOT NULL
);

CREATE TABLE logs (
  id             INTEGER     PRIMARY KEY,
  user_id        VARCHAR(20) NOT NULL,
  balance_change REAL        NOT NULL,
  info           TEXT        NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Down
