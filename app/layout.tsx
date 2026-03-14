import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Isaías Melo — Diretor de Arte & Fotógrafo | Sergipe',
  description:
    'Portfólio de Isaías Melo, Diretor de Arte e Fotógrafo em Sergipe. Identidade visual, social media, fotografia e impressos para marcas que querem se destacar.',
  keywords: [
    'diretor de arte',
    'fotógrafo sergipe',
    'identidade visual',
    'social media',
    'design gráfico',
    'Isaías Melo',
    'portfólio',
  ],
  authors: [{ name: 'Isaías Melo' }],
  creator: 'Isaías Melo',
  openGraph: {
    title: 'Isaías Melo — Diretor de Arte & Fotógrafo',
    description:
      'Construção de marca, criação de conteúdo para redes sociais e fotografia em Sergipe.',
    url: 'https://portfoliomello.vercel.app',
    siteName: 'Isaías Melo',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isaías Melo — Diretor de Arte & Fotógrafo',
    description: 'Construção de marca, social media e fotografia em Sergipe.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}