# API - Backend (Neon Postgres)

Este directorio contiene el backend mínimo que usa Neon (Postgres) como base de datos.

Requisitos
- Node.js 18+

Variables de entorno (archivo `api/.env`)
- DATABASE_URL: cadena de conexión proporcionada por Neon (por ejemplo: `postgresql://user:pass@ep-...neon.tech/dbname?sslmode=require`)
- PORT: puerto donde corre el backend (opcional, por defecto 3001)

Inicio rápido (desde la carpeta raíz del repo):

```powershell
cd api
npm install
node index.js
```

Notas
- La conexión a la base de datos está centralizada en `api/db.js` y exporta un `Pool` de `pg`.
- Neon recomienda usar SSL (por eso `ssl: { rejectUnauthorized: false }` en la configuración).
- Evita commitear credenciales en el repositorio; usa `api/.env` para desarrollo y variables de entorno en producción.

Siguientes pasos recomendados
- Implementar migraciones (pg-migrate, knex, Prisma) para mantener el esquema.
- Añadir manejo de pool en caso de uso en serverless (PgBouncer o la guía de Neon).
