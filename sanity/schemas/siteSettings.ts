export default {
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    // ─── HERO / APRESENTAÇÃO ───────────────────────────────────────────────
    {
      name: 'heroSection',
      title: '🏠 Apresentação',
      type: 'object',
      fields: [
        {
          name: 'profilePhoto',
          title: 'Foto de Perfil',
          type: 'image',
          options: { hotspot: true },
          description: 'Foto que aparece na seção de apresentação',
        },
        { name: 'eyebrow', title: 'Texto pequeno acima do nome', type: 'string', initialValue: 'Diretor de Arte & Fotógrafo — Sergipe, Brasil' },
        { name: 'name', title: 'Nome (linha 1)', type: 'string', initialValue: 'ISAÍAS' },
        { name: 'nameAccent', title: 'Nome (linha 2 — em vermelho)', type: 'string', initialValue: 'MELO' },
        { name: 'role', title: 'Cargo / Curso', type: 'string', initialValue: 'Publicidade & Propaganda · UFS · 7º Período' },
        { name: 'paragraph1', title: 'Parágrafo 1', type: 'text', rows: 3, initialValue: 'Olá, meu nome é Isaías Melo. Tenho 24 anos e estou no 7º período de Publicidade e Propaganda na Universidade Federal de Sergipe.' },
        { name: 'paragraph2', title: 'Parágrafo 2', type: 'text', rows: 4, initialValue: 'Sou apaixonado por arte, principalmente pela forma como ela se comunica com as pessoas. Atuo com construção de marca, criação de conteúdo para redes sociais e desenvolvimento de materiais impressos.' },
        { name: 'paragraph3', title: 'Parágrafo 3', type: 'text', rows: 4, initialValue: 'Além disso, sou fotógrafo, movido pela paixão de eternizar momentos importantes e sinceros. Acredito que tudo o que é feito com amor prevalece.' },
        { name: 'ctaLabel', title: 'Texto do botão CTA', type: 'string', initialValue: 'Ver meus trabalhos' },
      ],
    },

    // ─── SERVIÇOS ─────────────────────────────────────────────────────────
    {
      name: 'services',
      title: '🛠 Serviços',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Nome do Serviço', type: 'string' },
            { name: 'description', title: 'Descrição', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        },
      ],
      initialValue: [
        { name: 'Identidade Visual', description: 'Criação de marca completa: logo, paleta, tipografia e manual de identidade visual.' },
        { name: 'Design para Social Media', description: 'Peças visuais para Instagram e outras plataformas, alinhadas à identidade da marca.' },
        { name: 'Calendário Editorial', description: 'Planejamento estratégico de conteúdo com datas, pautas e formatos definidos.' },
        { name: 'Impressos e Mídia OOH', description: 'Banners, cartões, embalagens, adesivos, vestuário e comunicação para o ambiente físico.' },
        { name: 'Fotografia', description: 'Ensaios empresariais, institucionais, eventos e fotografia documental.' },
      ],
    },

    // ─── FEEDBACKS — GALERIA DE IMAGENS ───────────────────────────────────
    {
      name: 'feedbackImages',
      title: '💬 Feedbacks (Galeria de Imagens)',
      type: 'array',
      description: 'Adicione prints de elogios, avaliações ou depoimentos. As imagens aparecem em grade no site.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Descrição da imagem (acessibilidade)',
              type: 'string',
              description: 'Ex: "Avaliação 5 estrelas — Rafael Oliveira"',
            },
          ],
          preview: {
            select: { media: 'asset', title: 'alt' },
            prepare({ title }: { title?: string }) {
              return { title: title || 'Imagem de feedback' }
            },
          },
        },
      ],
    },

    // ─── CONTATO / REDES SOCIAIS ──────────────────────────────────────────
    {
      name: 'contactSection',
      title: '📬 Contato & Redes Sociais',
      type: 'object',
      fields: [
        { name: 'email', title: 'E-mail de contato', type: 'string', initialValue: 'isaiasmellomkt@gmail.com' },
        { name: 'whatsapp', title: 'WhatsApp (só números, com DDI)', type: 'string', description: 'Ex: 5579981149177', initialValue: '5579981149177' },
        { name: 'instagramUrl', title: 'Link do Instagram', type: 'url', initialValue: 'https://www.instagram.com/mellorgb/' },
        { name: 'tiktokUrl', title: 'Link do TikTok', type: 'url', initialValue: 'https://www.tiktok.com/@mellorgb' },
        { name: 'behanceUrl', title: 'Link do Behance', type: 'url', initialValue: 'https://www.behance.net/isaiasmello' },
        { name: 'linkedinUrl', title: 'Link do LinkedIn', type: 'url', initialValue: 'https://www.linkedin.com/in/isaías-melo-52b8a53b3/' },
      ],
    },

    // ─── SEO ──────────────────────────────────────────────────────────────
    {
      name: 'seo',
      title: '🔍 SEO',
      type: 'object',
      fields: [
        { name: 'siteTitle', title: 'Título do Site', type: 'string', initialValue: 'Isaías Melo — Diretor de Arte & Fotógrafo' },
        { name: 'siteDescription', title: 'Descrição (Google)', type: 'text', rows: 2, initialValue: 'Portfólio de direção de arte e fotografia. Sergipe, Brasil.' },
      ],
    },
  ],
  __experimental_actions: ['update', 'publish'],
}