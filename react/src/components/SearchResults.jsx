import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) {
      setResults([])
      return
    }
    const fetchResults = async () => {
      setLoading(true)
      const query = `*[_type == "product" && (
        title match $term || description match $term
      )]{
        _id, title, description, listingType, price, tradeWish, status
      } | order(title asc)`
      const data = await client.fetch(query, { term: `*${q}*` })
      setResults(data)
      setLoading(false)
    }
    fetchResults()
  }, [q])

  return (
    <>
      <h1>Søkeresultater for "{q}"</h1>
      {loading ? (
        <p>Søker...</p>
      ) : results.length === 0 ? (
        <p>Ingen produkter funnet.</p>
      ) : (
        <ul>
          {results.map(product => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>{product.title}</Link>
              {' — '}
              {product.listingType === 'sale'
                ? `${product.price} kr`
                : `Bytte: ${product.tradeWish}`}
              {' — '}
              {product.status}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
