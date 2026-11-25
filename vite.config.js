import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { onlyOfficeRuntime } from './scripts/onlyoffice-runtime.mjs'

// https://vite.dev/config/
export default defineConfig({
  build: { rolldownOptions: { input: ['index.html', 'compiler/index.html'] } },
  plugins: [
    react(),
    tailwindcss(),
    onlyOfficeRuntime(),
  ],
})
