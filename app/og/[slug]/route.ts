import { NextResponse } from 'next/server'
import { generateOgSvg } from '../../../lib/og'

export async function GET(req: Request, { params }:{params:{slug:string}}){
  try{
    const svg = await generateOgSvg(params.slug)
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' } })
  }catch(err){
    return new NextResponse('Not found', { status:404 })
  }
}
