const product = {
  name: 'product',
  title: 'Produkt',
  type: 'document',
  fields: [
    { name: 'title', title: 'Tittel', type: 'string', validation: r => r.required() },
    { name: 'description', title: 'Beskrivelse', type: 'text' },

    {
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: { hotspot: true }
    },

    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Aktiv', value: 'active' },
          { title: 'Reservert', value: 'reserved' },
          { title: 'Solgt', value: 'sold' },
          { title: 'Arkivert', value: 'archived' }
        ],
        layout: 'radio'
      },
      initialValue: 'active',
      validation: r => r.required()
    },

    {
      name: 'owner',
      title: 'Eier',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: r => r.required()
    },

    {
      name: 'subcategory',
      title: 'Underkategori',
      type: 'reference',
      to: [{ type: 'subcategory' }],
      validation: r => r.required()
    },

    {
      name: 'listingType',
      title: 'Salgs- eller byttetype',
      type: 'string',
      options: {
        list: [
          { title: 'Til salgs', value: 'sale' },
          { title: 'Til bytte', value: 'trade' }
        ],
        layout: 'radio'
      },
      validation: r => r.required()
    },

    {
      name: 'price',
      title: 'Pris',
      type: 'string',
      hidden: ({ parent }) => parent?.listingType !== 'sale'
    },

    {
      name: 'tradeWish',
      title: 'Ønskes byttet mot',
      type: 'text',
      hidden: ({ parent }) => parent?.listingType !== 'trade'
    }
  ]
}

export default product