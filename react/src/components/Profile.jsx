import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'
import './Profile.css'

// LoggedInUser sendes inn som prop fra App - brukes til å sjekke om dette er din egen profil
export default function Profile({ loggedInUser }) {
  // Henter bruker-ID fra URL-en
  const { id } = useParams()
  // Sant hvis innlogget bruker besøker sin egen profil
  // Brukes til å vise/skjule redigerings- og listevisning
  const isOwnProfile = loggedInUser && loggedInUser._id === id
  // tre separate states: brukerinfo, lister og produkter
  const [user, setUser] = useState(null)
  const [lists, setLists] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {
      // En GROQ-spørring som henter tre ting samtidig:
      // - brukerinfo, alle lister de eier, og alle aktive produkter
      // Effektivt - en nettverksforespørsel i stedet for tre
      const query = `{
        "user": *[_type == "user" && _id == $id][0]{
          _id, firstName, lastName, email, streetAddress, postalCode, city
        },
        "lists": *[_type == "userList" && owner._ref == $id]{
          _id, title, isPublic, "productCount": count(products)
        },
        "products": *[_type == "product" && owner._ref == $id && status == "active"]{
          _id, title, listingType, price, tradeWish
        }
      }`
      const result = await client.fetch(query, { id })
      // Fordeler resultatet på dde tre statene
      setUser(result.user)
      setLists(result.lists)
      setProducts(result.products)
    }
    fetchProfile()
  }, [id]) // kjører på nytt hvis ID-en i URL-en endrer seg

  // Vises mens data lastet
  if (!user) return <p>Laster brukerprofil...</p>

  return (
    // Kan byttes ut med article
    <div className="profile">
      <h1>{user.firstName} {user.lastName}</h1>

      {/* Vises kun hvis dette er din egen profil - bruker fragment for å gruppere */}
      {isOwnProfile && (
        <>
          {/* Strong kan like så greit være CSS. */}
          <p><strong>Dette er din profil</strong></p>
          <p><Link to="/products/new" className="button-link">+ Legg ut nytt produkt</Link></p>
        </>
      )}
      <p>{user.email}</p>
      <p>{user.streetAddress}, {user.postalCode} {user.city}</p>

      {/* Produktseksjon - vises for alle besøkende */}
      <section>
        <h2>Aktive produkter ({products.length})</h2>
        {products.length === 0 ? (
          <p>Ingen aktive produkter.</p>
        ) : (
          <ul>
            {products.map(product => (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>{product.title}</Link>
                {' — '}
                {/* Viser pris eller bytteønske avhengig av listingType */}
                {product.listingType === 'sale'
                  ? `${product.price} kr`
                  : `Bytte: ${product.tradeWish}`}
              </li>
            ))}
          </ul>
        )}
      </section>


      {/* listeseksjon - vises kun for eieren av profilen */}  
      {isOwnProfile && (
      <section>
        <h2>Lister ({lists.length})</h2>
        {lists.length === 0 ? (
          <p>Ingen lister.</p>
        ) : (
          <ul>
            {lists.map(list => (
              <li key={list._id}>
                <Link to={`/list/${list._id}`}>{list.title}</Link>
                {' — '}
                {list.productCount} produkter
                {/* Viser om listen er synlig for andre eller bare deg */}
                {list.isPublic ? ' (offentlig)' : ' (privat)'}
              </li>
            ))}
          </ul>
        )}
      </section>
      )}
    </div>
  )
}
