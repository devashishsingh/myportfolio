import ServiceCard from '../../components/ServiceCard'

export default function Services(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">Services</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">I offer consulting, strategy sessions, portfolio and positioning guidance, workshops, and mentoring. Each engagement is scoped to outcomes and tailored to the organisation or individual.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <ServiceCard title="Consulting" subtitle="Advisory" href="/contact" cta="Get in Touch">Tactical and strategic advisory for product and leadership teams.</ServiceCard>
        <ServiceCard title="Portfolio & Positioning" subtitle="For creators" href="/contact" cta="Get Started">Guided refresh and positioning for portfolios, resumes and personal sites.</ServiceCard>
        <ServiceCard title="Workshops & Talks" subtitle="Teaching" href="/contact" cta="Inquire">Hands-on workshops, talks, and training for teams.</ServiceCard>
        <ServiceCard title="Mentoring" subtitle="1:1" href="/contact" cta="Book a Session">Long-form mentoring and portfolio reviews for early professionals.</ServiceCard>
      </div>
    </section>
  )
}
