import { Link, Outlet } from 'react-router-dom'
import Search from './Search'
import './Layout.css'

export default function Layout({ loggedInUser }) {
  return (
    <div className="layout">
      <header className="header">
       <Link to="/">Gjenbruken</Link>
        <Search />
        <p>Velkommen {loggedInUser ? loggedInUser.firstName : 'Ingen bruker lastet'}</p>
      </header>

      <nav className="nav">
        <ul>
          <li><Link to="/">Hjem</Link></li>
          <li><Link to="/users">Brukere</Link></li>
          {loggedInUser ? (
            <>
              <li><Link to={`/profile/${loggedInUser._id}`}>Min Profil</Link></li>
              <li><Link to="/products/new">Nytt produkt</Link></li>
              <li>
                <button onClick={() => setLoggedInUser(null)}>Logg ut</button>
              </li>
            </>
          ) : (
            <li><Link to="/login">Logg inn</Link></li>
          )}
        </ul>
      </nav>

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
