import Link from 'next/link'

export default function Terms(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-3xl">Terms & Disclaimer</h1>
      <div className="mt-6 max-w-3xl" style={{ lineHeight: 1.8, color: '#444' }}>
        <p className="mb-4">Last updated: April 2026</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Use of This Website</h2>
        <p className="mb-4">This website and its content are provided for informational purposes only. By accessing and using this site, you agree to these terms. If you do not agree, please discontinue use.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Intellectual Property</h2>
        <p className="mb-4">All content, including blog posts, design, code samples, and media on this website are the intellectual property of the site owner unless otherwise stated. Reproduction without permission is prohibited.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Disclaimer</h2>
        <p className="mb-4">The information provided on this site is for general informational purposes. While we strive for accuracy, we make no guarantees about the completeness or reliability of the information. Use of any information is at your own risk.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">External Links</h2>
        <p className="mb-4">This site may contain links to external websites. We are not responsible for the content or privacy practices of those sites.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
        <p className="mb-4">In no event shall the site owner be liable for any damages arising from your use of this website or its content.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
        <p>Questions about these terms? Reach out via our <Link href="/contact" className="underline">contact page</Link>.</p>
      </div>
    </section>
  )
}
