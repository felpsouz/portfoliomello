"use client";

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type ProjectWithImage = {
  _id: string
  title: string
  category: string
  year: string
  tags: string[]
  imageUrl: string | null
  imageWidth?: number
  imageHeight?: number
  images?: { url: string; width: number; height: number }[]
}

// Settings resolvido vindo do page.tsx
type ResolvedSettings = {
  profilePhotoUrl: string | null
  heroSection: {
    eyebrow: string
    name: string
    nameAccent: string
    role: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    ctaLabel: string
  }
  services: { name: string; description: string }[]
  feedbackImages: { url: string; alt?: string; width: number; height: number }[]
  contactSection: {
    email: string
    whatsapp?: string
    instagramUrl?: string
    tiktokUrl?: string
    behanceUrl?: string
    linkedinUrl?: string
  }
}

type Props = {
  projects: ProjectWithImage[]
  settings: ResolvedSettings
}

function GrainOverlay() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 999, opacity: 0.035 }} xmlns="http://www.w3.org/2000/svg">
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

const PROJECTS: ProjectWithImage[] = []

const DEFAULT_SERVICES: { name: string; description: string }[] = []

export default function PortfolioClient({ projects: _projects, settings }: Props) {
  const projects = _projects?.length ? _projects : PROJECTS

  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [lightbox, setLightbox] = useState<{
    images: { url: string; title: string; category: string; year: string; tags: string[]; width?: number; height?: number }[]
    index: number
  } | null>(null)
  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '' })
  const [formSent, setFormSent] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  const hero = settings?.heroSection
  const contact = settings?.contactSection
  const activeServices = settings?.services?.length ? settings.services : DEFAULT_SERVICES
  const feedbackImages = settings?.feedbackImages || []
  const profilePhotoUrl = settings?.profilePhotoUrl || '/mello.jpeg'

  const whatsappUrl = contact?.whatsapp
    ? `https://wa.me/${contact.whatsapp}`
    : 'https://wa.me/5579981149177'

  // Abre lightbox com capa + todas as fotos da galeria
  const openProjectLightbox = (project: ProjectWithImage) => {
    const imgs: { url: string; title: string; category: string; year: string; tags: string[]; width?: number; height?: number }[] = []

    // Capa sempre primeira
    if (project.imageUrl) {
      imgs.push({
        url: project.imageUrl,
        title: project.title,
        category: project.category,
        year: project.year,
        tags: project.tags,
        width: project.imageWidth,
        height: project.imageHeight,
      })
    }

    // Galeria em seguida (sem repetir a capa)
    if (project.images && project.images.length > 0) {
      project.images.forEach((img, i) => {
        imgs.push({
          url: img.url,
          title: `${project.title} — ${i + 1}/${project.images!.length}`,
          category: project.category,
          year: project.year,
          tags: project.tags,
          width: img.width,
          height: img.height,
        })
      })
    }

    if (imgs.length === 0) return
    setLightbox({ images: imgs, index: 0 })
    document.body.style.overflow = 'hidden'
  }

  const openFeedbackLightbox = (index: number) => {
    if (!feedbackImages.length) return
    setLightbox({
      images: feedbackImages.map((img, i) => ({
        url: img.url,
        title: img.alt || `Feedback ${i + 1}`,
        category: '',
        year: '',
        tags: [],
        width: img.width,
        height: img.height,
      })),
      index,
    })
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightbox(null)
    document.body.style.overflow = ''
  }

  const prevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length })
  }

  const nextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
    setFormData({ nome: '', telefone: '', email: '' })
  }

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextLightbox()
      if (e.key === 'ArrowLeft') prevLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const navSolid = scrollY > 80
  const activeImg = lightbox ? lightbox.images[lightbox.index] : null
  const categories = Array.from(new Set(projects.map(p => p.category)))

  return (
    <>
      <GrainOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:ital,wght@0,200;0,400;0,700;0,900;1,200;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #171717;
          --surface: #141414;
          --border: #2a2a2a;
          --text: #f0ede6;
          --muted: #555;
          --accent: #FEFCED;
          --accent2: #FFD600;
          --font-display: 'Bebas Neue', sans-serif;
          --font-body: 'Epilogue', sans-serif;
        }

        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-weight: 200; overflow-x: hidden; cursor: crosshair; max-width: 100vw; }
        ::selection { background: var(--accent); color: #fff; }

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 24px 48px; transition: background 0.3s, padding 0.3s, border-color 0.3s; border-bottom: 1px solid transparent; }
        .nav.solid { background: rgba(13,13,13,0.92); backdrop-filter: blur(16px); padding: 16px 48px; border-color: var(--border); }
        .nav-logo { font-family: var(--font-display); font-size: 22px; letter-spacing: 0.08em; color: var(--text); text-decoration: none; }
        .nav-logo span { color: var(--accent); }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--accent); }
        .nav-cta { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--bg); background: var(--accent); text-decoration: none; padding: 10px 20px; transition: background 0.2s, transform 0.2s; }
        .nav-cta:hover { background: var(--accent2); color: var(--bg); transform: translate(-2px,-2px); }

        /* HERO */
        .about-hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; position: relative; border-bottom: 1px solid var(--border); }
        .about-hero-photo { position: relative; overflow: hidden; background: var(--surface); }
        .about-hero-photo-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
        .photo-placeholder-circle { width: 120px; height: 120px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; }
        .photo-placeholder-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
        .about-hero-photo-overlay { position: absolute; inset: 0; background: linear-gradient(to right, transparent 60%, var(--bg) 100%); z-index: 1; }
        .about-hero-content { display: flex; flex-direction: column; justify-content: center; padding: 120px 64px 80px; position: relative; z-index: 2; }
        .about-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 32px; opacity: 0; transform: translateX(-20px); transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s; }
        .about-hero-eyebrow.in { opacity: 1; transform: translateX(0); }
        .about-hero-eyebrow-line { width: 32px; height: 2px; background: var(--accent); flex-shrink: 0; }
        .about-hero-name { font-family: var(--font-display); font-size: clamp(52px, 6vw, 88px); line-height: 0.9; letter-spacing: 0.02em; margin-bottom: 8px; }
        .about-hero-name .accent { color: var(--accent); }
        .about-hero-role { font-size: 13px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 40px; }
        .about-hero-text { max-width: 480px; font-size: 15px; font-weight: 200; line-height: 1.9; color: #888; margin-bottom: 16px; opacity: 0; transition: opacity 0.9s ease 0.5s; }
        .about-hero-text.in { opacity: 1; }
        .about-hero-divider { width: 48px; height: 2px; background: var(--accent); margin: 32px 0; }
        .about-hero-cta { display: inline-flex; align-items: center; gap: 12px; background: transparent; border: 1px solid var(--accent); color: var(--accent); font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 14px 28px; margin-top: 16px; opacity: 0; transition: opacity 0.9s ease 0.8s, background 0.2s, color 0.2s, transform 0.2s; cursor: pointer; }
        .about-hero-cta.in { opacity: 1; }
        .about-hero-cta:hover { background: var(--accent); color: var(--bg); transform: translate(-2px, -2px); }
        .about-hero-accent-block { position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent); z-index: 3; }

        /* TICKER */
        .ticker { overflow: hidden; width: 100%; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--accent); }
        .ticker-track { display: flex; animation: ticker 20s linear infinite; white-space: nowrap; }
        .ticker-item { display: flex; align-items: center; gap: 24px; padding: 14px 32px; font-family: var(--font-display); font-size: 16px; letter-spacing: 0.1em; color: var(--bg); flex-shrink: 0; }
        .ticker-sep { opacity: 0.4; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* WORK */
        .work-section { padding: 120px 48px; }
        .work-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 80px; }
        .work-label { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
        .work-title { font-family: var(--font-display); font-size: clamp(56px, 7vw, 96px); line-height: 0.9; letter-spacing: 0.04em; }
        .work-title-alt { color: transparent; -webkit-text-stroke: 1px var(--text); }
        .work-count { font-family: var(--font-display); font-size: 14px; letter-spacing: 0.1em; color: var(--muted); padding-bottom: 12px; }
        .category-block { margin-bottom: 64px; }
        .category-label { font-size: 10px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); padding: 16px 0; border-top: 2px solid var(--accent); display: flex; align-items: center; gap: 12px; }
        .category-label-line { flex: 1; height: 1px; background: var(--border); }
        .project-list { display: flex; flex-direction: column; width: 100%; }
        .project-row { display: grid; grid-template-columns: 64px 1fr auto auto; align-items: center; gap: 16px; padding: 24px 0; border-bottom: 1px solid var(--border); cursor: pointer; position: relative; overflow: hidden; transition: padding 0.3s ease; min-width: 0; }
        .project-row::before { content: ''; position: absolute; inset: 0; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); z-index: 0; }
        .project-row:hover::before { transform: scaleX(1); }
        .project-row:hover { padding-left: 24px; }
        .project-row:hover .project-row-num, .project-row:hover .project-row-title, .project-row:hover .project-row-cat { color: var(--bg) !important; }
        .project-row:hover .project-row-tags span { background: rgba(0,0,0,0.2); color: var(--bg); border-color: transparent; }
        .project-row-num { font-family: var(--font-display); font-size: 13px; letter-spacing: 0.1em; color: var(--muted); position: relative; z-index: 1; transition: color 0.2s; }
        .project-row-title { font-family: var(--font-display); font-size: clamp(18px, 2.8vw, 38px); letter-spacing: 0.04em; color: var(--text); position: relative; z-index: 1; transition: color 0.2s; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .project-row-cat { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); position: relative; z-index: 1; transition: color 0.2s; white-space: nowrap; }
        .project-row-tags { display: flex; gap: 6px; position: relative; z-index: 1; }
        .project-row-tags span { font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 8px; border: 1px solid var(--border); color: var(--muted); white-space: nowrap; transition: all 0.2s; }
        .no-image-row { cursor: default; }
        .no-image-row::before { display: none; }
        .no-image-row:hover { padding-left: 0; }
        .no-image-row:hover .project-row-num, .no-image-row:hover .project-row-title, .no-image-row:hover .project-row-cat { color: inherit !important; }
        .no-image-row:hover .project-row-tags span { background: transparent !important; color: var(--muted) !important; border-color: var(--border) !important; }

        /* LIGHTBOX */
        .lightbox-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.97); display: flex; flex-direction: column; animation: lbIn 0.3s ease; }
        @keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
        .lightbox-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #1a1a1a; flex-shrink: 0; }
        .lightbox-info { display: flex; flex-direction: column; gap: 4px; }
        .lightbox-title { font-family: var(--font-display); font-size: clamp(18px, 3vw, 28px); letter-spacing: 0.06em; color: var(--text); }
        .lightbox-meta { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
        .lightbox-meta span { color: var(--accent); margin-right: 12px; }
        .lightbox-controls { display: flex; align-items: center; gap: 8px; }
        .lightbox-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: transparent; color: var(--text); font-size: 18px; cursor: pointer; transition: background 0.2s, border-color 0.2s, color 0.2s; font-family: var(--font-display); }
        .lightbox-btn:hover { background: var(--accent); border-color: var(--accent); color: #000; }
        .lightbox-close { font-size: 22px; }
        .lightbox-counter { font-family: var(--font-display); font-size: 13px; letter-spacing: 0.1em; color: var(--muted); padding: 0 16px; }

        /* Lightbox image — scroll vertical, sem corte */
        .lightbox-image-wrap {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 32px 80px;
        }
        .lightbox-image-wrap img {
          max-width: 100%;
          height: auto !important;
          width: auto !important;
          max-height: none !important;
          display: block;
          object-fit: unset !important;
        }

        .lightbox-arrow { position: fixed; top: 50%; transform: translateY(-50%); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: rgba(13,13,13,0.85); color: var(--text); font-size: 20px; cursor: pointer; transition: background 0.2s, border-color 0.2s; z-index: 1001; backdrop-filter: blur(8px); }
        .lightbox-arrow:hover { background: var(--accent); border-color: var(--accent); color: #000; }
        .lightbox-arrow.left { left: 16px; }
        .lightbox-arrow.right { right: 16px; }
        .lightbox-tags { display: flex; gap: 8px; flex-wrap: wrap; padding: 16px 32px; border-top: 1px solid #1a1a1a; flex-shrink: 0; }
        .lightbox-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--border); color: var(--muted); }

        /* FEEDBACKS — masonry, sem corte, com espaçamento */
        .feedbacks-section { padding: 120px 48px; border-top: 1px solid var(--border); background: var(--surface); }
        .feedbacks-grid {
          columns: 3;
          column-gap: 16px;
          margin-top: 80px;
        }
        .feedback-img-item {
          break-inside: avoid;
          margin-bottom: 16px;
          position: relative;
          background: var(--surface);
          overflow: hidden;
          cursor: pointer;
          transition: background 0.3s;
          display: block;
        }
        .feedback-img-item:hover .feedback-bar { width: 100%; }
        .feedback-img-item:hover .feedback-img-inner img { transform: scale(1.02); }
        .feedback-bar { position: absolute; top: 0; left: 0; height: 3px; width: 0; background: var(--accent); transition: width 0.5s cubic-bezier(0.16,1,0.3,1); z-index: 3; }
        .feedback-img-inner { position: relative; width: 100%; background: #0a0a0a; }
        .feedback-img-inner img { width: 100% !important; height: auto !important; position: relative !important; display: block; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .feedback-img-overlay { position: absolute; inset: 0; background: rgba(254,252,237,0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; z-index: 2; }
        .feedback-img-item:hover .feedback-img-overlay { opacity: 1; }
        .feedback-img-icon { font-family: var(--font-display); font-size: 36px; color: #fff; letter-spacing: 0.05em; }
        .feedback-img-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; width: 100%; aspect-ratio: 4/3; border: 1px dashed var(--border); }
        .feedback-img-placeholder-num { font-family: var(--font-display); font-size: 56px; color: var(--border); line-height: 1; }
        .feedback-img-placeholder-label { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }

        /* FORM */
        .form-section { padding: 120px 48px; border-top: 1px solid var(--border); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 80px; align-items: start; }
        .form-left-title { font-family: var(--font-display); font-size: clamp(40px, 5vw, 72px); line-height: 0.9; letter-spacing: 0.03em; margin-bottom: 24px; }
        .form-left-title .inv { color: transparent; -webkit-text-stroke: 1px var(--text); }
        .form-left-desc { font-size: 14px; font-weight: 200; line-height: 1.9; color: #666; max-width: 400px; }
        .form-right { display: flex; flex-direction: column; gap: 0; }
        .form-field { display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid var(--border); padding: 24px 0; }
        .form-field:first-child { border-top: 1px solid var(--border); }
        .form-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
        .form-input { background: transparent; border: none; outline: none; color: var(--text); font-family: var(--font-body); font-size: 16px; font-weight: 200; padding: 8px 0; width: 100%; }
        .form-input::placeholder { color: var(--muted); }
        .form-submit { margin-top: 32px; display: inline-flex; align-items: center; gap: 16px; background: var(--accent); color: var(--bg); font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; padding: 20px 48px; transition: background 0.2s, transform 0.2s, gap 0.2s; cursor: pointer; border: none; width: 100%; justify-content: center; }
        .form-submit:hover { background: var(--accent2); transform: translate(-4px,-4px); gap: 24px; }
        .form-success { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; border: 1px solid var(--accent); text-align: center; gap: 16px; }
        .form-success-icon { font-family: var(--font-display); font-size: 64px; color: var(--accent); line-height: 1; }
        .form-success-title { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.06em; }
        .form-success-text { font-size: 14px; font-weight: 200; color: #666; line-height: 1.8; }

        /* CONTACT */
        .contact-section { padding: 120px 48px; border-top: 1px solid var(--border); position: relative; overflow: hidden; width: 100%; }
        .contact-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: var(--font-display); font-size: clamp(80px, 18vw, 280px); letter-spacing: 0.1em; color: transparent; -webkit-text-stroke: 1px var(--border); white-space: nowrap; pointer-events: none; user-select: none; width: max-content; }
        .contact-inner { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; text-align: center; }
        .contact-label { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 32px; display: block; }
        .contact-heading { font-family: var(--font-display); font-size: clamp(64px, 10vw, 160px); line-height: 0.88; letter-spacing: 0.04em; margin-bottom: 48px; }
        .contact-heading .inv { color: transparent; -webkit-text-stroke: 2px var(--text); }
        .contact-email { font-family: var(--font-display); font-size: clamp(20px, 2.5vw, 32px); letter-spacing: 0.1em; color: var(--text); text-decoration: none; display: block; margin-bottom: 56px; transition: color 0.2s; }
        .contact-email:hover { color: var(--accent); }
        .contact-btn { display: inline-flex; align-items: center; gap: 16px; background: var(--accent); color: var(--bg); font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 20px 48px; transition: background 0.2s, transform 0.2s, gap 0.2s; }
        .contact-btn:hover { background: var(--accent2); transform: translate(-4px,-4px); gap: 24px; }

        /* FOOTER */
        footer { border-top: 1px solid var(--border); padding: 40px 48px; display: flex; justify-content: space-between; align-items: center; background: var(--surface); flex-wrap: wrap; gap: 24px; }
        .footer-logo { font-family: var(--font-display); font-size: 20px; letter-spacing: 0.08em; color: var(--text); text-decoration: none; }
        .footer-logo span { color: var(--accent); }
        .footer-copy { font-size: 11px; font-weight: 400; letter-spacing: 0.1em; color: var(--muted); }
        .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .footer-links a { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; padding: 6px 12px; border: 1px solid var(--border); }
        .footer-links a:hover { color: var(--accent); border-color: var(--accent); }

        /* SERVICES */
        .services-section { padding: 120px 48px; border-top: 1px solid var(--border); background: var(--surface); }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1px; background: var(--border); margin-top: 80px; }
        .service-card { background: var(--surface); padding: 48px 40px; position: relative; overflow: hidden; transition: background 0.3s; }
        .service-card:hover { background: var(--bg); }
        .service-card:hover .service-num { color: var(--accent); }
        .service-card:hover .service-bar { width: 100%; }
        .service-bar { position: absolute; bottom: 0; left: 0; height: 2px; width: 0; background: var(--accent); transition: width 0.5s cubic-bezier(0.16,1,0.3,1); }
        .service-num { font-family: var(--font-display); font-size: 64px; line-height: 1; color: var(--border); margin-bottom: 32px; transition: color 0.3s; }
        .service-name { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.04em; margin-bottom: 16px; }
        .service-desc { font-size: 13px; font-weight: 200; line-height: 1.8; color: #666; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .nav { padding: 20px 24px; }
          .nav.solid { padding: 14px 24px; }
          .nav-links, .nav-cta { display: none; }
          .about-hero { grid-template-columns: 1fr; grid-template-rows: 60vw 1fr; min-height: auto; }
          .about-hero-photo { display: block; height: 60vw; position: relative; }
          .about-hero-photo-overlay { background: linear-gradient(to bottom, transparent 50%, var(--bg) 100%); }
          .about-hero-accent-block { width: 100%; height: 4px; top: 0; left: 0; bottom: auto; }
          .about-hero-content { padding: 32px 24px 80px; min-height: auto; }
          .work-section { padding: 80px 24px; }
          .work-header { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 48px; }
          .project-row { grid-template-columns: 48px 1fr; gap: 12px; padding: 18px 0; }
          .project-row-cat, .project-row-tags { display: none; }
          .project-row-title { font-size: clamp(18px, 4.5vw, 28px); white-space: normal; }
          .feedbacks-section { padding: 80px 24px; }
          .feedbacks-grid { columns: 2; column-gap: 12px; }
          .feedback-img-item { margin-bottom: 12px; }
          .form-section { padding: 80px 24px; }
          .form-grid { grid-template-columns: 1fr; gap: 40px; }
          .services-section { padding: 80px 24px; }
          .services-grid { grid-template-columns: 1fr; }
          .contact-section { padding: 80px 24px; }
          .contact-heading { font-size: clamp(56px, 14vw, 100px); }
          .contact-btn { padding: 16px 32px; width: 100%; justify-content: center; }
          footer { padding: 32px 24px; flex-direction: column; align-items: flex-start; }
          .lightbox-image-wrap { padding: 20px 56px; }
          .lightbox-arrow { width: 44px; height: 44px; }
          .lightbox-arrow.left { left: 4px; }
          .lightbox-arrow.right { right: 4px; }
          .lightbox-header { padding: 14px 16px; }
          .lightbox-tags { padding: 12px 16px; }
          .lightbox-counter { padding: 0 8px; }
        }

        @media (max-width: 480px) {
          .about-hero-name { font-size: clamp(44px, 12vw, 64px); }
          .work-title { font-size: clamp(48px, 12vw, 72px); }
          .contact-heading { font-size: clamp(48px, 13vw, 80px); }
          .contact-email { font-size: clamp(16px, 4.5vw, 24px); word-break: break-all; }
          .form-left-title { font-size: clamp(36px, 10vw, 56px); }
          .feedbacks-grid { columns: 1; }
          .lightbox-image-wrap { padding: 16px 48px; }
        }
      `}</style>

      {/* LIGHTBOX */}
      {lightbox !== null && activeImg && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
            if (Math.abs(dx) > 50 && dy < 80) { if (dx < 0) nextLightbox(); else prevLightbox() }
          }}
        >
          <div className="lightbox-header" onClick={e => e.stopPropagation()}>
            <div className="lightbox-info">
              <span className="lightbox-title">{activeImg.title}</span>
              {activeImg.category && (
                <span className="lightbox-meta"><span>{activeImg.category}</span>{activeImg.year}</span>
              )}
            </div>
            <div className="lightbox-controls">
              {lightbox.images.length > 1 && (
                <>
                  <button className="lightbox-btn" onClick={prevLightbox}>←</button>
                  <span className="lightbox-counter">{lightbox.index + 1} / {lightbox.images.length}</span>
                  <button className="lightbox-btn" onClick={nextLightbox}>→</button>
                </>
              )}
              <button className="lightbox-btn lightbox-close" onClick={closeLightbox}>✕</button>
            </div>
          </div>

          {/* Imagem em tamanho original, sem corte, com scroll se necessário */}
          <div className="lightbox-image-wrap" onClick={e => e.stopPropagation()}>
            <Image
              src={activeImg.url}
              alt={activeImg.title}
              width={activeImg.width || 1200}
              height={activeImg.height || 900}
              style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
              sizes="100vw"
              priority
            />
          </div>

          {lightbox.images.length > 1 && (
            <>
              <button className="lightbox-arrow left" onClick={prevLightbox}>←</button>
              <button className="lightbox-arrow right" onClick={nextLightbox}>→</button>
            </>
          )}

          {activeImg.tags && activeImg.tags.length > 0 && (
            <div className="lightbox-tags" onClick={e => e.stopPropagation()}>
              {activeImg.tags.map(t => <span key={t} className="lightbox-tag">{t}</span>)}
            </div>
          )}
        </div>
      )}

      {/* NAV */}
      <nav className={`nav ${navSolid ? 'solid' : ''}`}>
        <a href="#" className="nav-logo">
          {hero?.name || 'ISAÍAS'} <span>{hero?.nameAccent || 'MELO'}</span>
        </a>
        <ul className="nav-links">
          <li><a href="#trabalhos">Trabalhos</a></li>
          <li><a href="#feedbacks">Feedbacks</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <a href="#formulario" className="nav-cta">Fale comigo</a>
      </nav>

      {/* APRESENTAÇÃO */}
      <section className="about-hero" id="sobre">
        <div className="about-hero-photo">
          <div className="about-hero-photo-placeholder">
            <div className="photo-placeholder-circle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="photo-placeholder-label">Foto de perfil</span>
          </div>
          <Image
            src={profilePhotoUrl}
            alt={hero?.name ? `${hero.name} ${hero.nameAccent}` : 'Isaías Melo'}
            fill
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div className="about-hero-photo-overlay" />
          <div className="about-hero-accent-block" />
        </div>

        <div className="about-hero-content">
          <p className={`about-hero-eyebrow ${loaded ? 'in' : ''}`}>
            <span className="about-hero-eyebrow-line" />
            {hero?.eyebrow || 'Diretor de Arte & Fotógrafo — Sergipe, Brasil'}
          </p>
          <h1 className="about-hero-name">
            {hero?.name || 'ISAÍAS'}<br />
            <span className="accent">{hero?.nameAccent || 'MELO'}</span>
          </h1>
          <p className="about-hero-role">{hero?.role || 'Publicidade & Propaganda · UFS · 7º Período'}</p>
          <p className={`about-hero-text ${loaded ? 'in' : ''}`}>
            {hero?.paragraph1 || 'Olá, meu nome é Isaías Melo. Tenho 24 anos e estou no 7º período de Publicidade e Propaganda na Universidade Federal de Sergipe.'}
          </p>
          <p className={`about-hero-text ${loaded ? 'in' : ''}`} style={{ transitionDelay: '0.65s' }}>
            {hero?.paragraph2 || 'Sou apaixonado por arte, principalmente pela forma como ela se comunica com as pessoas. Atuo com construção de marca, criação de conteúdo para redes sociais e desenvolvimento de materiais impressos, sempre com foco em compreender o problema e transformá-lo em uma solução visual clara, objetiva e estratégica.'}
          </p>
          <p className={`about-hero-text ${loaded ? 'in' : ''}`} style={{ transitionDelay: '0.8s' }}>
            {hero?.paragraph3 || 'Além disso, sou fotógrafo, movido pela paixão de eternizar momentos importantes e sinceros. Ao longo dessa trajetória, trabalhei desde a criação de uma arte para um microempreendedor até projetos para empresas com mais de 300 colaboradores. Acredito que tudo o que é feito com amor prevalece.'}
          </p>
          <div className="about-hero-divider" />
          <a href="#trabalhos" className={`about-hero-cta ${loaded ? 'in' : ''}`}>
            {hero?.ctaLabel || 'Ver meus trabalhos'} <span>↓</span>
          </a>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="ticker-item">
              Direção de Arte <span className="ticker-sep">✦</span>
              Fotografia <span className="ticker-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* WORK */}
      <section className="work-section" id="trabalhos">
        <div className="work-header">
          <div>
            <p className="work-label">Portfólio Selecionado</p>
            <h2 className="work-title">TRABA<br /><span className="work-title-alt">LHOS</span></h2>
          </div>
          <span className="work-count">{String(projects.length).padStart(2, '0')} PROJETOS</span>
        </div>

        {categories.map(cat => {
          const catProjects = projects.filter(p => p.category === cat)
          return (
            <div key={cat} className="category-block">
              <div className="category-label">
                {cat}
                <span className="category-label-line" />
                <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-display)', fontSize: 13 }}>{String(catProjects.length).padStart(2, '0')}</span>
              </div>
              <div className="project-list">
                {catProjects.map((p, i) => {
                  const hasMedia = !!(p.imageUrl || (p.images && p.images.length > 0))
                  const previewUrl = p.imageUrl || (p.images && p.images[0]?.url) || null
                  const photoCount = p.images?.length || (p.imageUrl ? 1 : 0)
                  return (
                    <div
                      key={p._id}
                      className={`project-row ${!hasMedia ? 'no-image-row' : ''}`}
                      onClick={() => hasMedia && openProjectLightbox(p)}
                      onMouseEnter={() => setHovered(p._id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span className="project-row-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="project-row-title">{p.title}</span>
                      <span className="project-row-cat">
                        {p.category}
                        {photoCount > 1 && (
                          <span style={{ marginLeft: 8, fontSize: 9, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
                            {photoCount} FOTOS
                          </span>
                        )}
                      </span>
                      <div className="project-row-tags">{p.tags?.map(t => <span key={t}>{t}</span>)}</div>
                      {previewUrl && (
                        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 160, opacity: hovered === p._id ? 1 : 0, transition: 'opacity 0.3s', zIndex: 2, pointerEvents: 'none' }}>
                          <img src={previewUrl} alt={p.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      {/* FEEDBACKS */}
      <section className="feedbacks-section" id="feedbacks">
        <p className="work-label">O que dizem sobre mim</p>
        <h2 className="work-title" style={{ marginTop: 8 }}>FEED<span className="work-title-alt">BACKS</span></h2>
        <div className="feedbacks-grid">
          {feedbackImages.length > 0
            ? feedbackImages.map((img, i) => (
                <div key={i} className="feedback-img-item" onClick={() => openFeedbackLightbox(i)}>
                  <div className="feedback-bar" />
                  <div className="feedback-img-inner">
                    <Image
                      src={img.url}
                      alt={img.alt || `Feedback ${i + 1}`}
                      width={img.width || 800}
                      height={img.height || 600}
                      style={{ width: '100%', height: 'auto' }}
                      sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 33vw"
                    />
                    <div className="feedback-img-overlay">
                      <span className="feedback-img-icon">+</span>
                    </div>
                  </div>
                </div>
              ))
            : [1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="feedback-img-item">
                  <div className="feedback-bar" />
                  <div className="feedback-img-placeholder">
                    <span className="feedback-img-placeholder-num">{String(n).padStart(2, '0')}</span>
                    <span className="feedback-img-placeholder-label">Imagem em breve</span>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section" id="servicos">
        <p className="work-label">O que eu faço</p>
        <h2 className="work-title" style={{ marginTop: 8 }}>SERVI<span className="work-title-alt">ÇOS</span></h2>
        <div className="services-grid">
          {activeServices.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="service-name">{s.name}</h3>
              <p className="service-desc">{s.description}</p>
              <div className="service-bar" />
            </div>
          ))}
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="form-section" id="formulario">
        <p className="work-label">Deixe seu contato</p>
        <div className="form-grid">
          <div>
            <h2 className="form-left-title">
              VAMOS<br /><span className="inv">CRIAR</span><br />JUNTOS?
            </h2>
            <p className="form-left-desc">
              Preencha o formulário ao lado com seu nome, telefone e e-mail. Entrarei em contato para entender o seu projeto e apresentar a melhor solução para a sua marca.
            </p>
          </div>
          <div className="form-right">
            {formSent ? (
              <div className="form-success">
                <span className="form-success-icon">✓</span>
                <h3 className="form-success-title">MENSAGEM RECEBIDA</h3>
                <p className="form-success-text">Obrigado pelo contato! Em breve entrarei em contato com você.</p>
              </div>
            ) : (
              <>
                <div className="form-field">
                  <label className="form-label">Nome completo</label>
                  <input className="form-input" type="text" placeholder="Seu nome" value={formData.nome} onChange={e => setFormData(f => ({ ...f, nome: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">Telefone / WhatsApp</label>
                  <input className="form-input" type="tel" placeholder="(79) 9 0000-0000" value={formData.telefone} onChange={e => setFormData(f => ({ ...f, telefone: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">E-mail</label>
                  <input className="form-input" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                </div>
                <button className="form-submit" onClick={handleFormSubmit}>
                  Enviar <span>→</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contato">
        <div className="contact-inner">
          <span className="contact-label">Vamos trabalhar juntos</span>
          <a href={`mailto:${contact?.email || 'isaiasmellomkt@gmail.com'}`} className="contact-email">
            {contact?.email || 'isaiasmellomkt@gmail.com'}
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-btn">
            Enviar mensagem no WhatsApp <span>→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="#" className="footer-logo">
          {hero?.name || 'ISAÍAS'} <span>{hero?.nameAccent || 'MELO'}</span>
        </a>
        <span className="footer-copy">© {new Date().getFullYear()} — Todos os direitos reservados</span>
        <div className="footer-links">
          {contact?.instagramUrl && <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {contact?.tiktokUrl && <a href={contact.tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok</a>}
          {contact?.behanceUrl && <a href={contact.behanceUrl} target="_blank" rel="noopener noreferrer">Behance</a>}
          {contact?.linkedinUrl && <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
        </div>
      </footer>
    </>
  )
}