// One-off: delete all workshop registrations from the database.
// Usage: node -r dotenv/config scripts/reset-workshop.js dotenv_config_path=.env
// (Or ensure DATABASE_URL is in the current shell environment.)

const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    const before = await prisma.lead.count({ where: { source: 'workshop' } })
    const result = await prisma.lead.deleteMany({ where: { source: 'workshop' } })
    const after = await prisma.lead.count({ where: { source: 'workshop' } })
    console.log(JSON.stringify({ before, deleted: result.count, after }, null, 2))
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
