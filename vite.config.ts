import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/material/Tooltip',
      '@mui/material/Button',
      '@emotion/react',
      '@emotion/styled',
      '@mui/x-date-pickers/AdapterDateFns',
      '@mui/x-date-pickers/LocalizationProvider',
      '@mui/x-date-pickers/DatePicker',
      'date-fns'
    ],
    force: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})