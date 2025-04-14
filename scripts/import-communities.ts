import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import slugify from 'slugify';

const prisma = new PrismaClient();

const csvPath = path.join(process.cwd(), 'NE Ohio - Sheet1.csv');

async function importCommunities() {
  const communities: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (!row['Community Name']) return;

        const name = row['Community Name'].trim();
        const city = row['City']?.trim() || '';
        const state = row['State']?.trim() || 'OH';
        const slug = slugify(`${name}-${city}-${state}`, { lower: true });
        const address = row['Address']?.trim() || '';
        const services = row['Services']?.trim() || '';

        communities.push({ name, city, state, slug, address, services });
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });

  for (const data of communities) {
    await prisma.community.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
  }

  console.log(`✅ Imported ${communities.length} communities`);
}

importCommunities()
  .catch((err) => {
    console.error('❌ Import failed:', err);
  })
  .finally(() => prisma.$disconnect()); 