import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../helpers/sanityClient'
import './NewProduct.css'

export default function NewProduct({ loggedInUser }) {
  const navigate = useNavigate()

  const [subcategories, setSubcategories] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [listingType, setListingType] = useState('sale')
  const [price, setPrice] = useState('')
  const [tradeWish, setTradeWish] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSubcategories = async () => {
      const query = `*[_type == "subcategory"] | order(title asc){
        _id, title, "category": category->title
      }`
      const data = await client.fetch(query)
      setSubcategories(data)
    }
    fetchSubcategories()
  }, [])

  if (!loggedInUser) {
    return <p>Du må være logget inn for å legge ut et produkt.</p>
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Tittel er påkrevd.')
      return
    }
    if (!subcategoryId) {
      setError('Velg en underkategori.')
      return
    }
    if (listingType === 'sale' && !price.trim()) {
      setError('Pris er påkrevd for salg.')
      return
    }
    if (listingType === 'trade' && !tradeWish.trim()) {
      setError('Beskriv hva du ønsker å bytte mot.')
      return
    }

    setSubmitting(true)
    try {
      const newProduct = await client.create({
        _type: 'product',
        title: title.trim(),
        description: description.trim(),
        status: 'active',
        listingType,
        owner: { _type: 'reference', _ref: loggedInUser._id },
        subcategory: { _type: 'reference', _ref: subcategoryId },
        ...(listingType === 'sale' ? { price: price.trim() } : {}),
        ...(listingType === 'trade' ? { tradeWish: tradeWish.trim() } : {}),
        ...(listingType === 'gift' ? { gift: gift.trim() } : {})
      })
      navigate(`/product/${newProduct._id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Legg ut nytt produkt</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <p>
          <label>
            Tittel:{' '}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
            />
          </label>
        </p>

        <p>
          <label>
            Beskrivelse:<br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              rows={4}
            />
          </label>
        </p>

        <p>
          <label>
            Underkategori:{' '}
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={submitting}
            >
              <option value="">— velg underkategori —</option>
              {subcategories.map(sc => (
                <option key={sc._id} value={sc._id}>
                  {sc.category} / {sc.title}
                </option>
              ))}
            </select>
          </label>
        </p>

        <fieldset disabled={submitting}>
          <legend>Type</legend>
          <label>
            <input
              type="radio"
              name="listingType"
              value="sale"
              checked={listingType === 'sale'}
              onChange={(e) => setListingType(e.target.value)}
            />
            {' '}Til salgs
          </label>
          {' '}
          <label>
            <input
              type="radio"
              name="listingType"
              value="trade"
              checked={listingType === 'trade'}
              onChange={(e) => setListingType(e.target.value)}
            />
            {' '}Til bytte
          </label>
          <label>
            <input
              type="radio"
              name="listingType"
              value="gift"
              checked={listingType === 'gift'}
              onChange={(e) => setListingType(e.target.value)}
            />
            {' '}Gis bort
            </label>
        </fieldset>

        {listingType === 'sale' && (
          <p>
            <label>
              Pris (kr):{' '}
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={submitting}
              />
            </label>
          </p>
        )}

        {listingType === 'trade' && (
          <p>
            <label>
              Ønskes byttet mot:<br />
              <textarea
                value={tradeWish}
                onChange={(e) => setTradeWish(e.target.value)}
                disabled={submitting}
                rows={3}
              />
            </label>
          </p>
        )}

        {error && <p className="form-error">{error}</p>}

        <p>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Legger ut…' : 'Legg ut produkt'}
          </button>
        </p>
      </form>
    </div>
  )
}
