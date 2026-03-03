export default {
  name: 'project',
  title: 'Projeto',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título do Projeto',
      type: 'string',
      validation: (Rule: any) => Rule.required().error('O título é obrigatório'),
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Fotografia', value: 'Fotografia' },
          { title: 'Design', value: 'Design' },
          { title: 'Direção de Arte', value: 'Direção de Arte' },
          { title: 'Fotografia / Design', value: 'Fotografia / Design' },
          { title: 'Editorial', value: 'Editorial' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Ano',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Tags',
      description: 'Palavras-chave curtas (ex: Retrato, P&B, Urbano)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'coverImage',
      title: 'Imagem de Capa',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo (acessibilidade)',
          type: 'string',
        },
      ],
    },
    {
      name: 'order',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Número menor aparece primeiro',
    },
    {
      name: 'published',
      title: 'Publicado',
      type: 'boolean',
      description: 'Desmarque para ocultar o projeto do site',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
}