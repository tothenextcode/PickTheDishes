DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  instagram varchar(255),
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE
);
