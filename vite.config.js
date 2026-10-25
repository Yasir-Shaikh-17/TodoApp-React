import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/TodoApp-React/', // '/' on Vercel, repo name on GitHub Pages
  plugins: [react(), tailwindcss()],
})