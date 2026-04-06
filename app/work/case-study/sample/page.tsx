export const metadata = {
  title: 'Case Study — Sample Project',
  description: 'A short editorial case study describing problem, approach and outcomes.',
  openGraph: {
    title: 'Case Study — Sample Project',
    description: 'A short editorial case study describing problem, approach and outcomes.',
    images: ['/images/sample-hero.png']
  }
}

export default function SampleCase(){
  return (
    <section className="container-wide">
      <h1 className="display-font text-4xl">Sample Project — Improving Conversion</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">This case study outlines the problem, approach, design decisions, and outcomes in a concise editorial format.</p>

      <div className="mt-8">
        <img src="/images/sample-hero.png" alt="Sample project hero" className="w-full rounded-sm" />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold">The Challenge</h2>
        <p className="mt-3 text-gray-700">Conversion rates were stagnant despite solid traffic. The product lacked clarity on key user journeys and messaging hierarchy.</p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="font-semibold">Research</h3>
          <p className="mt-3 text-gray-700">We ran qualitative interviews and funnel analysis to identify drop-off points and messaging confusion.</p>
          <img src="/images/sample-process-1.png" alt="research snapshot" className="mt-6 w-full rounded-sm" />
        </div>
        <div>
          <h3 className="font-semibold">Design & Strategy</h3>
          <p className="mt-3 text-gray-700">Refined value propositions, simplified onboarding steps, and introduced clearer CTAs aligned to user intent.</p>
          <img src="/images/sample-process-2.png" alt="design snapshot" className="mt-6 w-full rounded-sm" />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-semibold">Outcome</h3>
        <p className="mt-3 text-gray-700">After iterative testing, conversion increased by an estimated 18% over three months. The product clarity improvements also reduced support tickets.</p>
        <img src="/images/sample-result.png" alt="results" className="mt-6 w-full rounded-sm" />
      </div>
    </section>
  )
}
