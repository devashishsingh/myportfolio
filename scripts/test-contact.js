// Simple Node script to POST to the local contact API for testing
// Uses built-in fetch available in Node 18+

async function run(){
  const res = await fetch('http://localhost:8000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', message: 'This is a test from local script.' })
  })
  const data = await res.json()
  console.log('Status:', res.status)
  console.log('Response:', data)
}

run().catch(err=>{ console.error(err); process.exit(1) })
