import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function List() {
  const { id } = useParams()
  const [list, setList] = useState(null)

  useEffect(() => {
    const fetchList = async () => {
      const query = `*[_type == "userList" && _id == $id][0]{
        _id,
        title,
        isPublic,
        "owner": owner->{ _id, firstName, lastName },
        "products": products[]->{
          _id, title,"slug":slug.current, status, listingType, price, tradeWish
        }
      }`
      const result = await client.fetch(query, { id })
      setList(result)
    }
    fetchList()
  }, [id])

  if (!list) return <p>Laster liste...</p>

  return (
    <div className="list">
      <h1>{list.title}</h1>
      <p>
        Eier:{' '}
        <Link to={`/profile/${list.owner._id}`}>
          {list.owner.firstName} {list.owner.lastName}
        </Link>
      </p>
      <p>{list.isPublic ? 'Offentlig liste' : 'Privat liste'}</p>

      <h2>Produkter ({list.products?.length ?? 0})</h2>
      {!list.products || list.products.length === 0 ? (
        <p>Ingen produkter i listen.</p>
      ) : (
        <ul>
          {list.products.map(product => (
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
    </div>
  )
}
