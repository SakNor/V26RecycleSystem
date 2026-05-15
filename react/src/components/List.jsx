import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function List() {
  //Henter list-ID fra URL-en
  const { id } = useParams()
  //Brukes til å vise "Laster..." mens den laster inn listen
  const [list, setList] = useState(null)

  // useEffect henter data fra komponentet
  useEffect(() => {
    const fetchList = async () => {
      // GROQ-spørring: henter listen med ID-en fra sanity. (Lager ønskelisten som er tilknyttet brukeren.)
      // henter også eierens navn og alle produkter som er referert
      const query = `*[_type == "userList" && _id == $id][0]{
        _id,
        title,
        isPublic,
        "owner": owner->{ _id, firstName, lastName },
        "products": products[]->{
          _id, title, status, listingType, price, tradeWish
        }
      }`

      // Sender spørringen med ID og lagrer resultatet
      const result = await client.fetch(query, { id })
      setList(result)
    }

    // kjører på nytt hvis ID-en i URL-en endrer seg 
    fetchList()
  }, [id])

  //Vises mens data lastes inn
  if (!list) return <p>Laster liste...</p>

  return (
    <div className="list">
      <h1>{list.title}</h1>

      {/* Viser eier som en klikkbar lenke til profilen. */}
      <p>
        Eier:{' '}
        <Link to={`/profile/${list.owner._id}`}>
          {list.owner.firstName} {list.owner.lastName}
        </Link>
      </p>
      {/* Viser om listen er offentlig eller privat. */}
      <p>{list.isPublic ? 'Offentlig liste' : 'Privat liste'}</p>

      {/* Antall produkter - bruker '?? 0' i tilfelle product er null */}
      <h2>Produkter ({list.products?.length ?? 0})</h2>

      {/* Hvis ingen produkter: vis melding. Ellers: vis listen */}
      {!list.products || list.products.length === 0 ? (
        <p>Ingen produkter i listen.</p>
      ) : (
        <ul>
          {list.products.map(product => (
            <li key={product._id}>
              {/* Hvert produkt lenker til sin egen produktside */}
              <Link to={`/product/${product._id}`}>{product.title}</Link>
              {' — '}
              {/* Viser pris hvis det er et salg, ellers bytteønske */}
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
