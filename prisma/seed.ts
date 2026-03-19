import { prisma } from "../src/lib/prisma";
import { UNIVERSITIES } from "../src/lib/universities";

async function main() {
  for (const u of UNIVERSITIES) {
    await prisma.university.upsert({
      where: { slug: u.slug },
      update: {
        name: u.name,
        emailDomain: u.emailDomain,
      },
      create: {
        slug: u.slug,
        name: u.name,
        emailDomain: u.emailDomain,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

