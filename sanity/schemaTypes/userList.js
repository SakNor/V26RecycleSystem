const userList = {
  name: 'userList',
  title: 'Brukerliste',
  type: 'document',
  fields: [
    { name: 'title', title: 'Listenavn', type: 'string', validation: r => r.required() },

    {
      name: 'isPublic',
      title: 'Offentlig liste',
      type: 'boolean',
      initialValue: true
    },

    {
      name: 'owner',
      title: 'Eier',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: r => r.required()
    },

    {
      name: 'products',
      title: 'Produkter',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }]
    }
  ]
}

export default userList