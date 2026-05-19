import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

const statusLabels = {
  active: 'Aktiv',
  reserved: 'Reservert',
  sold: 'Solgt',
  archived: 'Arkivert'
}

export default function Product() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
//Endret til slug istedetfor "id"
  useEffect(() => {
    const fetchProduct = async () => {
      const query = `*[_type == "product" && slug.current == $slug][0]{
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
      const result = await client.fetch(query, { slug })
      setProduct(result)
    }
    fetchProduct()
  }, [slug])

  if (!product) return <p>Laster produkt...</p>

  return (
    <div className="product">
      <h1>{product.title}</h1>

      <img
        src={product.imageUrl || `https://placehold.co/400x400?text=${encodeURIComponent(product.title)}`}
        alt={product.title}
        style={{ maxWidth: 400 }}
      />

      <p>{product.description}</p>

      <ul>
        <li>Status: {statusLabels[product.status] ?? product.status}</li>
        <li>
          Kategori: {product.subcategory?.category} / {product.subcategory?.title}
        </li>
        <li>
          Type: {product.listingType === 'sale' ? 'Til salgs' : 'Til bytte'}
        </li>
        {product.listingType === 'sale' && <li>Pris: {product.price} kr</li>}
        {product.listingType === 'trade' && <li>Ønskes byttet mot: {product.tradeWish}</li>}
      </ul>

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
