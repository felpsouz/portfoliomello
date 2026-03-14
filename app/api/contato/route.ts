// app/api/contato/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// ── Verificação de variáveis de ambiente ────────────────────────────────────
if (!process.env.RESEND_API_KEY || !process.env.EMAIL_DESTINO) {
  throw new Error('RESEND_API_KEY e EMAIL_DESTINO são obrigatórios no .env.local')
}

const resend = new Resend(process.env.RESEND_API_KEY)

// ── Rate limit em memória (máx 3 por IP a cada 10 min) ─────────────────────
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 3
const WINDOW_MS = 10 * 60 * 1000

// ── Sanitização: remove HTML e limita tamanho ───────────────────────────────
function sanitize(value: unknown, maxLength = 200): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, maxLength)
}

// ── Origens permitidas ──────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://isaiasmello.vercel.app',
  'http://localhost:3000', // desenvolvimento local
]

export async function POST(req: NextRequest) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const origin = req.headers.get('origin') ?? ''
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  }

  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= LIMIT) {
        return NextResponse.json(
          { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
          { status: 429 }
        )
      }
      entry.count++
    } else {
      rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    }
  } else {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  }

  // ── Body size limit (~4 KB) ───────────────────────────────────────────────
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > 4096) {
    return NextResponse.json({ error: 'Requisição muito grande.' }, { status: 413 })
  }

  try {
    const raw = await req.json()

    // ── Sanitização ───────────────────────────────────────────────────────
    const nome     = sanitize(raw.nome, 100)
    const telefone = sanitize(raw.telefone, 20)
    const email    = sanitize(raw.email, 150)

    // ── Validações ────────────────────────────────────────────────────────
    if (!nome || !telefone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
    }

    // ── Envio via Resend ──────────────────────────────────────────────────
    const { error } = await resend.emails.send({
      from: 'Portfólio <onboarding@resend.dev>', // troque pelo seu domínio quando tiver
      to: process.env.EMAIL_DESTINO!,
      subject: `📥 Novo lead — ${nome}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0d0d0d; color: #f0ede6; border-radius: 8px;">
          <h2 style="font-size: 22px; margin: 0 0 8px; color: #FF3D00; letter-spacing: 2px;">NOVO LEAD NO PORTFÓLIO</h2>
          <p style="font-size: 12px; color: #555; margin: 0 0 32px; letter-spacing: 1px; text-transform: uppercase;">isaiasmelo.com.br</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #2a2a2a; font-size: 11px; color: #555; letter-spacing: 2px; text-transform: uppercase; width: 120px;">Nome</td>
              <td style="padding: 14px 0; border-bottom: 1px solid #2a2a2a; font-size: 15px; color: #f0ede6;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #2a2a2a; font-size: 11px; color: #555; letter-spacing: 2px; text-transform: uppercase;">Telefone</td>
              <td style="padding: 14px 0; border-bottom: 1px solid #2a2a2a; font-size: 15px; color: #f0ede6;">${telefone}</td>
            </tr>
            <tr>
              <td style="padding: 14px 0; font-size: 11px; color: #555; letter-spacing: 2px; text-transform: uppercase;">E-mail</td>
              <td style="padding: 14px 0; font-size: 15px; color: #f0ede6;">${email || '—'}</td>
            </tr>
          </table>
          <a
            href="https://wa.me/5579981149177?text=${encodeURIComponent(`Olá ${nome}! Vi que você deixou seu contato no meu portfólio. Vamos conversar sobre o seu projeto? 🚀`)}"
            style="display: inline-block; margin-top: 32px; background: #FF3D00; color: #000; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 2px;"
          >
            Responder via WhatsApp →
          </a>
          <p style="margin-top: 32px; font-size: 11px; color: #333;">
            Enviado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Maceio' })}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Erro ao enviar e-mail.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}