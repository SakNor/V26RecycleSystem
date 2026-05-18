import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../helpers/sanityClient'
import './NewProduct.css'

export default function NewProduct({ loggedInUser }) {
  // Sender brukeren videre etter at produktet er opprettet.
  const navigate = useNavigate()

  // Liste over underkategorier hentet fra Sanity - brukes i dropdown-meny.
  const [subcategories, setSubcategories] = useState([])

  // Skjemafelt - ett state per felt brukeren fyller inn.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [listingType, setListingType] = useState('sale')
  const [price, setPrice] = useState('')
  const [tradeWish, setTradeWish] = useState('')

  // Submitting: true mens venter på svar fra Sanity (hindrer dobbeltklikk)
  // False for å ikke sende skjemaet med engang siden laster, blir true når submitknappen trykkes, går tilbake til false
  // error: viser feilmelding til brukeren hvis noe går galt.
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)


  // henter alle underkategorier fra Sanity når komponenten laster
  // Sortert alfabetisk, med kategorinavnet inkludert.
  useEffect(() => {
    const fetchSubcategories = async () => {
      const query = `*[_type == "subcategory"] | order(title asc){
        _id, title, "category": category->title
      }`
      const data = await client.fetch(query)
      setSubcategories(data)
    }
    fetchSubcategories()
  }, []) // Tom array = kjører bare en gang ved første render

  // Hvis ingen bruker er logget inn, vis melding i stedet for skjemaet
  if (!loggedInUser) {
    return <p>Du må være logget inn for å legge ut et produkt.</p>
  }

  const handleSubmit = async (event) => {
    event.preventDefault() // Hindrer at siden lastet på nytt
    setError(null)

    //validering - sjekker at alle påkrevde felt er fylt ut
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
      // Oppretter nytt produkt-dokument i Sanity
      // Owner og subcategory lagres som referanser, ikke kopier
      // Spread-syntaksen legger kun til price ELLER tradewish
      const newProduct = await client.create({
        _type: 'product',
        title: title.trim(),
        description: description.trim(),
        status: 'active',
        listingType,
        owner: { _type: 'reference', _ref: loggedInUser._id },
        subcategory: { _type: 'reference', _ref: subcategoryId },
        ...(listingType === 'sale' ? { price: price.trim() } : {}),
        ...(listingType === 'trade' ? { tradeWish: tradeWish.trim() } : {})
      })
      // Sender brukeren til produktsiden for det nye produktet
      navigate(`/product/${newProduct._id}`)
    } catch (err) {
      // Hvis Sanity kaster en feil, vises den til brukeren
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Legg ut nytt produkt</h1>
      <form onSubmit={handleSubmit} className="product-form">
       
       {/* tittel-felt */}
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

        {/* Beskrivelse */}
        <p>
          <label>
            {/* Burde heller bruke label, og display: block, i CSS, istedenfor break. */}
            Beskrivelse:<br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              rows={4}
            />
          </label>
        </p>
        {/* Dropdown - viser "Elektronikk / mobiler" etc. */}
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
        
        {/* Radioknapper: salg eller bytte */}
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
        </fieldset>
        
        {/* prisfelt - kun synlig ved salg */}
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

      {/* Bytteønskefelt - kun synlig ved bytte */}
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

        {/* Feilmelding - vises kun hvis error er satt */}
        {error && <p className="form-error">{error}</p>}

        {/* Knappen endrer tekst og låses men skjemaet sendes */}
        <p>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Legger ut…' : 'Legg ut produkt'}
          </button>
        </p>
      </form>
    </div>
  )
}
