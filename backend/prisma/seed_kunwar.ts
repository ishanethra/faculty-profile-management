import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data for Dr. Kunwar Singh...');

  const user = await prisma.user.findUnique({
    where: { email: 'kunwar@nitt.edu' }
  });

  if (!user) {
    console.error('User kunwar@nitt.edu not found. Please run the main seed first.');
    return;
  }

  const profile = await prisma.facultyProfile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) {
    console.error('Faculty profile for kunwar@nitt.edu not found.');
    return;
  }

  // Update Profile Basics
  await prisma.facultyProfile.update({
    where: { id: profile.id },
    data: {
      name: "Dr. Kunwar Singh",
      designation: "Associate Professor",
      phone: "0431-2503212",
      researchTags: "Cryptography, Network Security, Blockchain, Smart Contracts, Lattice-based Cryptography",
      scholarLink: "https://scholar.google.com/citations?user=...&hl=en", // Placeholder
      office: "Room No : CSE 205",
      phdGuidance: true,
      collaboration: true,
      consultancy: true,
    }
  });

  // Clear existing relations to avoid duplicates if re-run
  await prisma.education.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.experience.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.responsibility.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.invitedTalk.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.phDGuided.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.membership.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.foreignVisit.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.publication.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.project.deleteMany({ where: { facultyProfileId: profile.id } });
  await prisma.award.deleteMany({ where: { facultyProfileId: profile.id } });

  // Education
  await prisma.education.createMany({
    data: [
      { facultyProfileId: profile.id, degree: "PhD", institution: "IIT Madras", year: 2015, details: "CGPA-8.25, Computer Science" },
      { facultyProfileId: profile.id, degree: "MTech", institution: "JNU New Delhi", year: 2001, details: "First / 6.9, Computer Science" },
    ]
  });

  // Experience
  await prisma.experience.createMany({
    data: [
      { facultyProfileId: profile.id, title: "Lecturer", organization: "AEC Agra, SGI group", from: "August 2004", to: "August 2006" },
      { facultyProfileId: profile.id, title: "Assistant Professor", organization: "NIT Trichy", from: "September 2006", to: "Till now" },
    ]
  });

  // Responsibilities
  await prisma.responsibility.createMany({
    data: [
      { facultyProfileId: profile.id, position: "Member, anti-ragging Committee", organization: "NIT Trichy", from: "July 2016", to: "Present", type: "INTERNAL" },
      { facultyProfileId: profile.id, position: "Member, Community Radio station (CRS)-Programme", organization: "NIT Trichy", from: "November 2016", to: "Present", type: "INTERNAL" },
      { facultyProfileId: profile.id, position: "Member, MTech project committee", organization: "CSE Department", from: "July 2016", to: "May 2016", type: "INTERNAL" },
      { facultyProfileId: profile.id, position: "Reviewer of question papers", organization: "Pondicherry University", from: "18th October", to: "", type: "EXTERNAL" },
      { facultyProfileId: profile.id, position: "External Examiner", organization: "NIT Karaikal", from: "30th November", to: "", type: "EXTERNAL" },
    ]
  });

  // PhDs Guided
  await prisma.phDGuided.createMany({
    data: [
      { facultyProfileId: profile.id, studentName: "Koteswararao CH", thesisTitle: "Secure Multi-party Computation", role: "Supervisor", year: 2021 },
    ]
  });

  // Memberships
  await prisma.membership.createMany({
    data: [
      { facultyProfileId: profile.id, type: "Life Member", organization: "Cryptology Research Society of India", membershipNo: "417" },
      { facultyProfileId: profile.id, type: "Life Member", organization: "IEEE", membershipNo: "" },
    ]
  });

  // Foreign Visits
  await prisma.foreignVisit.createMany({
    data: [
      { facultyProfileId: profile.id, country: "Japan", duration: "November 8-9", purpose: "To present a paper at the international conference MIST 2012" },
      { facultyProfileId: profile.id, country: "South Korea", duration: "October 24-25", purpose: "To present a paper at the international conference MIST 2013" },
      { facultyProfileId: profile.id, country: "Indonesia", duration: "April 14-17", purpose: "To present a paper at the international conference AsiaARES 2014" },
      { facultyProfileId: profile.id, country: "Australia", duration: "December 10-14", purpose: "To present a paper at the international conference ISPEC/MONAMI 2017" },
      { facultyProfileId: profile.id, country: "Philippines", duration: "October 21-23", purpose: "To present a paper at the international conference MobiSec 2018" },
    ]
  });

  // Projects
  await prisma.project.createMany({
    data: [
      { facultyProfileId: profile.id, title: "Research and Development of Lightweight Stream Cipher", fundingAgency: "DST", amount: "", duration: "Jan 2018 - June 2022", status: "Completed" },
      { facultyProfileId: profile.id, title: "Research and Development of Secure and Privacy Preserving Blockchain based Smart Contract and its Applications", fundingAgency: "SERB", amount: "", duration: "Feb 2022 - Feb 2025", status: "Ongoing" },
    ]
  });

  // Awards
  await prisma.award.createMany({
    data: [
      { facultyProfileId: profile.id, title: "Best Paper Award", awardedBy: "MIST 2013, Busan, South Korea", year: 2013 },
      { facultyProfileId: profile.id, title: "TCS Best B.Tech project award", awardedBy: "TCS", year: 2017 },
    ]
  });

  // Publications
  await prisma.publication.createMany({
    data: [
      { facultyProfileId: profile.id, title: "Theoretical Analysis of Biases in TLS Encryption Scheme Chacha 128", authors: "Kunwar Singh, Karthika S K", venue: "Int. J. of Ad Hoc and Ubiquitous Computing (IJAHUC) (SCI)", year: 2022 },
      { facultyProfileId: profile.id, title: "Improved related-cipher attack on Salsa and ChaCha", authors: "Kunwar Singh, KKC Deepti, S. K. Karthika", venue: "International journal information technology, Springer", year: 2022 },
      { facultyProfileId: profile.id, title: "Oblivious Stable Sorting Protocol and Oblivious Binary Search Protocol for Secure Multi-party Computation", authors: "Kunwar Singh Ch Koteswara Rao", venue: "Journal of High-Speed Networks", year: 2021 },
      { facultyProfileId: profile.id, title: "A Privacy Preserving Framework for Endorsement Process in Hyperledger Fabric", authors: "Kunwar Singh, S Mercy Shalinie, Dharani J, K Sundarakantham", venue: "Computers Security", year: 2022 },
      { facultyProfileId: profile.id, title: "Lattice-based Unidirectional PRE and PRE+ Schemes", authors: "Kunwar Singh, C. Pandu Rangan, Richa Agarwal, Samir Sheshank", venue: "IET Information Security (SCI)", year: 2020 },
      { facultyProfileId: profile.id, title: "Provably Secure Lattice-Based Identity Based Unidirectional PRE and PRE+ Schemes", authors: "Kunwar Singh, C. Pandu Rangan, Richa Agarwal, Samir Sheshank", venue: "Journal of Information Security and Applications (SCI)", year: 2020 },
    ]
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
