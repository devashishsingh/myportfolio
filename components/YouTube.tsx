export function YouTube({ url }: { url: string }) {
  let videoId = ''
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v') || ''
    } else if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1)
    }
  } catch {
    return <p>Invalid video URL</p>
  }

  if (!videoId) return <p>Invalid video URL</p>

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', margin: '24px 0' }}>
      <iframe
        src={`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    </div>
  )
}
