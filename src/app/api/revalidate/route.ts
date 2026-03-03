/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret')

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return new NextResponse('Invalid secret', { status: 401 })
    }

    const body = await req.json()

    if (!body?._type) {
      return new NextResponse('Missing type', { status: 400 })
    }

    const { revalidateTag } = await import('next/cache')

    if (body._type === 'siteSettings') {
      // @ts-ignore
      revalidateTag('siteSettings')
    } else {
      // @ts-ignore
      revalidateTag('projects')
    }

    return NextResponse.json({ status: 200, revalidated: true, type: body._type })
  } catch (err: any) {
    console.error(err)
    return new NextResponse(err.message, { status: 500 })
  }
}