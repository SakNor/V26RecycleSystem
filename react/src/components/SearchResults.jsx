import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function SearchResults() {
  // leser søketeksten fra URL-en
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  // results: listen over treff fra sanity
  // loading: true mens søket pågår - brukes til å vise "Søker..."
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Kjører et nytt søk hver gang q endrer seg (ny URL-parameter)
  useEffect(() => {
    // hvis søkefeltet er tomt, nullstill resultater og ikke søk
    if (!q) {
      setResults([])
      return
    }
    const fetchResults = async () => {
      setLoading(true)

      // GROQ-spørring: søker i title og description med "match"
      // $term er søkeordet med * på hver side - gir treff på delvise ord
      const query = `*[_type == "product" && (
        title match $term || description match $term
      )]{
        _id, title, description, listingType, price, tradeWish, status
      } | order(title asc)`

      // sender søket og lagrer resultatet - sortert alfabetisk på tittel
      const data = await client.fetch(query, { term: `*${q}*` })
      setResults(data)
      setLoading(false)
    }
    fetchResults()
  }, [q]) // avhengig av q - kjører på nytt ved nytt søk

  return (
    <div>
      <h1>Søkeresultater for "{q}"</h1>

      {/* tre mulige tilstander: laster / ingen treff / vis resultater */}
      {loading ? (
        <p>Søker...</p>
      ) : results.length === 0 ? (
        <p>Ingen produkter funnet.</p>
      ) : (
        <ul>
          {results.map(product => (
            <li key={product._id}>
              {/* klikkbar lenke til produktsiden */}
              <Link to={`/product/${product._id}`}>{product.title}</Link>
              {' — '}
              {/* viser pris eller bytteønske avhengig av listingType */}
              {product.listingType === 'sale'
                ? `${product.price} kr`
                : `Bytte: ${product.tradeWish}`}
              {' — '}
              {/* Råstatus fra Sanity */}
              {product.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
