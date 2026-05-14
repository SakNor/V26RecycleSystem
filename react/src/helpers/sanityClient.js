import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'vsetg2rf',
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
  token: "YOUR_API_TOKEN"
})

export default client