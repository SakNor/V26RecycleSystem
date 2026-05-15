import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Search() {
  // Brukes til å sende brukeren til søkeresultatsiden
  const navigate = useNavigate()

  // useSearchParams leser URL-parametere
  // trengs bare å leses her, derfor bare første verdi i arrayen
  const [searchParams] = useSearchParams()
  // fyller søkefeltet med det som alerede står i URL-en
  // hvis ingen ?q finnes, brukes tom streng som standardverdi
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSubmit = (event) => {
    event.preventDefault() // hindrer at siden lastes på nytt

    // Navigerer kun hvis søkefeltet ikke er tomt
    // encodeURIComponent gjør om spesialtegn
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    /* skjema med en input og en knapp - alt håndteres av handleSubmit */
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søk etter produkter..."
      />
      <button type="submit">Søk</button>
    </form>
  )
}
