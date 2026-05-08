const fs = require('fs');

const departments = {
    'architecture': 'Architecture',
    'cecase': 'CECASE',
    'chem': 'Chemical Engineering',
    'chemistry': 'Chemistry',
    'civil': 'Civil Engineering',
    'ca': 'Computer Applications',
    'cse': 'Computer Science & Engineering',
    'dee': 'DEE',
    'eee': 'Electrical & Electronics Engineering',
    'ece': 'Electronics & Communication Engineering',
    'humanities': 'Humanities',
    'ice': 'Instrumentation & control Engineering',
    'management': 'Management Studies',
    'maths': 'Mathematics',
    'mech': 'Mechanical Engineering',
    'meta': 'Metallurgical & Materials Engineering',
    'physics': 'Physics',
    'prod': 'Production Engineering'
};

const seed_file_header = `import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'admin@nitt.edu' },
    update: {},
    create: {
      email: 'admin@nitt.edu',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
`;

const seed_file_footer = `
  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`;

async function scrape() {
    let output = seed_file_header;

    for (const [code, name] of Object.entries(departments)) {
        console.log(`Fetching ${name} (${code})...`);
        output += `\n  // ${name} Department\n`;
        output += `  const dept_${code} = await prisma.department.upsert({\n`;
        output += `    where: { code: '${code}' },\n`;
        output += `    update: {},\n`;
        output += `    create: { name: '${name}', code: '${code}' },\n`;
        output += `  })\n\n`;

        try {
            const res = await fetch(`https://www.nitt.edu/home/academics/departments/${code}/faculty/`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            const text = await res.text();
            
            // Simple regex to extract <a ...>Dr. ...</a> or <a ...>Mr. ...</a>
            const regex = /<a[^>]*>(Dr\.[^<]+|Mr\.[^<]+|Ms\.[^<]+|Prof\.[^<]+)<\/a>/g;
            let match;
            const faculties = [];

            while ((match = regex.exec(text)) !== null) {
                const name = match[1].trim().replace(/\s+/g, ' ');
                if (!faculties.includes(name) && name.length > 4) {
                    faculties.push(name);
                }
            }

            // Fallback if regex fails (some pages might format names differently)
            if (faculties.length === 0) {
                const altRegex = /<a[^>]*>([^<]+)<\/a>/g;
                while ((match = altRegex.exec(text)) !== null) {
                    const altName = match[1].trim().replace(/\s+/g, ' ');
                    if ((altName.startsWith('Dr.') || altName.startsWith('Mr.') || altName.startsWith('Ms.')) && !faculties.includes(altName)) {
                        faculties.push(altName);
                    }
                }
            }

            if (faculties.length === 0) {
                faculties.push(`Dr. Dummy ${code.toUpperCase()}`);
            }

            faculties.forEach((facultyName, i) => {
                let emailBase = facultyName.split(' ').pop().toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5);
                const email = `${emailBase}${i}_${code}@nitt.edu`;
                const safeName = facultyName.replace(/'/g, "\\'");
                const role = i === 0 ? 'HOD' : 'FACULTY';
                
                output += `  await prisma.user.upsert({\n`;
                output += `    where: { email: '${email}' },\n`;
                output += `    update: {},\n`;
                output += `    create: {\n`;
                output += `      email: '${email}',\n`;
                output += `      password: hashedPassword,\n`;
                output += `      role: '${role}',\n`;
                output += `      facultyProfile: {\n`;
                output += `        create: {\n`;
                output += `          departmentId: dept_${code}.id,\n`;
                output += `          name: '${safeName}',\n`;
                output += `          designation: '${role === 'HOD' ? 'Head of Department' : 'Professor'}',\n`;
                output += `          researchTags: 'General, Engineering',\n`;
                output += `          profileCompletion: 50\n`;
                output += `        }\n`;
                output += `      }\n`;
                output += `    },\n`;
                output += `  })\n\n`;
            });

        } catch (e) {
            console.error(`Error fetching ${code}: ${e.message}`);
        }
    }

    output += seed_file_footer;
    fs.writeFileSync('prisma/seed.ts', output);
    console.log('Successfully generated prisma/seed.ts');
}

scrape();
