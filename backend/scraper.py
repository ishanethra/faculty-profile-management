import requests
from bs4 import BeautifulSoup
import re

departments = {
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
}

seed_file_header = """const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

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

"""

seed_file_footer = """
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
"""

with open('prisma/seed.ts', 'w') as f:
    f.write(seed_file_header)

    for code, name in departments.items():
        print(f"Fetching {name} ({code})...")
        f.write(f"\n  // {name} Department\n")
        f.write(f"  const dept_{code} = await prisma.department.upsert({{\n")
        f.write(f"    where: {{ code: '{code}' }},\n")
        f.write(f"    update: {{}},\n")
        f.write(f"    create: {{ name: '{name}', code: '{code}' }},\n")
        f.write(f"  }})\n\n")

        try:
            url = f"https://www.nitt.edu/home/academics/departments/{code}/faculty/"
            res = requests.get(url, timeout=10)
            soup = BeautifulSoup(res.text, 'html.parser')

            faculties = []
            
            # Find all links in the main content area that look like faculty names
            content_div = soup.find('div', id='content') or soup.body
            links = content_div.find_all('a')
            
            for link in links:
                text = link.text.strip()
                # Check if it starts with Dr. or contains regular faculty name format
                if text.startswith('Dr') or text.startswith('Mr') or text.startswith('Ms') or text.startswith('Prof'):
                    if text not in faculties and len(text) > 4:
                        faculties.append(text)

            # If no faculties found, just add a dummy
            if not faculties:
                faculties = [f"Dr. Dummy {code.upper()}"]

            for i, faculty_name in enumerate(faculties):
                email = f"{faculty_name.split()[-1].lower()[:5]}{i}_{code}@nitt.edu"
                email = re.sub(r'[^a-zA-Z0-9@.]', '', email)
                safe_name = faculty_name.replace("'", "\\'")
                
                # Determine role - first faculty is HOD
                role = "HOD" if i == 0 else "FACULTY"
                
                f.write(f"  await prisma.user.upsert({{\n")
                f.write(f"    where: {{ email: '{email}' }},\n")
                f.write(f"    update: {{}},\n")
                f.write(f"    create: {{\n")
                f.write(f"      email: '{email}',\n")
                f.write(f"      password: hashedPassword,\n")
                f.write(f"      role: '{role}',\n")
                f.write(f"      facultyProfile: {{\n")
                f.write(f"        create: {{\n")
                f.write(f"          departmentId: dept_{code}.id,\n")
                f.write(f"          name: '{safe_name}',\n")
                f.write(f"          designation: '{'Head of Department' if role == 'HOD' else 'Professor'}',\n")
                f.write(f"          researchTags: 'General, Engineering',\n")
                f.write(f"          profileCompletion: 50\n")
                f.write(f"        }}\n")
                f.write(f"      }}\n")
                f.write(f"    }},\n")
                f.write(f"  }})\n\n")

        except Exception as e:
            print(f"Error fetching {code}: {e}")

    f.write(seed_file_footer)
