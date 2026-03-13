// app/api/contato/route.ts
// (se seu projeto usar o diretório "pages", veja o arquivo pages/api/contato.ts abaixo)

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { nome, telefone, email } = await req.json()

    // Validação básica
    if (!nome?.trim() || !telefone?.trim()) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios.' },
        { status: 400 }
      )
    }

    const { error } = await resend.emails.send({
      from: 'Portfólio <onboarding@resend.dev>',  // troque pelo seu domínio quando tiver
      to: process.env.EMAIL_DESTINO!,              // seu Gmail
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