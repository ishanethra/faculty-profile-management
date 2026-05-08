import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'kunwar@nitt.edu';
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create/Find Department
  const dept = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: {
      name: 'Computer Science and Engineering',
      code: 'CSE'
    }
  });

  // 2. Create/Find User
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'FACULTY' },
    create: {
      email,
      password: hashedPassword,
      role: 'FACULTY'
    }
  });

  // 3. Create/Update Faculty Profile
  const profile = await prisma.facultyProfile.upsert({
    where: { userId: user.id },
    update: {
      name: 'Dr. Kunwar Singh',
      designation: 'Associate Professor',
      office: 'Room 204, CSE Dept',
      phone: '0431-2503212',
      researchTags: 'Cryptography, Network Security, Blockchain',
      scholarLink: 'https://scholar.google.com/citations?user=xyz',
      linkedinLink: 'https://linkedin.com/in/kunwarsingh',
      orcid: '0000-0002-1234-5678',
      phdGuidance: true,
      collaboration: true,
      consultancy: true,
      profileCompletion: 95,
      departmentId: dept.id
    },
    create: {
      userId: user.id,
      name: 'Dr. Kunwar Singh',
      designation: 'Associate Professor',
      office: 'Room 204, CSE Dept',
      phone: '0431-2503212',
      researchTags: 'Cryptography, Network Security, Blockchain, Artificial Intelligence, Machine Learning',
      scholarLink: 'https://scholar.google.com/citations?user=xyz',
      linkedinLink: 'https://linkedin.com/in/kunwarsingh',
      orcid: '0000-0002-1234-5678',
      phdGuidance: true,
      collaboration: true,
      consultancy: true,
      profileCompletion: 95,
      departmentId: dept.id
    }
  });

  const profileId = profile.id;

  // Clear existing details to avoid duplicates
  await prisma.education.deleteMany({ where: { facultyProfileId: profileId } });
  await prisma.experience.deleteMany({ where: { facultyProfileId: profileId } });
  await prisma.responsibility.deleteMany({ where: { facultyProfileId: profileId } });
  await prisma.membership.deleteMany({ where: { facultyProfileId: profileId } });

  // 4. Seed Education
  await prisma.education.createMany({
    data: [
      {
        facultyProfileId: profileId,
        degree: 'PhD',
        institution: 'IIT Madras',
        year: 2015,
        details: 'CGPA-8.25, Subjects: Computer Science'
      },
      {
        facultyProfileId: profileId,
        degree: 'MTech',
        institution: 'JNU New Delhi',
        year: 2001,
        details: 'First / 6.9, Subjects: Computer Science'
      }
    ]
  });

  // 5. Seed Experience
  await prisma.experience.createMany({
    data: [
      {
        facultyProfileId: profileId,
        title: 'Assistant Professor',
        organization: 'NIT Trichy',
        from: 'September 2006',
        to: 'Till now'
      },
      {
        facultyProfileId: profileId,
        title: 'Lecturer',
        organization: 'AEC Agra, SGI group',
        from: 'August 2004',
        to: 'August 2006'
      }
    ]
  });

  // 6. Seed Responsibilities
  await prisma.responsibility.createMany({
    data: [
      {
        facultyProfileId: profileId,
        position: 'Head of the Department',
        organization: 'NIT Trichy',
        from: 'July 2023',
        to: 'Till now',
        type: 'INTERNAL'
      },
      {
        facultyProfileId: profileId,
        position: 'Member, anti-ragging Committee',
        organization: 'NIT Trichy',
        from: 'July 2016',
        to: '',
        type: 'INTERNAL'
      },
      {
        facultyProfileId: profileId,
        position: 'Member, Community Radio station (CRS)-Programme',
        organization: 'NIT Trichy',
        from: 'November 2016',
        to: '',
        type: 'INTERNAL'
      },
      {
        facultyProfileId: profileId,
        position: 'Reviewer of question papers',
        organization: 'Pondicherry University',
        from: '2015',
        to: '',
        type: 'EXTERNAL'
      }
    ]
  });

  // 7. Seed Membership
  await prisma.membership.createMany({
    data: [
      {
        facultyProfileId: profileId,
        type: 'Life Member',
        organization: 'Computer Society of India (CSI)'
      },
      {
        facultyProfileId: profileId,
        type: 'Member',
        organization: 'IEEE'
      }
    ]
  });

  console.log('Seeded details for Dr. Kunwar Singh successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
