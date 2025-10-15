import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tagger from '@dhiwise/component-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargamos .env.local manualmente
  const env = loadEnv(mode, process.cwd(), 'VITE');

  return {
    build: {
      outDir: 'build',
      chunkSizeWarningLimit: 2000,
    },
    plugins: [tsconfigPaths(), react(), tagger()],
    server: {
      port: 4028,
      host: '0.0.0.0',
      strictPort: true,
      allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    },
    // Inyectamos las variables como constantes globales
    define: {
      __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
  };
});