import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function Home() {
  const [forSale, setForSale] = useState([])
  const [forTrade, setForTrade] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
       const query = `{
        "forSale": *[_type == "product" && status == "active" && listingType == "sale"]
          | order(_createdAt desc)[0...5]{
            _id, title, price
          },
        "forTrade": *[_type == "product" && status == "active" && listingType == "trade"]
          | order(_createdAt desc)[0...5]{
            _id, title, tradeWish
          },
        "categories": *[_type == "category"] | order(title asc){_id, title}  // ✅ 2. Move inside the query object
      }`
      const result = await client.fetch(query)
      setForSale(result.forSale)
      setForTrade(result.forTrade)
      setCategories(result.categories)
    }
    fetchProducts()
  }, [])

  return (
    <div>
    <section>
      <h2>Kategorier</h2>
      {categories.length === 0 ? (
        <p>Ingen kategorier funnet.</p>
      ) : (
        <ul>
          {categories.map(cat => (
            <li key={cat._id}>
              <Link to={`/category/${cat._id}`}>{cat.title}</Link>
            </li>
          ))}
        </ul>
      )}
      </section>
      <section>
        <h2>Nyeste produkter til salgs</h2>
        {forSale.length === 0 ? (
          <p>Ingen produkter til salgs.</p>
        ) : (
          <ul>
            {forSale.map(product => (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>{product.title}</Link>
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
                <Link to={`/product/${product._id}`}>{product.title}</Link>
                {' — '}Bytte: {product.tradeWish}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
