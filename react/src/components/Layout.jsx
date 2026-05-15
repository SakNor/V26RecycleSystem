import { Link, Outlet } from 'react-router-dom'
import Search from './Search'
import './Layout.css'

export default function Layout({ loggedInUser }) {
  return (
    /* Classname er for å lage klasser som kan brukes i ekstern CSS */
    <div className="layout">
      <header className="header">
        <h1>Gjenbruken</h1>
        {/* 12 Komponent, henter søkefunksjonen fra search.jsx */}
        <Search />
      {/* 14 Hvis loggedInUser finnes vis fornavnet, hvis ikke vises 'Ingen bruker lastet' */}
        <p>Velkommen {loggedInUser ? loggedInUser.firstName : 'Ingen bruker lastet'}</p>
      </header>

    {/* 18 css */}
    {/* nav = navigasjon */}
      <nav className="nav">
        {/* 21 uorganisert liste */}
        <ul>
          {/* Routing, / er index, organisert liste med linker, fungerer som en <a href> men bytter ut innholdet isteden for å laste inn siden på nytt */}
          <li><Link to="/">Hjem</Link></li>
          <li><Link to="/users">Brukere</Link></li>
          {loggedInUser && (
            <>
              <li><Link to={`/profile/${loggedInUser._id}`}>Min Profil</Link></li>
              <li><Link to="/products/new">Nytt produkt</Link></li>
            </>
          )}
        </ul>
      </nav>
{/* Outlet bytter ut hovedinnholdet/main slik at header og footer ikke trenger å endre seg.  */}
{/* LoggedInUser gjør at undersidene forstår hvem som er logget inn */}
      <main className="main-content">
        <Outlet loggedInUser={loggedInUser} />
      </main>


      <footer className="footer">
        <p>&copy; 2026 Gjenbruken. Alle rettigheter reservert.</p>
        <p><Link to="/privacy">Privacy</Link></p>
      </footer>
    </div>
  )
}
