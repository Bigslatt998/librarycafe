import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/librarycafe/',
  server:{
    host: true,
    
  },
  build: {
    rollupOptions: {
      external: ['emailjs-com']
    }
  }

})
