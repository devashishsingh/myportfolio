import profile from '../../data/profile.json'

export default function About(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">About</h1>
      <p className="mt-6 max-w-3xl text-gray-700">{profile.summary}</p>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Teaching & Tutorials</h2>
        <ul className="mt-4 list-disc pl-6 text-gray-700">
          {profile.teachingLinks.map((t, i) => (
            <li key={i} className="mt-2">
              {t.url ? <a href={t.url} className="underline" target="_blank">{t.title}</a> : <span>{t.title} — <em className="text-sm">(add URL in data/profile.json)</em></span>}
              {t.note ? <div className="text-sm text-gray-500">{t.note}</div> : null}
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">Courses</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          {profile.courses.map((c, i) => (
            <div key={i} className="p-4 border">
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-gray-600">{c.provider} {c.year ? `• ${c.year}` : ''}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-2xl font-semibold">Experience</h2>
        <div className="mt-4 space-y-4">
          {profile.experience.map((e, i) => (
            <div key={i} className="p-4 border">
              <div className="font-semibold">{e.title} — {e.company}</div>
              <div className="text-sm text-gray-600">{e.dates}</div>
              <div className="mt-2 text-gray-700">{e.summary}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">Certifications</h3>
            <ul className="mt-3 list-disc pl-6 text-gray-700">
              {profile.certifications.length ? profile.certifications.map((c,i)=>(<li key={i}>{c}</li>)) : <li><em>Add certifications in data/profile.json</em></li>}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Education</h3>
            <ul className="mt-3 list-disc pl-6 text-gray-700">
              {profile.education.length ? profile.education.map((ed,i)=>(<li key={i}>{ed}</li>)) : <li><em>Add education entries in data/profile.json</em></li>}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
