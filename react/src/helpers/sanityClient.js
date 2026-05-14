import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'vsetg2rf',
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
  token: "skHQa0PGikKBrJDbh4xpjibVMIM3rOaZoGU67IeJUjJDtkrbXX9c10VuQVufundGZJthbJqaZsa8KrJaGLFJObTKTUVF0NhxdLSI2QEtEswb5iIx52qVthUDOOjZowPWzxn0RAbOeIr6nAeNa57VMhdHgaRDZiGp3lPkc0ikHtDP9hKETTVJ"
})

export default client