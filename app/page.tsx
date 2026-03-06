import { getProjects, getSiteSettings } from '../src/sanity/queries'
import { urlFor } from '../src/sanity/client'
import PortfolioClient from './PortfolioClient'

const defaultSettings = {
  heroSection: {
    profilePhoto: null,
    eyebrow: 'Diretor de Arte & Fotógrafo — Sergipe, Brasil',
    name: 'ISAÍAS',
    nameAccent: 'MELO',
    role: 'Publicidade & Propaganda · UFS · 7º Período',
    paragraph1: 'Olá, meu nome é Isaías Melo. Tenho 24 anos e estou no 7º período de Publicidade e Propaganda na Universidade Federal de Sergipe.',
    paragraph2: 'Sou apaixonado por arte, principalmente pela forma como ela se comunica com as pessoas. Atuo com construção de marca, criação de conteúdo para redes sociais e desenvolvimento de materiais impressos, sempre com foco em compreender o problema e transformá-lo em uma solução visual clara, objetiva e estratégica.',
    paragraph3: 'Além disso, sou fotógrafo, movido pela paixão de eternizar momentos importantes e sinceros. Ao longo dessa trajetória, trabalhei desde a criação de uma arte para um microempreendedor até projetos para empresas com mais de 300 colaboradores. Acredito que tudo o que é feito com amor prevalece.',
    ctaLabel: 'Ver meus trabalhos',
  },
  services: [
    { name: 'Identidade Visual', description: 'Criação de marca completa: logo, paleta, tipografia e manual de identidade visual para posicionar sua empresa com consistência e personalidade.' },
    { name: 'Design para Social Media', description: 'Criação de peças visuais para Instagram, Facebook e outras plataformas, com linguagem visual alinhada à identidade da sua marca.' },
    { name: 'Calendário Editorial', description: 'Planejamento estratégico de conteúdo com datas, pautas e formatos definidos para manter sua marca sempre presente e relevante.' },
    { name: 'Impressos e Mídia OOH', description: 'Desenvolvimento de materiais impressos e comunicação visual para o ambiente físico: banners, cartões, embalagens, adesivos, vestuário e muito mais.' },
    { name: 'Fotografia', description: 'Ensaios empresariais, institucionais, eventos e fotografia documental. Imagens que comunicam, engajam e eternizam momentos importantes.' },
  ],
  feedbackImages: [],
  contactSection: {
    email: 'isaiasmellomkt@gmail.com',
    whatsapp: '5579981149177',
    instagramUrl: 'https://www.instagram.com/mellorgb/',
    tiktokUrl: 'https://www.tiktok.com/@mellorgb',
    behanceUrl: 'https://www.behance.net/isaiasmello',
    linkedinUrl: 'https://www.linkedin.com/in/isaías-melo-52b8a53b3/',
  },
  seo: {
    siteTitle: 'Isaías Melo — Diretor de Arte & Fotógrafo',
    siteDescription: 'Portfólio de direção de arte e fotografia. Sergipe, Brasil.',
  },
}

function safeImageUrl(image: any, width = 800, height = 600): string | null {
  if (!image?.asset?._ref) return null
  try {
    return urlFor(image).width(width).height(height).auto('format').url()
  } catch {
    return null
  }
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
    if (fetchedSettings) settings = { ...defaultSettings, ...fetchedSettings, heroSection: { ...defaultSettings.heroSection, ...fetchedSettings.heroSection }, contactSection: { ...defaultSettings.contactSection, ...fetchedSettings.contactSection } }
  } catch (error) {
    console.error('Erro ao buscar dados do Sanity:', error)
  }

  const projectsWithImages = projects.map((p) => ({
    ...p,
    imageUrl: safeImageUrl(p.coverImage),
    images: Array.isArray(p.images)
      ? p.images.map((img: any) => safeImageUrl(img, 1200, 900)).filter(Boolean)
      : [],
  }))

  // Foto de perfil resolvida — usa /mello.jpeg como fallback
  const profilePhotoUrl = safeImageUrl(settings.heroSection?.profilePhoto, 1200, 1600) || '/mello.jpeg'

  // Feedbacks resolvidos — usa URL original do asset com dimensões reais
  const feedbackImages = Array.isArray(settings.feedbackImages)
    ? settings.feedbackImages
        .filter((img: any) => img?.asset?.url)
        .map((img: any) => ({
          url: img.asset.url as string,
          alt: img?.alt || '',
          width: img?.asset?.metadata?.dimensions?.width as number || 800,
          height: img?.asset?.metadata?.dimensions?.height as number || 600,
        }))
    : []

  const resolvedSettings = {
    ...settings,
    profilePhotoUrl,
    feedbackImages,
  }

  return <PortfolioClient projects={projectsWithImages} settings={resolvedSettings} />
}