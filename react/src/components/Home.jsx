import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function Home() {
  // Lager en state. Staten er en tom array, som vi kan legge til ting inni. 
  const [forSale, setForSale] = useState([])
  const [forTrade, setForTrade] = useState([])

  // useEffect er en funksjon som henter data fra komponenter. 
  useEffect(() => {
    // Arrow funksjonen peker til en anonym funksjon, som vil si at den ikke er bundet til en spesifik identifikator.
    // Async henter informasjon fra Sanity.
    const fetchProducts = async () => {
      // GROQ-spørring. Henter info fra Sanity
      // Henter alle produkter som er aktive, og er til salgs
      // Sorterer etter opplastningsdato
      // Viser tittel og pris
      const query = `{
        "forSale": *[_type == "product" && status == "active" && listingType == "sale"]
          | order(_createdAt desc)[0...5]{
            _id, title, price
          },
        "forTrade": *[_type == "product" && status == "active" && listingType == "trade"]
          | order(_createdAt desc)[0...5]{
            _id, title, tradeWish
          }
      }`
      // Henter alle produkter som er aktive, og ønskes å byttes
      // Viser tittel og bytteønske i rekkefølge etter opplastningsdato
      // Await fetch er en måte å hente data. Fetch henter dataen, 
      // og await gjør at funksjonen venter til all dataen er hentet før det skjer noe mer.
      // Fetch sender query til Sanity. Await venter til all dataen er hentet. 
      const result = await client.fetch(query)
      // Staten her har resultatet fra GROQ-spørringa 
      setForSale(result.forSale)
      setForTrade(result.forTrade)
    }
    fetchProducts()
  }, [])
  // [] Er en dependency som gjør at siden henter dataen 1 gang og hindrer at den henter data hele tiden.
  return (
    // <div> burde fjernes og byttes ut med fragments. <> </>
    <div>
      <section>
        {/* Gjør at hvis den ikke finner ett produkt vil det bli erstattet med <p> */}
        <h2>Nyeste produkter til salgs</h2>
        {forSale.length === 0 ? (
          <p>Ingen produkter til salgs.</p>
        ) : (
          /* Lister ut produkter + setter rekkefølgen/hva som skal med */
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
        {/* Gjør at hvis den ikke finner ett produkt vil det bli erstattet med <p> */}
        <h2>Nyeste produkter til bytte</h2>
        {forTrade.length === 0 ? (
          <p>Ingen produkter til bytte.</p>
        ) : (
          /* Lister ut produkter + setter rekkefølgen/hva som skal med */
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
