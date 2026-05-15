// BrowserRouter aktiverer URL-basert navigasjon i hele appen
import { BrowserRouter } from 'react-router-dom'

// CreateRoot er den moderne måten å starte en React-app på
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Finner <div id="root"> i index.html og monterer React-appen inn i den
// BrowserRouter wrapper gjør at useNavigate, Link og Routes fungerer overalt i appen
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
