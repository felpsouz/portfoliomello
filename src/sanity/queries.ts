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
  order: number
  published: boolean
}

export type HeroSection = {
  eyebrow: string
  titleLine1: string
  titleLine2: string
  titleLine3: string
  description: string
  statExperience: string
  statProjects: string
  statClients: string
}

export type AboutSection = {
  headingLine1: string
  headingLine2: string
  headingLine3: string
  paragraph1: string
  paragraph2: string
  establishedYear: string
  skills: string[]
}

export type Service = {
  name: string
  description: string
}

export type ContactSection = {
  email: string
  instagramUrl?: string
  behanceUrl?: string
  linkedinUrl?: string
}

export type SiteSettings = {
  heroSection: HeroSection
  aboutSection: AboutSection
  services: Service[]
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
      asset,
      alt,
      hotspot
    },
    order
  }
`

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    heroSection,
    aboutSection,
    services,
    contactSection,
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