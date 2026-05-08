import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = process.argv[2] || 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.user.updateMany({
    where: {
      role: { in: ['FACULTY', 'HOD'] },
    },
    data: {
      password: hashedPassword,
    },
  });

  console.log(`Reset ${result.count} faculty/HOD password(s) to ${password}`);
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
