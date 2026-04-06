import { NextResponse } from 'next/server'

export async function GET(){
  const content = `User-agent: *
Allow: /
Sitemap: ${process.env.BASE_URL || 'https://example.com'}/sitemap.xml
`;

  return new NextResponse(content, {headers:{'content-type':'text/plain'}})
}
