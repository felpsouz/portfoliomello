"use client";

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { SiteSettings } from '../src/sanity/queries'

type ProjectWithImage = {
  _id: string
  title: string
  category: string
  year: string
  tags: string[]
  imageUrl: string | null
}

type Props = {
  projects: ProjectWithImage[]
  settings: SiteSettings
}

function GrainOverlay() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 999, opacity: 0.035 }} xmlns="http://www.w3.org/2000/svg">
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

export default function PortfolioClient({ projects, settings }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  const { heroSection: hero, aboutSection: about, services, contactSection: contact } = settings

  const openLightbox = (index: number) => {
    if (!projects[index]?.imageUrl) return
    setLightbox(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightbox(null)
    document.body.style.overflow = ''
  }

  const prevProject = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (lightbox === null) return
    for (let i = lightbox - 1; i >= 0; i--) {
      if (projects[i].imageUrl) { setLightbox(i); return }
    }
    for (let i = projects.length - 1; i > lightbox; i--) {
      if (projects[i].imageUrl) { setLightbox(i); return }
    }
  }

  const nextProject = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (lightbox === null) return
    for (let i = lightbox + 1; i < projects.length; i++) {
      if (projects[i].imageUrl) { setLightbox(i); return }
    }
    for (let i = 0; i < lightbox; i++) {
      if (projects[i].imageUrl) { setLightbox(i); return }
    }
  }

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextProject()
      if (e.key === 'ArrowLeft') prevProject()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const navSolid = scrollY > 80
  const activeProjeto = lightbox !== null ? projects[lightbox] : null
  const totalComImagem = projects.filter(p => p.imageUrl).length
  const indexComImagem = lightbox !== null
    ? projects.slice(0, lightbox + 1).filter(p => p.imageUrl).length
    : 0

  return (
    <>
      <GrainOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:ital,wght@0,200;0,400;0,700;0,900;1,200;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0d0d0d;
          --surface: #141414;
          --border: #2a2a2a;
          --text: #f0ede6;
          --muted: #555;
          --accent: #FF3D00;
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
        .nav-logo { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.1em; color: var(--text); text-decoration: none; }
        .nav-logo span { color: var(--accent); }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--accent); }
        .nav-cta { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--bg); background: var(--accent); text-decoration: none; padding: 10px 20px; transition: background 0.2s, transform 0.2s; }
        .nav-cta:hover { background: var(--accent2); color: var(--bg); transform: translate(-2px,-2px); }

        /* HERO */
        .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; position: relative; overflow: hidden; }
        .hero-left { display: flex; flex-direction: column; justify-content: flex-end; padding: 0 48px 80px; position: relative; z-index: 2; border-right: 1px solid var(--border); }
        .hero-number { font-family: var(--font-display); font-size: clamp(140px, 28vw, 420px); line-height: 0.85; color: transparent; -webkit-text-stroke: 1px var(--border); position: absolute; bottom: -20px; left: -10px; pointer-events: none; z-index: 0; overflow: hidden; max-width: 100%; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; position: relative; z-index: 2; opacity: 0; transform: translateX(-20px); transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s; }
        .hero-tag.in { opacity: 1; transform: translateX(0); }
        .hero-tag-line { width: 32px; height: 2px; background: var(--accent); flex-shrink: 0; }
        .hero-title { font-family: var(--font-display); font-size: clamp(72px, 9vw, 140px); line-height: 0.9; letter-spacing: 0.02em; color: var(--text); position: relative; z-index: 2; margin-bottom: 40px; }
        .hero-title .accent { color: var(--accent); }
        .hero-title-line { overflow: hidden; display: block; }
        .hero-title-word { display: block; transform: translateY(110%); transition: transform 0.9s cubic-bezier(0.16,1,0.3,1); }
        .hero-title-word.in { transform: translateY(0); }
        .hero-title-line:nth-child(1) .hero-title-word { transition-delay: 0.2s; }
        .hero-title-line:nth-child(2) .hero-title-word { transition-delay: 0.35s; }
        .hero-title-line:nth-child(3) .hero-title-word { transition-delay: 0.5s; }
        .hero-desc { max-width: 380px; font-size: 15px; font-weight: 200; line-height: 1.8; color: #888; position: relative; z-index: 2; opacity: 0; transition: opacity 0.9s ease 0.8s; }
        .hero-desc.in { opacity: 1; }
        .hero-right { position: relative; overflow: hidden; background: var(--surface); }
        .hero-right-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1a0a00 0%, #0d0d0d 50%, #001a1a 100%); }
        .hero-right-content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px; }
        .hero-stat { display: flex; flex-direction: column; align-items: center; padding: 32px 48px; border: 1px solid var(--border); width: min(240px, 70%); opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease, border-color 0.2s; }
        .hero-stat:hover { border-color: var(--accent); }
        .hero-stat.in { opacity: 1; transform: translateY(0); }
        .hero-stat:nth-child(1) { transition-delay: 0.4s; }
        .hero-stat:nth-child(2) { transition-delay: 0.55s; margin-left: clamp(0px, 8vw, 60px); }
        .hero-stat:nth-child(3) { transition-delay: 0.7s; }
        .stat-number { font-family: var(--font-display); font-size: 64px; line-height: 1; color: var(--text); letter-spacing: 0.04em; }
        .stat-number span { color: var(--accent); }
        .stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-top: 8px; }
        .hero-scroll-indicator { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); opacity: 0; transition: opacity 0.6s ease 1.2s; z-index: 10; }
        .hero-scroll-indicator.in { opacity: 1; }
        .scroll-bar { width: 1px; height: 48px; background: var(--border); position: relative; overflow: hidden; }
        .scroll-bar::after { content: ''; position: absolute; top: -100%; left: 0; width: 100%; height: 100%; background: var(--accent); animation: scrollDrop 2s ease-in-out infinite; }
        @keyframes scrollDrop { 0% { top: -100%; } 50%, 100% { top: 100%; } }

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
        .project-list { display: flex; flex-direction: column; width: 100%; }
        .project-row { display: grid; grid-template-columns: 64px 1fr auto auto; align-items: center; gap: 16px; padding: 28px 0; border-bottom: 1px solid var(--border); cursor: pointer; position: relative; overflow: hidden; transition: padding 0.3s ease; min-width: 0; }
        .project-row::before { content: ''; position: absolute; inset: 0; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); z-index: 0; }
        .project-row:hover::before { transform: scaleX(1); }
        .project-row:hover { padding-left: 24px; }
        .project-row:hover .project-row-num,
        .project-row:hover .project-row-title,
        .project-row:hover .project-row-cat { color: var(--bg) !important; }
        .project-row:hover .project-row-tags span { background: rgba(0,0,0,0.2); color: var(--bg); border-color: transparent; }
        .project-row-num { font-family: var(--font-display); font-size: 13px; letter-spacing: 0.1em; color: var(--muted); position: relative; z-index: 1; transition: color 0.2s; }
        .project-row-title { font-family: var(--font-display); font-size: clamp(22px, 3.5vw, 48px); letter-spacing: 0.04em; color: var(--text); position: relative; z-index: 1; transition: color 0.2s; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .project-row-cat { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); position: relative; z-index: 1; transition: color 0.2s; white-space: nowrap; }
        .project-row-tags { display: flex; gap: 6px; position: relative; z-index: 1; }
        .project-row-tags span { font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 8px; border: 1px solid var(--border); color: var(--muted); white-space: nowrap; transition: all 0.2s; }
        .project-cover { position: absolute; right: 0; top: 0; bottom: 0; width: 180px; overflow: hidden; opacity: 0; transition: opacity 0.3s ease; z-index: 2; pointer-events: none; }
        .project-row:hover .project-cover { opacity: 1; }
        .no-image-row { cursor: default; }
        .no-image-row:hover::before { transform: scaleX(0); }

        /* LIGHTBOX */
        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.96);
          display: flex; flex-direction: column;
          animation: lbIn 0.3s ease;
        }
        @keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }

        .lightbox-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 32px;
          border-bottom: 1px solid #1a1a1a;
          flex-shrink: 0;
        }
        .lightbox-info { display: flex; flex-direction: column; gap: 4px; }
        .lightbox-title { font-family: var(--font-display); font-size: clamp(18px, 3vw, 28px); letter-spacing: 0.06em; color: var(--text); }
        .lightbox-meta { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
        .lightbox-meta span { color: var(--accent); margin-right: 12px; }

        .lightbox-controls { display: flex; align-items: center; gap: 8px; }
        .lightbox-btn {
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text);
          font-size: 18px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          font-family: var(--font-display);
          letter-spacing: 0.05em;
        }
        .lightbox-btn:hover { background: var(--accent); border-color: var(--accent); color: #000; }
        .lightbox-close { font-size: 22px; }

        .lightbox-counter {
          font-family: var(--font-display);
          font-size: 13px;
          letter-spacing: 0.1em;
          color: var(--muted);
          padding: 0 16px;
        }

        .lightbox-image-wrap {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-image-wrap img {
          object-fit: contain !important;
          max-height: 100%;
          max-width: 100%;
        }

        .lightbox-arrow {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 56px; height: 56px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border);
          background: rgba(13,13,13,0.8);
          color: var(--text);
          font-size: 20px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          z-index: 2;
          backdrop-filter: blur(8px);
        }
        .lightbox-arrow:hover { background: var(--accent); border-color: var(--accent); color: #000; }
        .lightbox-arrow.left { left: 24px; }
        .lightbox-arrow.right { right: 24px; }

        .lightbox-tags {
          display: flex; gap: 8px; flex-wrap: wrap;
          padding: 16px 32px;
          border-top: 1px solid #1a1a1a;
          flex-shrink: 0;
        }
        .lightbox-tag {
          font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 10px; border: 1px solid var(--border); color: var(--muted);
        }

        /* ABOUT */
        .about-section { display: grid; grid-template-columns: 1fr 1fr; min-height: 80vh; border-top: 1px solid var(--border); }
        .about-visual { background: var(--surface); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; border-right: 1px solid var(--border); min-height: 600px; }
        .about-giant-letter { font-family: var(--font-display); font-size: clamp(200px, 30vw, 400px); line-height: 1; color: transparent; -webkit-text-stroke: 2px var(--border); user-select: none; position: absolute; overflow: hidden; }
        .about-visual-label { position: absolute; bottom: 40px; left: 48px; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
        .about-accent-block { position: absolute; top: 0; right: 0; width: 4px; height: 100%; background: var(--accent); }
        .about-content { padding: 80px 64px; display: flex; flex-direction: column; justify-content: center; }
        .about-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
        .about-eyebrow::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .about-heading { font-family: var(--font-display); font-size: clamp(48px, 5vw, 76px); line-height: 0.95; letter-spacing: 0.03em; margin-bottom: 40px; }
        .about-heading .line2 { color: var(--accent); }
        .about-body { font-size: 15px; font-weight: 200; line-height: 1.9; color: #888; margin-bottom: 16px; }
        .about-divider { width: 48px; height: 2px; background: var(--accent); margin: 40px 0; }
        .about-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
        .about-list-item { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text); }
        .about-list-item::before { content: ''; width: 6px; height: 6px; background: var(--accent); flex-shrink: 0; }

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
        footer { border-top: 1px solid var(--border); padding: 32px 48px; display: flex; justify-content: space-between; align-items: center; background: var(--surface); }
        .footer-logo { font-family: var(--font-display); font-size: 22px; letter-spacing: 0.1em; color: var(--text); text-decoration: none; }
        .footer-logo span { color: var(--accent); }
        .footer-copy { font-size: 11px; font-weight: 400; letter-spacing: 0.1em; color: var(--muted); }
        .footer-links { display: flex; gap: 28px; }
        .footer-links a { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--accent); }

        @media (max-width: 900px) {
          .nav { padding: 20px 24px; }
          .nav.solid { padding: 14px 24px; }
          .nav-links, .nav-cta { display: none; }
          .hero { grid-template-columns: 1fr; min-height: auto; }
          .hero-right { display: none; }
          .hero-left { padding: 110px 24px 80px; border-right: none; min-height: 100vh; }
          .hero-number { font-size: clamp(120px, 40vw, 200px); left: -8px; }
          .work-section { padding: 80px 24px; }
          .work-header { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 48px; }
          .project-row { grid-template-columns: 48px 1fr; gap: 12px; padding: 20px 0; }
          .project-row-cat, .project-row-tags, .project-cover { display: none; }
          .project-row-title { font-size: clamp(20px, 5vw, 32px); white-space: normal; }
          .about-section { grid-template-columns: 1fr; }
          .about-visual { display: none; }
          .about-content { padding: 60px 24px; }
          .about-heading { font-size: clamp(40px, 10vw, 64px); }
          .about-list { grid-template-columns: 1fr 1fr; }
          .services-section { padding: 80px 24px; }
          .services-grid { grid-template-columns: 1fr; }
          .contact-section { padding: 80px 24px; }
          .contact-heading { font-size: clamp(56px, 14vw, 100px); }
          .contact-btn { padding: 16px 32px; width: 100%; justify-content: center; }
          footer { padding: 24px; flex-direction: column; gap: 16px; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
          .lightbox-arrow { width: 44px; height: 44px; }
          .lightbox-arrow.left { left: 8px; }
          .lightbox-arrow.right { right: 8px; }
          .lightbox-header { padding: 14px 16px; }
          .lightbox-tags { padding: 12px 16px; }
          .lightbox-counter { padding: 0 8px; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: clamp(56px, 14vw, 80px); }
          .hero-desc { font-size: 14px; }
          .work-title { font-size: clamp(48px, 12vw, 72px); }
          .about-list { grid-template-columns: 1fr; }
          .contact-heading { font-size: clamp(48px, 13vw, 80px); }
          .contact-email { font-size: clamp(16px, 4.5vw, 24px); word-break: break-all; }
        }
      `}</style>

      {/* LIGHTBOX */}
      {lightbox !== null && activeProjeto && activeProjeto.imageUrl && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX
            touchStartY.current = e.touches[0].clientY
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
            if (Math.abs(dx) > 50 && dy < 80) {
              if (dx < 0) nextProject()
              else prevProject()
            }
          }}
        >
          {/* Header */}
          <div className="lightbox-header" onClick={e => e.stopPropagation()}>
            <div className="lightbox-info">
              <span className="lightbox-title">{activeProjeto.title}</span>
              <span className="lightbox-meta">
                <span>{activeProjeto.category}</span>
                {activeProjeto.year}
              </span>
            </div>
            <div className="lightbox-controls">
              <button className="lightbox-btn" onClick={prevProject}>←</button>
              <span className="lightbox-counter">{indexComImagem} / {totalComImagem}</span>
              <button className="lightbox-btn" onClick={nextProject}>→</button>
              <button className="lightbox-btn lightbox-close" onClick={closeLightbox}>✕</button>
            </div>
          </div>

          {/* Imagem */}
          <div className="lightbox-image-wrap">
            <Image
              src={activeProjeto.imageUrl}
              alt={activeProjeto.title}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
              priority
            />
            <button className="lightbox-arrow left" onClick={prevProject}>←</button>
            <button className="lightbox-arrow right" onClick={nextProject}>→</button>
          </div>

          {/* Tags */}
          {activeProjeto.tags?.length > 0 && (
            <div className="lightbox-tags" onClick={e => e.stopPropagation()}>
              {activeProjeto.tags.map(t => (
                <span key={t} className="lightbox-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NAV */}
      <nav className={`nav ${navSolid ? 'solid' : ''}`}>
        <a href="#" className="nav-logo">MELL<span>O</span></a>
        <ul className="nav-links">
          <li><a href="#trabalhos">Trabalhos</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#servicos">Serviços</a></li>
        </ul>
        <a href="#contato" className="nav-cta">Contato</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-number">M</div>
          <p className={`hero-tag ${loaded ? 'in' : ''}`}>
            <span className="hero-tag-line" />
            {hero?.eyebrow || 'Fotógrafo & Designer — Brasil'}
          </p>
          <h1 className="hero-title">
            <span className="hero-title-line">
              <span className={`hero-title-word ${loaded ? 'in' : ''}`}>{hero?.titleLine1 || 'IMAGENS'}</span>
            </span>
            <span className="hero-title-line">
              <span className={`hero-title-word ${loaded ? 'in' : ''}`}>{hero?.titleLine2 || 'QUE'}</span>
            </span>
            <span className="hero-title-line">
              <span className={`hero-title-word ${loaded ? 'in' : ''}`}>
                <span className="accent">{hero?.titleLine3 || 'FALAM.'}</span>
              </span>
            </span>
          </h1>
          <p className={`hero-desc ${loaded ? 'in' : ''}`}>{hero?.description}</p>
          <div className={`hero-scroll-indicator ${loaded ? 'in' : ''}`}>
            <div className="scroll-bar" />
            <span>Role</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-right-bg" />
          <div className="hero-right-content">
            {[
              { value: hero?.statExperience || '10+', label: 'Anos de experiência' },
              { value: hero?.statProjects || '200+', label: 'Projetos entregues' },
              { value: hero?.statClients || '48', label: 'Clientes ativos' },
            ].map((s, i) => (
              <div key={i} className={`hero-stat ${loaded ? 'in' : ''}`}>
                <span className="stat-number">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="ticker-item">
              Fotografia <span className="ticker-sep">✦</span>
              Direção de Arte <span className="ticker-sep">✦</span>
              Identidade Visual <span className="ticker-sep">✦</span>
              Editorial <span className="ticker-sep">✦</span>
              Motion <span className="ticker-sep">✦</span>
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
        <div className="project-list">
          {projects.length === 0 ? (
            <p style={{ color: 'var(--muted)', padding: '40px 0' }}>Nenhum projeto publicado ainda.</p>
          ) : projects.map((p, i) => (
            <div
              key={p._id}
              className={`project-row ${!p.imageUrl ? 'no-image-row' : ''}`}
              onClick={() => p.imageUrl && openLightbox(i)}
              onMouseEnter={() => setHovered(p._id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="project-row-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="project-row-title">{p.title}</span>
              <span className="project-row-cat">{p.category}</span>
              <div className="project-row-tags">{p.tags?.map(t => <span key={t}>{t}</span>)}</div>
              {p.imageUrl && (
                <div className="project-cover">
                  <Image src={p.imageUrl} alt={p.title} fill style={{ objectFit: 'cover' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="sobre">
        <div className="about-visual">
          <div className="about-giant-letter">M</div>
          <div className="about-accent-block" />
          <span className="about-visual-label">Est. {about?.establishedYear || '2014'} — Brasil</span>
        </div>
        <div className="about-content">
          <p className="about-eyebrow">Sobre Mello</p>
          <h2 className="about-heading">
            {about?.headingLine1 || 'OLHO'}<br />
            <span className="line2">{about?.headingLine2 || 'TREINADO.'}</span><br />
            {about?.headingLine3 || 'MÃO FIRME.'}
          </h2>
          <p className="about-body">{about?.paragraph1}</p>
          <p className="about-body">{about?.paragraph2}</p>
          <div className="about-divider" />
          <div className="about-list">
            {about?.skills?.map(s => <span key={s} className="about-list-item">{s}</span>)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section" id="servicos">
        <p className="work-label">O que eu faço</p>
        <h2 className="work-title" style={{ marginTop: 8 }}>SERVI<span className="work-title-alt">ÇOS</span></h2>
        <div className="services-grid">
          {services?.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="service-name">{s.name}</h3>
              <p className="service-desc">{s.description}</p>
              <div className="service-bar" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contato">
        <div className="contact-bg-text">CONTATO</div>
        <div className="contact-inner">
          <span className="contact-label">Vamos trabalhar juntos</span>
          <h2 className="contact-heading">DIGA<br /><span className="inv">OLÁ.</span></h2>
          <a href="https://wa.me/5579981149177" target="_blank" rel="noopener noreferrer" className="contact-email">+55 79 98114-9177</a>
<a href="https://wa.me/5579981149177" target="_blank" rel="noopener noreferrer" className="contact-btn">Enviar mensagem <span>→</span></a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="#" className="footer-logo">MELL<span>O</span></a>
        <span className="footer-copy">© {new Date().getFullYear()} — Todos os direitos reservados</span>
        <div className="footer-links">
          {contact?.instagramUrl && <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {contact?.behanceUrl && <a href={contact.behanceUrl} target="_blank" rel="noopener noreferrer">Behance</a>}
          {contact?.linkedinUrl && <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
        </div>
      </footer>
    </>
  )
}