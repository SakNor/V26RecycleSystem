import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
  token: "YOUR_API_TOKEN"
})

export default client