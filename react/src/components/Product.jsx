import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'


// Funksjon som oversetter statusverdier til tekst
const statusLabels = {
  active: 'Aktiv',
  reserved: 'Reservert',
  sold: 'Solgt',
  archived: 'Arkivert'
}

export default function Product() {
  // Henter produkt-ID fra URL-en
  const { id } = useParams()
  // Product starter som null - brukes til å vise "Laster..." 
  const [product, setProduct] = useState(null)

  // Henter produktdata fra Sanity når komponenter laster (eller ID endres)
  useEffect(() => {
    const fetchProduct = async () => {
      // GROQ-spørring: henter produktet med denne ID-en
      // -> følger referanser til bilde, underkategori, kategori og eier 
      const query = `*[_type == "product" && _id == $id][0]{
        _id,
        title,
        description,
        "imageUrl": image.asset->url,
        status,
        listingType,
        price,
        tradeWish,
        "subcategory": subcategory->{
          title,
          "category": category->title
        },
        "owner": owner->{
          _id, firstName, lastName, email, city
        }
      }`
      // Sender spørring med id som parameter og lagrer resultatet
      const result = await client.fetch(query, { id })
      setProduct(result)
    }
    fetchProduct()
  }, [id]) // Kjører på nytt hvis ID-en i URL-en endrer seg

  // Viser "Laster..." både når data hentes OG hvis produktet ikke finnes.
  // Bruk egne states for loading/error for å skille mellom tilfellene.
  if (!product) return <p>Laster produkt...</p>
  //if (loading) return <p>Laster produkt...</p>
  //if (error)   return <p>{error}</p>

  return (
    // Kan byttes ut med article
    <div className="product">
      <h1>{product.title}</h1>

    {/* Viser produktbilde - faller tilbake på plassholderbilde hvis ingen er lastet opp */}
      <img
        src={product.imageUrl || `https://placehold.co/400x400?text=${encodeURIComponent(product.title)}`}
        alt={product.title}
        // Kan være CSS
        style={{ maxWidth: 400 }}
      />

      <p>{product.description}</p>

      <ul>
        {/* Viser råverdien hvis statusen ikke finnes i tabellen */}
        {/* ?? nullish coalescing */}
        <li>Status: {statusLabels[product.status] ?? product.status}</li>
        {/* krasjer ikke hvis subcategory er null */}
        <li>
          Kategori: {product.subcategory?.category} / {product.subcategory?.title}
        </li>
        {/*  Ternær operator: viser ulik tekst avhengig av ListingType */}
        <li>
          Type: {product.listingType === 'sale' ? 'Til salgs' : 'Til bytte'}
        </li>
        {/* Pris vises kun hvis listinType er  'sale' */}
        {product.listingType === 'sale' && <li>Pris: {product.price} kr</li>}
        {/* Bytteønske vises kun hvis listingType er 'trade' */}
        {product.listingType === 'trade' && <li>Ønskes byttet mot: {product.tradeWish}</li>}
      </ul>

      {/* Eier-seksjon - lenker til eierens profilside */}
      <section className="owner-card">
        <h2>Eier</h2>
        <p>
          <Link to={`/profile/${product.owner._id}`}>
            {product.owner.firstName} {product.owner.lastName}
          </Link>
        </p>
        <p>{product.owner.email}</p>
        <p>{product.owner.city}</p>
      </section>
    </div>
  )
}
