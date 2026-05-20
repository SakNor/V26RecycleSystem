import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import client from '../helpers/sanityClient';

export default function Login({ setLoggedInUser }) {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            const query = `*[_type == "user" && email == $email][0]{
            _id, firstName, lastName, email, password}`

            const user = await client.fetch(query, {email})

            if (!user) {
                setError ('Fant ingen bruker med denne e-posten.')
                setSubmitting(false)
                return
            }
        
        const {password: _, ...safeUser } = user
        setLoggedInUser(safeUser)
        navigate('/')

        } catch (err) {
            setError('Noe gikk galt. Prøv igjen.')
            setSubmitting(false)
        }
    }

    return ( 
        <div className="login">
            <h1>Logg inn</h1>
            <form onSubmit={handleSubmit}>
            <p>
                <label> E-post:
                    <input type ="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={submitting} />
                </label>
            </p>
            <p>
                <label>Passord:
                    <input type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={submitting} />
                </label>
            </p>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={submitting}>
            {submitting ? 'Logger inn...' : 'Logg inn'}
            </button>
            </form>
        </div>
    )
}