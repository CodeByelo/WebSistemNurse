# Documentación del proyecto — WebSistemNurse

Este documento resume el proyecto, su estructura, cómo levantarlo y notas técnicas relevantes.

## Resumen

WebSistemNurse es una aplicación web para la gestión de consultas y expedientes de enfermería universitaria. Está desarrollada con React + Vite y usa TailwindCSS para estilos. El backend se encuentra en la carpeta `api/` (Node.js).

## Tecnologías principales

- React 18
- Vite
- TailwindCSS
- React Router v6
- Axios (para llamadas al API)
- Supabase (en el código hay consultas a Supabase — revisa si `src/lib/supabase` existe o está configurado)
- NeonDB / PostgreSQL (conexión desde `api/.env` en el ejemplo)

## Requisitos

- Node.js 18+ recomendado
- npm o yarn

## Instalación y ejecución (desarrollo)

Abre PowerShell en la raíz del proyecto y ejecuta:

```powershell
# instalar dependencias
npm install

# levantar servidor de desarrollo (Vite)
npm run start
# o alternativamente
npm run dev
```

Para crear una build de producción:

```powershell
npm run build
```

Para previsualizar la build:

```powershell
npm run serve
```

## Variables de entorno

- Archivo de cliente: `.env.local` (ejemplo incluido)
  - VITE_API_URL — URL base del backend (ej: http://localhost:3001)
  - VITE_NURSE_INVITE_CODE — código de invitación para el signup (ej: ENFERMERIA2025)

- Backend (carpeta `api/`): `api/.env` contiene la `DATABASE_URL` y `PORT`.

> Nota: si usas Supabase, normalmente necesitarás `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.local`. Revisa si hay un archivo `src/lib/supabase.js(x)` que inicialice el cliente Supabase; si no existe, crea uno antes de usar las llamadas.

## Estructura principal del proyecto

Resumen de carpetas y archivos importantes (raíz `src/`):

- `src/` - código frontend
  - `App.jsx`, `index.jsx` - entry point
  - `Routes.jsx` - definición de rutas
  - `layouts/DashboardLayout.jsx` - layout principal con `Sidebar`
  - `components/` - componentes reutilizables
    - `ui/` - botones, inputs, etc.
    - `AppIcon.jsx`, `Sidebar.jsx`, `SidebarEnfermeria.jsx`, etc.
  - `pages/` - páginas de la aplicación
    - `dashboard-enfermeria/index.jsx` - panel principal de enfermería
    - `nueva-consulta/index.jsx` - formulario de nueva consulta
    - `expedientes/ExpedientesPage.jsx` - buscador de expedientes
    - `inventario/`, `reportes/`, `reportes-mensuales/`, `configuracion/`, etc.
  - `services/api.js` - instancia Axios (usa `import.meta.env.VITE_API_URL`)
  - `styles/` - estilos Tailwind

- `api/` - backend ligero (Node) con su propia `package.json` y `api/.env` (DB URL)

## Rutas y layout

- Las rutas están definidas en `src/Routes.jsx` y envuelven páginas con `DashboardLayout`.
- `layouts/DashboardLayout.jsx` usa `react-router` `<Outlet />` para renderizar páginas hijas.

## Notas sobre llamadas a datos

- El frontend usa `services/api.js` (axios) para llamadas a un backend REST.
- En algunos componentes (ej. `ExpedientesPage.jsx`, `dashboard-enfermeria/index.jsx`) se ven consultas directas a Supabase via `supabase.from(...)`. Asegúrate de tener un archivo `src/lib/supabase.js` o `src/lib/supabase.jsx` que exporte `supabase` usando las variables de entorno:

```javascript
// ejemplo mínimo (src/lib/supabase.js)
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Si no usas Supabase, adapta el código para usar el API `services/api.js`.

## Errores comunes y soluciones

1. [plugin:vite:import-analysis] Failed to resolve import "..."
   - Causa: importaciones con rutas inválidas o alias no configurados.
   - Soluciones:
     - Usa rutas relativas correctas. Ejemplo: `import Layout from '../../layouts/DashboardLayout'`.
     - O configura alias en `vite.config.mjs` y en `jsconfig.json/tsconfig.json`.
       - `jsconfig.json` ya tiene `baseUrl: './src'`, lo que permite `import X from 'components/X'` si el editor lo soporta y `vite-tsconfig-paths` está activo.

2. Errores de parseo por contenido no JS (ej. triple-backticks)
   - Evita marcar archivos .jsx/.js con bloques ```markdown```. Si los archivos contienen esas marcas, Vite no podrá parsearlos.

3. N+1 queries a la base de datos
   - Algunos componentes traen la última consulta por estudiante dentro de un map — esto hace llamadas paralelas N veces.
   - Mejora sugerida: usar una sola query con join/foreign table select (en Supabase: `.select('*, expedientes(*)')` con limit y orden) o usar una función RPC en el backend.

## Desarrollo y buenas prácticas

- Usa `Input`, `Button` y demás componentes en `src/components/ui` para mantener consistencia.
- Usa optional chaining `?.` al acceder a datos que pueden ser null.
- Centraliza llamadas REST en `src/services/api.js` y lógica de autenticación en `src/contexts/AuthContext.jsx`.
- Añadir ESLint + Prettier para consistencia de estilo si no están configurados.

## Sugerencias de mejora / próximos pasos

- Añadir tests unitarios y de integración (React Testing Library) para componentes críticos.
- Añadir validaciones en formularios con `react-hook-form` o Zod.
- Implementar caching/optimización para queries (React Query / SWR) especialmente en listados grandes.
- Crear archivo `src/lib/supabase.js` con las variables de entorno necesarias.
- Añadir CI (GitHub Actions) para lint/build/test en PRs.

## Cómo contribuir

1. Haz fork / feature branch
2. Ejecuta `npm install` y `npm run start` localmente
3. Crea PR con descripción clara y screenshots si aplica

---

Si quieres, puedo:

- generar un `src/lib/supabase.js` con la inicialización de Supabase usando variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`;
- añadir una sección más detallada por cada archivo/paquete (por ejemplo, describir cada componente bajo `src/components/ui`);
- crear un `docs/ARCHITECTURE.md` más detallado con diagramas y flujos de datos.

Dime cuál de las opciones prefieres y lo implemento.