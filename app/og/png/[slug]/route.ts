import { NextResponse } from 'next/server'
import { generateOgSvg } from '../../../../lib/og'
import sharp from 'sharp'

export async function GET(req: Request, { params }:{params:{slug:string}}){
  try{
    const svg = await generateOgSvg(params.slug)
    const buffer = Buffer.from(svg)
    const png = await sharp(buffer).png({ quality: 90 }).toBuffer()
    return new NextResponse(png as unknown as BodyInit, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' } })
  }catch(err){
    console.error(err)
    return new NextResponse('Not found', { status:404 })
  }
}
