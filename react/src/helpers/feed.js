import client from './sanityClient.js'

// Helper function to get random element
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Helper function to get random number in range
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// Helper function to shuffle array
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

// First names and last names for generating users
const firstNames = [
  'Johan', 'Maria', 'Erik', 'Anna', 'Per',
  'Kari', 'Ole', 'Astrid', 'Bjørn', 'Inger'
]

const lastNames = [
  'Hansen', 'Andersen', 'Larsen', 'Johansen', 'Olsen',
  'Berg', 'Nilsen', 'Ström', 'Sørensen', 'Dahl'
]

// Test cities
const cities = ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Kristiansand', 'Tromsø']

// Product titles for different subcategories
const productTitles = {
  Electronics: [
    'Brukt MacBook Pro 13"',
    'iPhone XS Max',
    'Sony Kamera',
    'Trådløse hodetelefoner',
    'Bærbar Bluetooth høyttaler',
    'USB-C kabel',
    'Ladekabel',
    'Skjermskjermer'
  ],
  Furniture: [
    'Birk-sofakrok',
    'Skrivebord',
    'Hvit bokhylle',
    'Spisebordsstoler',
    'Nattbord',
    'Garderobe',
    'TV-benk',
    'Reol'
  ],
  Clothing: [
    'Vintage denim jakke',
    'Dress kostyme',
    'Snørstøvler',
    'Sommerkjole',
    'Joggebukse',
    'Skjorte',
    'Sportssko',
    'Lammegenser'
  ],
  Books: [
    'Harry Potter samling',
    'Ender\'s Game',
    'Norske eventyr',
    'IT-boken',
    'Design klassikere',
    'Kokebok',
    'Tegneseriebiler',
    'Biografiboken'
  ],
  Sports: [
    'Bergklatringsutstyr',
    'Sykkelglasögon',
    'Treningssmartklokke',
    'Joggemaatte',
    'Hantler set',
    'Yogamatte',
    'Tennisracket',
    'Isskøyter'
  ]
}

const tradeWishes = [
  'Søker vinyl plates',
  'Bytte for gaming konsoll',
  'Søker vintage møbler',
  'Bytte for elektronikk',
  'Søker strikkverk',
  'Bytte for sykkel deler',
  'Søker fotografiutstyr',
  'Bytte for komisk bok'
]

// Main function
export async function seedDatabase() {
  try {
    console.log('🗑️ Sletter eksisterende test data...')
    await deleteAllData()

    console.log('📚 Oppretter kategorier og underkategorier...')
    const categories = await createCategories()

    console.log('👥 Oppretter brukere...')
    const users = await createUsers()

    console.log('🛍️ Oppretter produkter...')
    const products = await createProducts(users, categories)

    console.log('📋 Oppretter brukerlister...')
    await createUserLists(users, products)

    console.log('✅ Databasen er ferdig seeded!')
    return { users, categories, products }
  } catch (error) {
    console.error('❌ Feil ved seeding av database:', error)
    throw error
  }
}

// Delete all documents
async function deleteAllData() {
  const types = ['userList', 'product', 'user', 'subcategory', 'category']

  for (const type of types) {
    const query = `*[_type == "${type}"]._id`
    const ids = await client.fetch(query)

    for (const id of ids) {
      await client.delete(id)
    }
    console.log(`  ✓ Slettet alle ${type} dokumenter`)
  }
}

// Create categories and subcategories
async function createCategories() {
  const categoryNames = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports']
  const subcategoryNames = {
    Electronics: ['Computers', 'Mobile devices', 'Audio', 'Cables & Accessories'],
    Furniture: ['Living room', 'Bedroom', 'Kitchen', 'Office'],
    Clothing: ['Jackets', 'Dresses', 'Shoes', 'Sweaters'],
    Books: ['Fiction', 'Non-fiction', 'Comics', 'Textbooks'],
    Sports: ['Climbing', 'Cycling', 'Fitness', 'Winter sports']
  }

  const categories = {}

  for (const catName of categoryNames) {
    const category = await client.create({
      _type: 'category',
      title: catName
    })
    categories[catName] = category

    console.log(`  ✓ Opprettet kategori: ${catName}`)

    for (const subName of subcategoryNames[catName]) {
      await client.create({
        _type: 'subcategory',
        title: subName,
        category: {
          _type: 'reference',
          _ref: category._id
        }
      })
    }
  }

  return categories
}

