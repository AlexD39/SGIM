# Setup SGIM

## 1. Backend

cd backend
npm install
npm start

## 2. Base de datos

Crear base de datos:
CREATE DATABASE sgim;

## 3. Migración de sesiones

Ejecutar:

psql -U postgres -d sgim -f database/sessions.sql

## 4. Variables de entorno

Copiar .env.example a .env y configurar credenciales