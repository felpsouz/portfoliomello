export default {
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: '🏠 Seção Principal (Hero)',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Texto pequeno acima do título', type: 'string', initialValue: 'Fotógrafo & Designer — Brasil' },
        { name: 'titleLine1', title: 'Título — Linha 1', type: 'string', initialValue: 'IMAGENS' },
        { name: 'titleLine2', title: 'Título — Linha 2', type: 'string', initialValue: 'QUE' },
        { name: 'titleLine3', title: 'Título — Linha 3 (destaque em vermelho)', type: 'string', initialValue: 'FALAM.' },
        { name: 'description', title: 'Descrição', type: 'text', rows: 3, initialValue: 'Fotografia e design com intenção. Crio imagens e identidades visuais que comunicam com força, clareza e personalidade — do retrato à marca.' },
        { name: 'statExperience', title: 'Estatística: Anos de experiência', type: 'string', initialValue: '10+' },
        { name: 'statProjects', title: 'Estatística: Projetos entregues', type: 'string', initialValue: '200+' },
        { name: 'statClients', title: 'Estatística: Clientes ativos', type: 'string', initialValue: '48' },
      ],
    },
    {
      name: 'aboutSection',
      title: '👤 Seção Sobre',
      type: 'object',
      fields: [
        { name: 'headingLine1', title: 'Título — Linha 1', type: 'string', initialValue: 'OLHO' },
        { name: 'headingLine2', title: 'Título — Linha 2 (destaque em vermelho)', type: 'string', initialValue: 'TREINADO.' },
        { name: 'headingLine3', title: 'Título — Linha 3', type: 'string', initialValue: 'MÃO FIRME.' },
        { name: 'paragraph1', title: 'Parágrafo 1', type: 'text', rows: 4, initialValue: 'Há mais de uma década fotografo e crio identidades visuais para marcas, artistas e empresas que querem se comunicar com verdade.' },
        { name: 'paragraph2', title: 'Parágrafo 2', type: 'text', rows: 4, initialValue: 'Cada projeto é tratado como único: da direção de arte à entrega final, o processo é colaborativo, rigoroso e sempre orientado ao resultado.' },
        { name: 'establishedYear', title: 'Ano de fundação (ex: 2014)', type: 'string', initialValue: '2014' },
        {
          name: 'skills',
          title: 'Habilidades / Especialidades',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
          initialValue: ['Fotografia', 'Direção de Arte', 'Identidade Visual', 'Tipografia', 'Editorial', 'Motion'],
        },
      ],
    },
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
    },
    {
      name: 'contactSection',
      title: '📬 Seção de Contato',
      type: 'object',
      fields: [
        { name: 'email', title: 'E-mail de contato', type: 'string', initialValue: 'oi@mello.com.br' },
        { name: 'instagramUrl', title: 'Link do Instagram', type: 'url' },
        { name: 'behanceUrl', title: 'Link do Behance', type: 'url' },
        { name: 'linkedinUrl', title: 'Link do LinkedIn', type: 'url' },
      ],
    },
    {
      name: 'seo',
      title: '🔍 SEO',
      type: 'object',
      fields: [
        { name: 'siteTitle', title: 'Título do Site', type: 'string', initialValue: 'Mello — Fotógrafo & Designer' },
        { name: 'siteDescription', title: 'Descrição do Site (Google)', type: 'text', rows: 2, initialValue: 'Portfólio de fotografia e design.' },
      ],
    },
  ],
  __experimental_actions: ['update', 'publish'],
}