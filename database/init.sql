-- Base de datos inicial para SGIM (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('usuario', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
    CREATE TYPE report_status AS ENUM ('pendiente', 'en_proceso', 'resuelto');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  role user_role NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'pendiente',
  reporter_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  assignee_id UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports (id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  content_type VARCHAR(120),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  jti UUID NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  user_agent TEXT,
  ip VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_jti ON sessions(jti);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports (reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_assignee ON reports (assignee_id);

-- ✅ Usuarios seed (bcrypt)
-- password admin: 123456
-- password user:  123456
INSERT INTO users (full_name, email, role, password)
VALUES
  ('Admin SGIM', 'admin@sgim.com', 'admin', '$2b$10$Ca1SN41RKjcpJvCRPGBYQ.SFTa5ywm/exymgcww.GkHf4dDf.a3Pu'),
  ('Usuario SGIM', 'user@sgim.com', 'usuario', '$2b$10$Iob/X7pcK5pgN6anwOoWGeb2eeQKhivPQrLnsXPktuGRcyltJhc5.')
ON CONFLICT (email) DO NOTHING;
