import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import client from './helpers/sanityClient'
import Layout from './components/Layout'
import Home from './components/Home'
import Product from './components/Product'
import Profile from './components/Profile'
import List from './components/List'
import Users from './components/Users'
import Show404 from './components/show404'
import NewProduct from './components/NewProduct'
import SearchResults from './components/SearchResults'
import './App.css'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    // Only fetch if loggedInUser is not set
    if (!loggedInUser) {
      const fetchUser = async () => {
        try {
          const query = `*[_type == "user"][0]{ _id, firstName, lastName }`
          const user = await client.fetch(query)
          setLoggedInUser(user)
        } catch (error) {
          console.error('❌ Error fetching logged in user:', error)
        }
      }
      fetchUser()
    }
  }, [])

  return (
    <Routes>
      <Route element={<Layout loggedInUser={loggedInUser} />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/profile/:id" element={<Profile loggedInUser={loggedInUser} />} />
        <Route path="/list/:id" element={<List />} />
        <Route path="/products/new" element={<NewProduct loggedInUser={loggedInUser} />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<Show404 />} />
      </Route>
    </Routes>
  )
}

export default App
