const subcategory = {
  name: 'subcategory',
  title: 'Underkategori',
  type: 'document',
  fields: [
    { name: 'title', title: 'Navn', type: 'string', validation: r => r.required() },
    {
      name: 'category',
      title: 'Hovedkategori',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: r => r.required()
    }
  ]
}

export default subcategory