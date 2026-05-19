import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function Home() {
  const [forSale, setForSale] = useState([])
  const [forTrade, setForTrade] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
    const query = `{
        "forSale": *[_type == "product" && status == "active" && listingType == "sale"]
          | order(_createdAt desc)[0...5]{
            _id, title, price, "slug": slug.current
          },
        "forTrade": *[_type == "product" && status == "active" && listingType == "trade"]
          | order(_createdAt desc)[0...5]{
            _id, title, tradeWish, "slug": slug.current
          }
      }`
      const result = await client.fetch(query)
      console.log(result.forSale)
      setForSale(result.forSale)
      setForTrade(result.forTrade)
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <section>
        <h2>Nyeste produkter til salgs</h2>
        {forSale.length === 0 ? (
          <p>Ingen produkter til salgs.</p>
        ) : (
          <ul>
            {forSale.map(product => (
              <li key={product._id}>
                <Link to={`/product/${product.slug}`}>{product.title}</Link>
                {' — '}{product.price} kr
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Nyeste produkter til bytte</h2>
        {forTrade.length === 0 ? (
          <p>Ingen produkter til bytte.</p>
        ) : (
          <ul>
            {forTrade.map(product => (
              <li key={product._id}>
                <Link to={`/product/${product.slug}`}>{product.title}</Link>
                {' — '}Bytte: {product.tradeWish}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}