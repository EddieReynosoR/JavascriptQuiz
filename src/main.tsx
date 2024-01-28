import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)
