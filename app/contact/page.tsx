import type { Metadata } from 'next'
import ContactForm from '../../components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Devashish Singh for consulting, workshops, mentoring, and collaborations. Based in Malaysia, working globally.',
  keywords: ['contact', 'hire', 'consulting', 'workshop', 'mentoring', 'Devashish Singh', 'Malaysia'],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Devashish Singh',
    description: 'Reach out for consulting, workshops, mentoring, and collaborations. Based in Malaysia, working globally.',
    url: '/contact',
  },
}

export default function Contact(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">Contact</h1>
      <p className="mt-4 text-gray-700">I respond to meaningful inquiries about consulting, workshops, and collaborations. Use the form or reach out directly via email or WhatsApp.</p>

      <div className="mt-8 max-w-lg">
        <ContactForm />
      </div>
    </section>
  )
}
