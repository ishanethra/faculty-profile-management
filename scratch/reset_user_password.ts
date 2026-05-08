import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.toLowerCase();
  const password = process.argv[3] || 'password123';

  if (!email || !email.endsWith('@nitt.edu')) {
    throw new Error('Usage: npm --workspace backend run db:reset:user -- user@nitt.edu newPassword');
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { facultyProfile: true },
  });

  if (!user) {
    throw new Error(`No user found for ${email}`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  console.log(`Password reset for ${email}`);
  console.log(`Name: ${user.facultyProfile?.name ?? 'No profile'}`);
  console.log(`Role: ${user.role}`);
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
