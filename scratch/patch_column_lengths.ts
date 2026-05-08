import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database column patch...');

  try {
    // Patch PendingChange.changeData
    console.log('Patching PendingChange.changeData to LONGTEXT...');
    await prisma.$executeRawUnsafe(
      'ALTER TABLE `PendingChange` MODIFY `changeData` LONGTEXT NOT NULL'
    );
    console.log('Successfully patched PendingChange.changeData');

    // Patch AuditLog.details
    console.log('Patching AuditLog.details to LONGTEXT...');
    await prisma.$executeRawUnsafe(
      'ALTER TABLE `AuditLog` MODIFY `details` LONGTEXT NOT NULL'
    );
    console.log('Successfully patched AuditLog.details');

    // Patch FacultyProfile.researchTags
    console.log('Patching FacultyProfile.researchTags to TEXT...');
    await prisma.$executeRawUnsafe(
      'ALTER TABLE `FacultyProfile` MODIFY `researchTags` TEXT NOT NULL'
    );
    console.log('Successfully patched FacultyProfile.researchTags');

  } catch (error) {
    console.error('Error during patching:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
