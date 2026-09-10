CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(80) NOT NULL DEFAULT 'Especialista',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO team_members (name, role)
SELECT seed.name, seed.role
FROM (VALUES
  ('Rissa Pearson', 'Especialista'),
  ('Juan Gomez', 'Especialista'),
  ('Ana Lopez', 'Especialista'),
  ('Carlos Ruiz', 'Especialista'),
  ('Elena Sanz', 'Especialista')
) AS seed(name, role)
WHERE NOT EXISTS (SELECT 1 FROM team_members);

INSERT INTO products (name, price)
SELECT seed.name, seed.price
FROM (VALUES
  ('Plan Starter', 29.00),
  ('Plan Pro', 79.00),
  ('Plan Enterprise', 199.00)
) AS seed(name, price)
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO clients (name, email)
SELECT seed.name, seed.email
FROM (VALUES
  ('Orígenes Kicks', 'admin@origeneskicks.com'),
  ('Central Commerce', 'admin@central.local'),
  ('Salud Premium', 'dr-botero@ejemplo.com')
) AS seed(name, email)
WHERE NOT EXISTS (SELECT 1 FROM clients);

INSERT INTO notifications (title, message)
SELECT seed.title, seed.message
FROM (VALUES
  ('Reporte pendiente', 'Revisa el rendimiento semanal del tablero.'),
  ('Nuevo cliente', 'Se registró un nuevo cliente en la plataforma.'),
  ('Sistema activo', 'La conexión con PostgreSQL local está lista.')
) AS seed(title, message)
WHERE NOT EXISTS (SELECT 1 FROM notifications);
