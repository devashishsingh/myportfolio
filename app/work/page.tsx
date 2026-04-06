import ProjectCard from '../../components/ProjectCard'
import projects from '../../data/projects.json'

export default function Work(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <p className="muted-label" style={{ marginBottom: 8 }}>Proof of Execution</p>
      <h1 className="display-font text-4xl">Ideas Brought to Life</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">Real-world platforms, MVPs, and problem-solving systems built through AI-assisted development and low-cost cloud-first execution.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        {projects.map((p, i) => (
          <ProjectCard key={i} title={p.title} category={p.category} excerpt={p.excerpt} href={p.href} tech={p.tech} />
        ))}
      </div>
    </section>
  )
}
