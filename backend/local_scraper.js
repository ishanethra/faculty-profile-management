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

const localFiles = {
    'cse': '/Users/nethra/.gemini/antigravity/brain/e2aa8225-1c72-40fa-b703-64c06a79c063/.system_generated/steps/197/content.md',
    'ece': '/Users/nethra/.gemini/antigravity/brain/e2aa8225-1c72-40fa-b703-64c06a79c063/.system_generated/steps/198/content.md',
    'mech': '/Users/nethra/.gemini/antigravity/brain/e2aa8225-1c72-40fa-b703-64c06a79c063/.system_generated/steps/200/content.md',
    'civil': '/Users/nethra/.gemini/antigravity/brain/e2aa8225-1c72-40fa-b703-64c06a79c063/.system_generated/steps/201/content.md',
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
        console.log(`Processing ${name} (${code})...`);
        output += `\n  // ${name} Department\n`;
        output += `  const dept_${code} = await prisma.department.upsert({\n`;
        output += `    where: { code: '${code}' },\n`;
        output += `    update: {},\n`;
        output += `    create: { name: '${name}', code: '${code}' },\n`;
        output += `  })\n\n`;

        let text = '';
        if (localFiles[code] && fs.existsSync(localFiles[code])) {
            text = fs.readFileSync(localFiles[code], 'utf-8');
        }

        const faculties = [];
        
        if (text) {
            // Regex to match markdown links starting with - [Dr., - [Prof., - [Mr., - [Ms.
            const regex = /-\s+\[((?:Dr\.|Prof\.|Mr\.|Ms\.)[^\]]+)\]/g;
            let match;
            while ((match = regex.exec(text)) !== null) {
                const name = match[1].trim().replace(/\s+/g, ' ');
                if (!faculties.includes(name) && name.length > 4) {
                    faculties.push(name);
                }
            }
        }

        if (faculties.length === 0) {
            // Dummy users for departments without local data
            for (let i = 1; i <= 5; i++) {
                faculties.push(`Dr. Dummy ${i} ${code.toUpperCase()}`);
            }
        }

        faculties.forEach((facultyName, i) => {
            let emailBase = facultyName.split(' ').pop().toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5);
            // ensure email is not empty
            if (!emailBase) emailBase = 'fac';
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
    }

    output += seed_file_footer;
    fs.writeFileSync('prisma/seed.ts', output);
    console.log('Successfully generated prisma/seed.ts');
}

scrape();
