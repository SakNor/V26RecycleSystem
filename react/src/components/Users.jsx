import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function Users() {
  // Liste over alle brukere - starter tom til Sanity svarer
  const [users, setUsers] = useState([])

  // Henter alle brukere fra Sanity når komponenter laster
  useEffect(() => {
    const fetchUsers = async () => {
      // GROQ-spørring: henter alle brukere sortert alfabetisk på fornavn
      // Henter bare feltene vi trenger - ikke e-post eller adresse
      const query = `*[_type == "user"] | order(firstName asc){
        _id, firstName, lastName, city
      }`
      const result = await client.fetch(query)
      setUsers(result)
    }
    fetchUsers()
  }, []) // Tom array = kjører bare en gang ved første render

  return (
    // Kan byttes ut med article.
    <div>
      <h1>Brukere</h1>

      {/* Viser melding hvis ingen brukere finnes, ellers lister dem opp  */}
      {users.length === 0 ? (
        <p>Ingen brukere.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {/* hvert navn er en klikkbar lenke til brukerens profilside */}
              <Link to={`/profile/${user._id}`}>
                {user.firstName} {user.lastName}
              </Link>
              {/* Viser by kun hvis den er satt - && er kortslutning: hopper over hvis city er tom */}
              {user.city && ` — ${user.city}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
