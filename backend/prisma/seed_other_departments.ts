import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Dept = { code: string; name: string; urls: string[] };

const departments: Dept[] = [
  { code: 'architecture', name: 'Architecture', urls: ['https://www.nitt.edu/home/academics/departments/architecture/people/faculty/', 'https://www.nitt.edu/home/academics/departments/architecture/faculty/'] },
  { code: 'cecase', name: 'CECASE', urls: ['https://www.nitt.edu/home/academics/departments/cecase/faculty/'] },
  { code: 'chem', name: 'Chemical Engineering', urls: ['https://www.nitt.edu/home/academics/departments/chem/chemfaculty/', 'https://www.nitt.edu/home/academics/departments/chem/faculty/'] },
  { code: 'chemistry', name: 'Chemistry', urls: ['https://www.nitt.edu/academics/departments/chemistry/Faculty/', 'https://www.nitt.edu/home/academics/departments/chemistry/Faculty/'] },
  { code: 'civil', name: 'Civil Engineering', urls: ['https://www.nitt.edu/home/academics/departments/civil/faculty/'] },
  { code: 'ca', name: 'Computer Applications', urls: ['https://www.nitt.edu/home/academics/departments/ca/faculty/'] },
  { code: 'dee', name: 'Energy and Environment', urls: ['https://www.nitt.edu/home/academics/departments/dee/faculty/'] },
  { code: 'eee', name: 'Electrical and Electronics Engineering', urls: ['https://www.nitt.edu/home/academics/departments/eee/faculty/'] },
  { code: 'humanities', name: 'Humanities and Social Sciences', urls: ['https://www.nitt.edu/home/academics/departments/humanities/faculty/'] },
  { code: 'ice', name: 'Instrumentation and Control Engineering', urls: ['https://www.nitt.edu/home/academics/departments/ice/faculty/'] },
  { code: 'management', name: 'Management Studies', urls: ['https://www.nitt.edu/home/academics/departments/management/faculty/'] },
  { code: 'maths', name: 'Mathematics', urls: ['https://www.nitt.edu/home/academics/departments/maths/faculty/'] },
  { code: 'mech', name: 'Mechanical Engineering', urls: ['https://www.nitt.edu/home/academics/departments/mech/faculty/'] },
  { code: 'meta', name: 'Metallurgical and Materials Engineering', urls: ['https://www.nitt.edu/home/academics/departments/meta/faculty/'] },
  { code: 'physics', name: 'Physics', urls: ['https://www.nitt.edu/home/academics/departments/physics/faculty/'] },
  { code: 'prod', name: 'Production Engineering', urls: ['https://www.nitt.edu/home/academics/departments/prod/faculty/'] },
];

type ParsedFaculty = {
  name: string;
  designation: string;
  email: string;
  phone: string;
  researchTags: string;
  profileImage: string;
};

function clean(s: string): string {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function normalizeName(name: string): string {
  let n = clean(name);
  n = n.replace(/^Dr\s*\.?\s*/i, 'Dr. ');
  n = n.replace(/^Prof\s*\.?\s*/i, 'Prof. ');
  n = n.replace(/^Mr\s*\.?\s*/i, 'Mr. ');
  n = n.replace(/^Ms\s*\.?\s*/i, 'Ms. ');
  return n;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20);
}

function inferDesignation(block: string): string {
  const b = block.toLowerCase();
  if (b.includes('professor (hag') || b.includes('hag')) return 'Professor (HAG)';
  if (b.includes('associate professor')) return 'Associate Professor';
  if (b.includes('assistant professor')) return 'Assistant Professor';
  if (b.includes('professor')) return 'Professor';
  if (b.includes('head of the department') || b.includes('hod')) return 'Head of Department';
  return 'Faculty';
}

function extractText(html: string): string[] {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|td|tr|div)>/gi, '\n');
  const noTags = withBreaks.replace(/<[^>]*>/g, ' ');
  return noTags
    .split('\n')
    .map((l) => clean(l))
    .filter((l) => l.length > 0);
}

