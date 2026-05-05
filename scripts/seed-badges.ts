// Seed Badge catalog. Idempotent — safe to re-run.
// Run with: npx tsx scripts/seed-badges.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const BADGES = [
  // Founding
  { slug: 'founding-50', name: 'Founding 50', category: 'founding', tier: null, description: 'One of the first 50 approved members of the Builders Hub.', iconEmoji: '🌱' },
  { slug: 'og-builder', name: 'OG Builder', category: 'founding', tier: null, description: 'Joined within the first 6 months.', iconEmoji: '🪧' },

  // Contributor tiers
  { slug: 'first-post', name: 'First Post', category: 'contributor', tier: 1, description: 'Published your first post in the community.', iconEmoji: '📝' },
  { slug: 'builder-1', name: 'Builder I', category: 'contributor', tier: 1, description: 'Earned 100 Builder Points.', iconEmoji: '🥉' },
  { slug: 'builder-2', name: 'Builder II', category: 'contributor', tier: 2, description: 'Earned 1,000 Builder Points.', iconEmoji: '🥈' },
  { slug: 'builder-3', name: 'Builder III', category: 'contributor', tier: 3, description: 'Earned 5,000 Builder Points.', iconEmoji: '🥇' },
  { slug: 'builder-4', name: 'Builder IV', category: 'contributor', tier: 4, description: 'Earned 10,000 Builder Points.', iconEmoji: '🏆' },
  { slug: 'helper', name: 'Helper', category: 'contributor', tier: null, description: '10 marked-helpful answers.', iconEmoji: '🤝' },
  { slug: 'mentor', name: 'Mentor', category: 'contributor', tier: null, description: 'Mentored 3 members through reviews or 1:1 sessions.', iconEmoji: '🧭' },
  { slug: 'curator', name: 'Curator', category: 'contributor', tier: null, description: 'Shared 10 resources saved by others.', iconEmoji: '📚' },

  // Skill tracks (tier 1 = Apprentice)
  { slug: 'cyber-apprentice', name: 'Cyber Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier cybersecurity challenge.', iconEmoji: '🛡️' },
  { slug: 'ai-apprentice', name: 'AI Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier AI challenge.', iconEmoji: '🤖' },
  { slug: 'cloud-apprentice', name: 'Cloud Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier cloud challenge.', iconEmoji: '☁️' },
  { slug: 'systems-apprentice', name: 'Systems Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier systems challenge.', iconEmoji: '🖥️' },
  { slug: 'networks-apprentice', name: 'Networks Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier networks challenge.', iconEmoji: '🕸️' },
  { slug: 'coding-apprentice', name: 'Coding Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier coding challenge.', iconEmoji: '⌨️' },
  { slug: 'gaming-apprentice', name: 'Gaming Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier gaming challenge.', iconEmoji: '🎮' },
  { slug: 'digital-apprentice', name: 'Digital Apprentice', category: 'skill', tier: 1, description: 'Completed entry-tier digital transformation challenge.', iconEmoji: '🚀' },
]

async function main() {
  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: { name: b.name, category: b.category, tier: b.tier, description: b.description, iconEmoji: b.iconEmoji, active: true },
      create: b,
    })
  }
  const count = await prisma.badge.count()
  console.log(`✅ Seeded badges. Total in catalog: ${count}`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
