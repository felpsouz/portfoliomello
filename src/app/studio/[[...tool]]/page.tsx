/**
 * Rota do painel Sanity Studio
 * Acessível em: seusite.com/studio
 * Apenas você e o cliente terão acesso (login obrigatório)
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}