// Create users
async function createUsers() {
  const users = []
  const availableFirstNames = shuffle(firstNames)

  for (let i = 0; i < 5; i++) {
    const firstName = availableFirstNames[i]
    const lastName = randomElement(lastNames)
    const city = randomElement(cities)

    const user = await client.create({
      _type: 'user',
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      password: 'TestPassword123!',
      streetAddress: `${randomRange(1, 200)} ${randomElement(['Gaten', 'Veien', 'Stien', 'Allèen'])}`,
      postalCode: `${randomRange(1000, 9999)}`,
      city
    })

    users.push(user)
    console.log(`  ✓ Opprettet bruker: ${firstName} ${lastName}`)
  }

  return users
}

// Create products
async function createProducts(users, categories) {
  const products = []
  const subcategoriesQuery = `*[_type == "subcategory"]{ _id, title, "categoryTitle": category->title }`
  const subcategories = await client.fetch(subcategoriesQuery)

  // Distribute 3-12 products per user
  const productsPerUser = users.map(() => randomRange(3, 12))
  const totalProducts = productsPerUser.reduce((a, b) => a + b, 0)

  let productCount = 0

  for (let userIdx = 0; userIdx < users.length; userIdx++) {
    const user = users[userIdx]
    const numProducts = productsPerUser[userIdx]

    for (let i = 0; i < numProducts; i++) {
      const subcategory = randomElement(subcategories)
      const categoryTitle = subcategory.categoryTitle
      const titles = productTitles[categoryTitle] || ['Produkt']
      const title = randomElement(titles)

      const isForSale = Math.random() > 0.4 // 60% for sale, 40% for trade
      const statuses = ['active', 'active', 'active', 'reserved', 'sold', 'archived']
      const status = randomElement(statuses)

      const product = await client.create({
        _type: 'product',
        title: `${title} #${productCount + 1}`,
        description: `En fin brukt ${title.toLowerCase()}. Tilstand: ${randomElement(['Som ny', 'God', 'Nokså god', 'OK'])}`,
        owner: {
          _type: 'reference',
          _ref: user._id
        },
        subcategory: {
          _type: 'reference',
          _ref: subcategory._id
        },
        status,
        listingType: isForSale ? 'sale' : 'trade',
        ...(isForSale && { price: `${randomRange(50, 2000)}` }),
        ...(!isForSale && { tradeWish: randomElement(tradeWishes) })
      })

      products.push(product)
      productCount++
    }

    console.log(`  ✓ Opprettet ${numProducts} produkter for ${user.firstName} ${user.lastName}`)
  }

  return products
}

// Create user lists
async function createUserLists(users, products) {
  for (const user of users) {
    // Get products owned by this user
    const userProducts = products.filter(
      p => p.owner._ref === user._id
    )

    // Get products owned by OTHER users
    const otherUserProducts = products.filter(
      p => p.owner._ref !== user._id
    )

    // Create 1-4 lists per user
    const numLists = randomRange(1, 4)

    for (let i = 0; i < numLists; i++) {
      // Each list has 2-7 products, but NO products from the user's own products
      const numProductsInList = randomRange(2, 7)
      const listProducts = shuffle(otherUserProducts).slice(0, numProductsInList)

      const list = await client.create({
        _type: 'userList',
        title: `${user.firstName}s ${randomElement(['favoritter', 'ønskelist', 'interessant', 'relevante', 'kuratert liste'])}`,
        isPublic: Math.random() > 0.3, // 70% public
        owner: {
          _type: 'reference',
          _ref: user._id
        },
        products: listProducts.map((p, idx) => ({
          _key: `product-${idx}`,
          _type: 'reference',
          _ref: p._id
        }))
      })

      console.log(`  ✓ Opprettet liste "${list.title}" for ${user.firstName} med ${listProducts.length} produkter`)
    }
  }
}

// Execute immediately when file is run directly
seedDatabase().catch(error => {
  console.error('Database seeding failed:', error)
  process.exit(1)
})

// Export the seedDatabase function to be called from React component
export default seedDatabase
