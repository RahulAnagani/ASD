import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   // <-- Add this line to set the base path
  plugins: [react(), tailwindcss()],
})
