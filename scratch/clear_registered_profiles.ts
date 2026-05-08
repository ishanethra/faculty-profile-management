import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.facultyProfile.findMany({
    where: { isPublic: false },
    select: {
      id: true,
      userId: true,
      name: true,
      user: { select: { email: true } },
    },
  });

  const profileIds = profiles.map((profile) => profile.id);
  const userIds = profiles.map((profile) => profile.userId);

  console.log(
    'Registered non-public profiles to delete:',
    profiles.map((profile) => ({ name: profile.name, email: profile.user.email }))
  );

  if (profiles.length === 0) {
    console.log('Nothing to clear.');
    return;
  }

  await prisma.$transaction([
    prisma.pendingChange.deleteMany({ where: { facultyProfileId: { in: profileIds } } }),
    prisma.auditLog.deleteMany({ where: { userId: { in: userIds } } }),
    prisma.user.deleteMany({ where: { id: { in: userIds } } }),
  ]);

  console.log('Deleted registered profiles/users:', profiles.length);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
