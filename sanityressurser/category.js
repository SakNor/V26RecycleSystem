const category = {
  name: 'category',
  title: 'Kategori',
  type: 'document',
  fields: [
    { name: 'title', title: 'Navn', type: 'string', validation: r => r.required() }
  ]
}

export default category