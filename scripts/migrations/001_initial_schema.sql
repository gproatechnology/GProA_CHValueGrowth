-- Migración Inicial: Tablas products y users
-- Fecha: 2026-04-27
-- Proyecto: NeumatiQ - CHValueGrowth

-- Tabla products
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source VARCHAR(50) NOT NULL DEFAULT 'mercadolibre',
    title VARCHAR(500) NOT NULL,
    brand VARCHAR(100),
    size VARCHAR(50),
    price FLOAT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'MXN',
    url VARCHAR(1000),
    scraped_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title, price, source, scraped_at)
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_product_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_product_size ON products(size);
CREATE INDEX IF NOT EXISTS idx_product_scraped_at ON products(scraped_at DESC);

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_verified BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_is_active ON users(is_active);

-- Check constraint para roles válidos (SQLite no soporta ADD CONSTRAINT, usar trigger o validar en app)
-- En PostgreSQL se usaría: ALTER TABLE users ADD CONSTRAINT ck_user_role CHECK (role IN ('admin','user','manager'));