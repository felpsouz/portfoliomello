import { getProjects, getSiteSettings } from '../src/sanity/queries'
import { urlFor } from '../src/sanity/client'
import PortfolioClient from './PortfolioClient'

const defaultSettings = {
  heroSection: {
    eyebrow: 'Fotógrafo & Designer — Brasil',
    titleLine1: 'IMAGENS',
    titleLine2: 'QUE',
    titleLine3: 'FALAM.',
    description: 'Fotografia e design com intenção. Crio imagens e identidades visuais que comunicam com força, clareza e personalidade — do retrato à marca.',
    statExperience: '10+',
    statProjects: '200+',
    statClients: '48',
  },
  aboutSection: {
    headingLine1: 'OLHO',
    headingLine2: 'TREINADO.',
    headingLine3: 'MÃO FIRME.',
    paragraph1: 'Há mais de uma década fotografo e crio identidades visuais para marcas, artistas e empresas que querem se comunicar com verdade.',
    paragraph2: 'Cada projeto é tratado como único: da direção de arte à entrega final, o processo é colaborativo, rigoroso e sempre orientado ao resultado.',
    establishedYear: '2014',
    skills: ['Fotografia', 'Direção de Arte', 'Identidade Visual', 'Tipografia', 'Editorial', 'Motion'],
  },
  services: [
    { name: 'Fotografia', description: 'Retratos, produtos, editorial e eventos. Cada imagem com composição, luz e narrativa pensadas do zero.' },
    { name: 'Identidade Visual', description: 'Criação de marcas completas: logotipo, tipografia, paleta e sistema visual.' },
    { name: 'Direção de Arte', description: 'Conceito e execução para campanhas, ensaios e publicações — do briefing ao arquivo final.' },
  ],
  contactSection: {
    email: 'oi@mello.com.br',
    instagramUrl: '',
    behanceUrl: '',
    linkedinUrl: '',
  },
  seo: {
    siteTitle: 'Mello — Fotógrafo & Designer',
    siteDescription: 'Portfólio de fotografia e design.',
  },
}

export default async function Home() {
  let projects: any[] = []
  let settings: any = defaultSettings

  try {
    const [fetchedProjects, fetchedSettings] = await Promise.all([
      getProjects(),
      getSiteSettings(),
    ])

    projects = fetchedProjects || []
    if (fetchedSettings) settings = fetchedSettings
  } catch (error) {
    console.error('Erro ao buscar dados do Sanity:', error)
  }

  const projectsWithImages = projects.map((p) => ({
    ...p,
    imageUrl: p.coverImage
      ? urlFor(p.coverImage).width(800).height(600).auto('format').url()
      : null,
  }))

  return <PortfolioClient projects={projectsWithImages} settings={settings} />
}