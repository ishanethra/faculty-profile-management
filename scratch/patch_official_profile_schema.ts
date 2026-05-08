import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Row = Record<string, any>;

async function columnExists(tableName: string, columnName: string) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
    LIMIT 1
    `,
    tableName,
    columnName
  );

  return rows.length > 0;
}

async function indexExists(tableName: string, indexName: string) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT INDEX_NAME
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND INDEX_NAME = ?
    LIMIT 1
    `,
    tableName,
    indexName
  );

  return rows.length > 0;
}

async function getUserIdForeignKey() {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT CONSTRAINT_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'FacultyProfile'
      AND COLUMN_NAME = 'userId'
      AND REFERENCED_TABLE_NAME = 'User'
    LIMIT 1
    `
  );

  return rows[0]?.CONSTRAINT_NAME as string | undefined;
}

async function main() {
  if (!(await columnExists('FacultyProfile', 'officialEmail'))) {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE `FacultyProfile` ADD COLUMN `officialEmail` VARCHAR(191) NULL'
    );
    console.log('Added FacultyProfile.officialEmail');
  } else {
    console.log('FacultyProfile.officialEmail already exists');
  }

  const foreignKey = await getUserIdForeignKey();
  if (foreignKey) {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`FacultyProfile\` DROP FOREIGN KEY \`${foreignKey}\``);
    console.log(`Dropped FacultyProfile userId foreign key ${foreignKey}`);
  }

  await prisma.$executeRawUnsafe('ALTER TABLE `FacultyProfile` MODIFY `userId` VARCHAR(191) NULL');
  console.log('Made FacultyProfile.userId nullable');

  if (foreignKey) {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE `FacultyProfile` ADD CONSTRAINT `FacultyProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE'
    );
    console.log('Recreated FacultyProfile userId foreign key with ON DELETE SET NULL');
  }

  if (!(await indexExists('FacultyProfile', 'FacultyProfile_officialEmail_key'))) {
    await prisma.$executeRawUnsafe(
      'CREATE UNIQUE INDEX `FacultyProfile_officialEmail_key` ON `FacultyProfile`(`officialEmail`)'
    );
    console.log('Added unique index FacultyProfile_officialEmail_key');
  } else {
    console.log('FacultyProfile_officialEmail_key already exists');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
