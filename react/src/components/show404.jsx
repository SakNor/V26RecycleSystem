
// Feilside - vises når ingen ruter matcher med URL-en
export default function Show404() {
    return (
        // Kan byttes ut med fragments
        <div>
            {/* Bilde fra public-mappen - lastes direkte uten import */}
            {/* Burde være ekstern CSS */}
            <img src="./404.png" alt="404 Not Found" style={{ maxWidth: '100%', margin: '20px 0' }} />
            {/* Forklaringstekst til brukeren */}
            <p>Sorry, the page you are looking for does not exist or are currently being built. The builders are a shopping bag and a dog, so this might take some time...</p>
        </div>
    )
}
