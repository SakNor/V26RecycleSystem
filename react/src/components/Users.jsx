import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const query = `*[_type == "user"] | order(firstName asc){
        _id, firstName, lastName, city
      }`
      const result = await client.fetch(query)
      setUsers(result)
    }
    fetchUsers()
  }, [])

  return (
    <div>
      <h1>Brukere</h1>
      {users.length === 0 ? (
        <p>Ingen brukere.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <Link to={`/profile/${user._id}`}>
                {user.firstName} {user.lastName}
              </Link>
              {user.city && ` — ${user.city}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
