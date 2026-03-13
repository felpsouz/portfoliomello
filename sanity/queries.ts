import { client } from './client'
import { cache } from 'react'

export type SanityImage = {
  asset: { _ref: string }
  alt?: string
  hotspot?: { x: number; y: number }
}

export type Project = {
  _id: string
  title: string
  category: string
  year: string
  tags: string[]
  coverImage?: SanityImage
  images?: SanityImage[]
  order: number
  published: boolean
}

export type HeroSection = {
  profilePhoto?: SanityImage
  eyebrow: string
  name: string
  nameAccent: string
  role: string
  paragraph1: string
  paragraph2: string
  paragraph3: string
  ctaLabel: string
}

export type Service = {
  name: string
  description: string
}

export type FeedbackImage = {
  asset: { _ref: string }
  alt?: string
}

export type ContactSection = {
  email: string
  whatsapp?: string
  instagramUrl?: string
  tiktokUrl?: string
  behanceUrl?: string
  linkedinUrl?: string
}

export type SiteSettings = {
  heroSection: HeroSection
  services: Service[]
  feedbackImages?: FeedbackImage[]
  contactSection: ContactSection
  seo: {
    siteTitle: string
    siteDescription: string
  }
}

const PROJECTS_QUERY = `
  *[_type == "project" && published == true] | order(order asc) {
    _id,
    title,
    category,
    year,
    tags,
    coverImage {
      asset-> { url, metadata { dimensions { width, height } } },
      alt,
      hotspot
    },
    images[] {
      asset-> { url, metadata { dimensions { width, height } } },
      alt,
      hotspot
    },
    order
  }
`

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    heroSection {
      profilePhoto { asset, alt, hotspot },
      eyebrow,
      name,
      nameAccent,
      role,
      paragraph1,
      paragraph2,
      paragraph3,
      ctaLabel
    },
    services[] {
      name,
      description
    },
    feedbackImages[] {
      asset-> {
        _id,
        _ref,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    contactSection {
      email,
      whatsapp,
      instagramUrl,
      tiktokUrl,
      behanceUrl,
      linkedinUrl
    },
    seo
  }
`

export const getProjects = cache(async (): Promise<Project[]> => {
  return client.fetch(PROJECTS_QUERY, {}, {
    next: { revalidate: 60, tags: ['projects'] },
  })
})

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return client.fetch(SITE_SETTINGS_QUERY, {}, {
    next: { revalidate: 60, tags: ['siteSettings'] },
  })
})