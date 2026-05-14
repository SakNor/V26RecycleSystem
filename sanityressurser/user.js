const user = {
  name: 'user',
  title: 'Bruker',
  type: 'document',
  fields: [
    { name: 'firstName', title: 'Fornavn', type: 'string', validation: r => r.required() },
    { name: 'lastName', title: 'Etternavn', type: 'string', validation: r => r.required() },
    { name: 'streetAddress', title: 'Gateadresse', type: 'string' },
    { name: 'postalCode', title: 'Postnummer', type: 'string' },
    { name: 'city', title: 'Poststed', type: 'string' },
    { name: 'email', title: 'E-post', type: 'string', validation: r => r.required().email() },
    { name: 'password', title: 'Passord', type: 'string', validation: r => r.required() }
  ]
}

export default user