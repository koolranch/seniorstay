import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const communities = await prisma.community.findMany({ take: 1 })
  console.log('✅ Connected successfully. Sample community:', communities)
}

main().catch((e) => {
  console.error('❌ Prisma connection failed:', e)
  process.exit(1)
}) 