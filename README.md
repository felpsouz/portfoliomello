# Isaías Melo — Portfólio

Portfólio pessoal de **Isaías Melo**, Diretor de Arte e Fotógrafo em Sergipe, Brasil.  
Construído com **Next.js 16**, **Sanity CMS** e **Resend** para envio de e-mails.

🌐 **[isaiasmello.vercel.app](https://isaiasmello.vercel.app)**

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Stack](#stack)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rodando localmente](#rodando-localmente)
- [Sanity CMS](#sanity-cms)
- [Formulário de contato](#formulário-de-contato)
- [Deploy](#deploy)
- [Segurança](#segurança)
- [SEO](#seo)

---

## Sobre o projeto

Site de portfólio com as seguintes seções:

- **Apresentação** — foto de perfil, bio e trajetória
- **Trabalhos** — projetos organizados por categoria (Identidade Visual, Social Media, Impressos/OOH, Fotografia) com lightbox de imagens
- **Feedbacks** — galeria masonry com prints de avaliações de clientes
- **Serviços** — cards com os serviços oferecidos
- **Formulário de captação** — coleta nome, telefone e e-mail e envia notificação por e-mail
- **Contato** — e-mail direto e WhatsApp

Todo o conteúdo (textos, imagens, projetos, serviços) é gerenciado via **Sanity Studio** em `/studio`.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| CMS | [Sanity v5](https://sanity.io) |
| E-mail | [Resend](https://resend.com) |
| Hospedagem | [Vercel](https://vercel.com) |
| Linguagem | TypeScript |
| Estilo | CSS-in-JS (style tag inline) |
| Fontes | Bebas Neue + Epilogue (Google Fonts) |

---

## Estrutura de pastas

```
portfoliomello/
├── app/
│   ├── api/
│   │   ├── contato/
│   │   │   └── route.ts        # API de captação de leads (Resend)
│   │   └── revalidate/
│   │       └── route.ts        # Webhook de revalidação do Sanity
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx        # Sanity Studio embutido
│   ├── globals.css
│   ├── layout.tsx              # Metadata, lang, fontes
│   ├── page.tsx                # Server component — busca dados do Sanity
│   └── PortfolioClient.tsx     # Client component — toda a UI
├── sanity/
│   ├── schemas/
│   │   ├── index.ts
│   │   ├── project.ts          # Schema de projetos
│   │   └── siteSettings.ts     # Schema de configurações do site
│   ├── client.ts               # Cliente Sanity + urlFor
│   └── queries.ts              # Queries GROQ + tipos TypeScript
├── public/
│   └── mello.jpeg              # Foto de perfil fallback
├── .env.local                  # Variáveis de ambiente (não subir no Git)
├── next.config.ts              # Headers de segurança + imagens
├── sanity.config.ts            # Configuração do Sanity Studio
└── tsconfig.json
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org) >= 18
- Conta no [Sanity](https://sanity.io) (gratuita)
- Conta no [Resend](https://resend.com) (gratuita — 3.000 e-mails/mês)
- Conta no [Vercel](https://vercel.com) (gratuita)

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/portfoliomello.git
cd portfoliomello

# Instale as dependências
npm install
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Sanity — encontre em sanity.io/manage no seu projeto
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity token (opcional — necessário só para operações de escrita)
SANITY_API_TOKEN=seu_token

# Resend — encontre em resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# E-mail que vai receber os leads do formulário
EMAIL_DESTINO=seuemail@gmail.com
```

> ⚠️ **Nunca suba o `.env.local` para o Git.** Ele já está no `.gitignore`.

---

## Rodando localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o site.  
Acesse [http://localhost:3000/studio](http://localhost:3000/studio) para o painel do Sanity.

---

## Sanity CMS

O conteúdo é gerenciado pelo Sanity Studio, acessível em `/studio`.

### Schemas disponíveis

**`project`** — Projetos do portfólio:
- Título, categoria, ano, tags
- Imagem de capa (`coverImage`)
- Galeria de imagens (`images[]`)
- Ordem de exibição
- Publicado/rascunho

**`siteSettings`** — Configurações globais do site:
- `heroSection` — foto de perfil, textos da apresentação
- `services[]` — lista de serviços
- `feedbackImages[]` — prints de feedbacks de clientes
- `contactSection` — e-mail, WhatsApp, redes sociais

### Revalidação automática

O Sanity aciona um webhook em `/api/revalidate` sempre que um conteúdo é publicado, atualizando o site em produção sem necessidade de novo deploy.

---

## Formulário de contato

Quando um visitante preenche o formulário (nome, telefone e e-mail opcional), o fluxo é:

```
Visitante preenche → POST /api/contato → Resend → Gmail do Isaías
```

O e-mail recebido contém os dados do lead e um botão **"Responder via WhatsApp"** que abre a conversa já com o nome da pessoa na mensagem.

### Proteções implementadas

| Proteção | Detalhe |
|----------|---------|
| Rate limit | Máx. 3 envios por IP a cada 10 minutos |
| Sanitização | Todos os inputs têm HTML escapado e tamanho limitado |
| Validação | Nome e telefone obrigatórios; e-mail validado por regex |
| CORS | Apenas o domínio oficial é aceito |
| Body limit | Requisições acima de 4KB são rejeitadas |
| Env check | App não sobe se as variáveis obrigatórias estiverem ausentes |

---

## Deploy

O deploy é feito automaticamente pelo Vercel a cada push na branch `main`.

### Configuração no Vercel

Adicione as variáveis de ambiente em **Settings → Environment Variables**:

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
RESEND_API_KEY
EMAIL_DESTINO
```

Marque os ambientes: **Production**, **Preview** e **Development**.

### Deploy manual

```bash
# Build de produção local (para testar antes de subir)
npm run build
npm run start
```

---

## Segurança

Headers de segurança configurados no `next.config.ts` para todas as rotas:

| Header | Valor |
|--------|-------|
| `X-Frame-Options` | `DENY` — impede clickjacking via iframe |
| `X-Content-Type-Options` | `nosniff` — impede MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Permissions-Policy` | Desabilita câmera, microfone e geolocalização |
| `X-Powered-By` | Removido — oculta versão do Next.js |

---

## SEO

Configurado em `app/layout.tsx`:

- `title` e `description` otimizados para busca
- `keywords` relevantes para o nicho
- **Open Graph** para compartilhamento em redes sociais
- **Twitter Card** (`summary_large_image`)
- `robots: index, follow`
- `lang="pt-BR"` no HTML
- `locale: pt_BR` no Open Graph

---

## Licença

Projeto pessoal — todos os direitos reservados © Isaías Melo.