import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function CategoryProducts() {
    const {id} = useParams()
    const [products, setProducts] = useState([])
    const [categoryName, setCategoryName] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            const query = `{
            "category": *[_type == "category" && _id == $id[0]{title},
            "products": *[_type == "product" && subcategory -> category._ref == $id && status == "active"]{
            _id, title, "slug": slug.current, listingType, price, tradeWish}
            }`
            const result = await client.fetch(query, {id})
            setCategoryName(result.category?.title ?? 'Ukjent kategori')
            setProducts(result.products)
        }
        fetchProducts()
    }, [id])

    return(
        <div>
            <h1>{categoryName}</h1>
            {products.length === 0 ? (
                <p>Ingen aktive produkter i denne kategorien. </p>
            ) : ( 
                <ul>
                    {products.map(product => (
                        <li key ={product._id}>
                        <Link to={`/product/${product.slug}`}>{product.title}</Link>
                    {'-'}
                    {product.listingType === 'sale'
                    ? `${product.price} kr`
                    : `Bytte: ${product.tradeWish}`
                    }
                </li>
                    ))}
                </ul>
            
            )}
        </div>
    )
}