function parseFaculty(html: string, deptName: string): ParsedFaculty[] {
  const lines = extractText(html);
  const nameRegex = /^(Dr\.|Prof\.|Mr\.|Ms\.)\s*.+/i;

  const entries: ParsedFaculty[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!nameRegex.test(line)) continue;

    const name = normalizeName(line);
    if (name.length < 6) continue;

    const blockLines: string[] = [line];
    let j = i + 1;
    while (j < lines.length && !nameRegex.test(lines[j])) {
      const stop = /^(Faculty|Supporting Staff|Academic Programmes|Research Programmes|Publications|Projects|Events|Contact|Webteam)$/i.test(lines[j]);
      if (stop) break;
      blockLines.push(lines[j]);
      if (blockLines.length > 18) break;
      j++;
    }

    const block = blockLines.join(' ');
    const emailMatch = block.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    const phoneMatch = block.match(/(?:\+?91[-\s]?)?(?:\d[\d\s-]{7,}\d)/);

    const designation = inferDesignation(block);

    let research = block
      .replace(/^[^A-Za-z]*Dr\.[^A-Za-z]+/i, '')
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '')
      .replace(/(?:\+?91[-\s]?)?(?:\d[\d\s-]{7,}\d)/g, '')
      .replace(/Email\s*:?/gi, '')
      .replace(/Phone\s*:?/gi, '')
      .replace(/Professor \(HAG\)|Professor|Associate Professor|Assistant Professor|Head of the Department|HOD/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (research.length > 190) research = research.slice(0, 190);

    entries.push({
      name,
      designation,
      email: emailMatch ? emailMatch[0].toLowerCase() : '',
      phone: phoneMatch ? phoneMatch[0].trim() : '',
      researchTags: research,
      profileImage: '',
    });

    i = j - 1;
  }

  // fallback: extract names from links if nothing parsed
  if (entries.length === 0) {
    const linkRegex = /<a[^>]*>(Dr\.?[^<]+|Prof\.?[^<]+|Mr\.?[^<]+|Ms\.?[^<]+)<\/a>/gi;
    const names = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = linkRegex.exec(html)) !== null) {
      names.add(normalizeName(m[1]));
    }
    for (const name of names) {
      entries.push({
        name,
        designation: 'Faculty',
        email: '',
        phone: '',
        researchTags: '',
        profileImage: '',
      });
    }
  }

  // dedupe by email, else name
  const by = new Map<string, ParsedFaculty>();
  for (const e of entries) {
    const key = e.email || e.name.toLowerCase();
    const prev = by.get(key);
    if (!prev || e.researchTags.length > prev.researchTags.length) by.set(key, e);
  }

  return [...by.values()];
}

async function fetchPage(urls: string[]): Promise<string> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) continue;
      const html = await res.text();
      if (html && html.length > 1000) return html;
    } catch {}
  }
  return '';
}

async function main() {
  for (const dept of departments) {
    console.log(`Processing ${dept.code}...`);

    const department = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name },
      create: { code: dept.code, name: dept.name },
    });

    const html = await fetchPage(dept.urls);
    if (!html) {
      console.log(`No page content for ${dept.code}`);
      continue;
    }

    const faculties = parseFaculty(html, dept.name);
    console.log(`Found ${faculties.length} faculty candidates for ${dept.code}`);

    for (const f of faculties) {
      const email = f.email || `${slugify(f.name)}.${dept.code}@nitt.edu`;
      const deptLabel = `Department of ${dept.name}, NIT Trichy`;

      const existingProfile = await prisma.facultyProfile.findFirst({
        where: {
          OR: [
            { officialEmail: email },
            { user: { email } },
            { departmentId: department.id, name: f.name },
          ],
        },
      });

      if (existingProfile) {
        await prisma.facultyProfile.update({
          where: { id: existingProfile.id },
          data: {
          departmentId: department.id,
          officialEmail: email,
          name: f.name,
          designation: f.designation,
          phone: f.phone,
          office: deptLabel,
          profileImage: f.profileImage,
          researchTags: (f.researchTags || '').slice(0, 190),
          profileCompletion: 80,
          isPublic: true,
          },
        });
      } else {
        await prisma.facultyProfile.create({
          data: {
          officialEmail: email,
          departmentId: department.id,
          name: f.name,
          designation: f.designation,
          phone: f.phone,
          office: deptLabel,
          profileImage: f.profileImage,
          researchTags: (f.researchTags || '').slice(0, 190),
          profileCompletion: 80,
          isPublic: true,
          },
        });
      }
    }
  }

  console.log('Non-CSE/ECE faculty update completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
