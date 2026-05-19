import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'
import './Profile.css'

export default function Profile({ loggedInUser }) {
  const { id } = useParams()
  const isOwnProfile = loggedInUser && loggedInUser._id === id
  const [user, setUser] = useState(null)
  const [lists, setLists] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {
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
      setUser(result.user)
      setLists(result.lists)
      setProducts(result.products)
    }
    fetchProfile()
  }, [id])

  if (!user) return <p>Laster brukerprofil...</p>

  return (
    <div className="profile">
      <h1>{user.firstName} {user.lastName}</h1>
      {isOwnProfile && (
        <>
          <p><strong>Dette er din profil</strong></p>
          <p><Link to="/products/new" className="button-link">+ Legg ut nytt produkt</Link></p>
        </>
      )}
      <p>{user.email}</p>
      <p>{user.streetAddress}, {user.postalCode} {user.city}</p>

      <section>
        <h2>Aktive produkter ({products.length})</h2>
        {products.length === 0 ? (
          <p>Ingen aktive produkter.</p>
        ) : (
          <ul>
            {products.map(product => (
              <li key={product._id}>
                <Link to={`/product/${product.slug.current}`}>{product.title}</Link>
                {' — '}
                {product.listingType === 'sale'
                  ? `${product.price} kr`
                  : `Bytte: ${product.tradeWish}`}
              </li>
            ))}
          </ul>
        )}
      </section>

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
