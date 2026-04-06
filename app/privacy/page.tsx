import Link from 'next/link'

export default function Privacy(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-3xl">Privacy Policy</h1>
      <div className="mt-6 max-w-3xl" style={{ lineHeight: 1.8, color: '#444' }}>
        <p className="mb-4">Last updated: April 2026</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly — such as your name, email address, and message content when you use our contact form, subscribe to our newsletter, or request a session booking. We may also collect basic analytics data (page views, browser type) to improve the site experience.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Your Information</h2>
        <p className="mb-4">Your information is used to respond to your inquiries, send newsletters you have opted into, and improve our content and services. We do not sell, trade, or share your personal data with third parties for marketing purposes.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Cookies</h2>
        <p className="mb-4">This site may use essential cookies for authentication and session management. No tracking cookies are used for advertising.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Data Retention</h2>
        <p className="mb-4">We retain your data only as long as necessary to fulfil the purposes described above. You may request deletion of your data at any time by contacting us.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
        <p>If you have questions about this policy, please reach out via our <Link href="/contact" className="underline">contact page</Link>.</p>
      </div>
    </section>
  )
}
