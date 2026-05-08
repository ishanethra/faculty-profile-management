import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      facultyProfile: { select: { id: true, name: true, isPublic: true } },
    },
  });

  const userIds = users.map((user) => user.id);
  const nonPublicProfileIds = users
    .map((user) => user.facultyProfile)
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile) && !profile.isPublic)
    .map((profile) => profile.id);

  console.log(
    'Registered users to delete:',
    users.map((user) => ({ email: user.email, profile: user.facultyProfile?.name || null }))
  );

  if (users.length === 0) {
    console.log('Nothing to clear.');
    return;
  }

  await prisma.$transaction([
    prisma.pendingChange.deleteMany({ where: { facultyProfileId: { in: nonPublicProfileIds } } }),
    prisma.auditLog.deleteMany({ where: { userId: { in: userIds } } }),
    prisma.facultyProfile.deleteMany({ where: { id: { in: nonPublicProfileIds } } }),
    prisma.facultyProfile.updateMany({ where: { userId: { in: userIds } }, data: { userId: null } }),
    prisma.user.deleteMany({ where: { id: { in: userIds } } }),
  ]);

  console.log('Deleted registered users:', users.length);
  console.log('Deleted non-public self-created profiles:', nonPublicProfileIds.length);
  console.log('Public official profiles were kept and detached from login accounts.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
