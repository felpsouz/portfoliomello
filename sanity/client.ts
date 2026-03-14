import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Valida variáveis obrigatórias em tempo de inicialização
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID não está definido no .env.local')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  // Token só no servidor — nunca exposto ao cliente
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0])
}