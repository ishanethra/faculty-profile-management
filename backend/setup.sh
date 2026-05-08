#!/bin/bash

# Create package.json
cat << 'EOF' > package.json
{
  "name": "nitt-faculty-portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.14.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.378.0",
    "next": "14.2.3",
    "next-auth": "^4.24.7",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/bcryptjs": "^2.4.6",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "postcss": "^8",
    "prisma": "^5.14.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
EOF

# Install dependencies
npm install

# Create tsconfig.json
cat << 'EOF' > tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Create next.config.js
cat << 'EOF' > next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
EOF

# Create tailwind.config.ts
cat << 'EOF' > tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
EOF

# Create postcss.config.js
cat << 'EOF' > postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create components.json
cat << 'EOF' > components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
EOF

# Create Directories
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/api/faculty
mkdir -p src/app/api/profile/update
mkdir -p src/app/api/approval
mkdir -p src/app/api/search
mkdir -p src/app/dashboard/admin
mkdir -p src/app/dashboard/hod
mkdir -p src/app/dashboard/faculty
mkdir -p src/app/directory
mkdir -p src/app/profile/[id]
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p prisma

# Create src/lib/utils.ts
cat << 'EOF' > src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Create globals.css
cat << 'EOF' > src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

# Create layout and page
cat << 'EOF' > src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NIT Trichy Faculty Portal",
  description: "Faculty Management Portal for NIT Trichy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
EOF

cat << 'EOF' > src/app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">NIT Trichy Faculty Portal</h1>
    </main>
  );
}
EOF

# Generate UI components (button, card, input)
npx shadcn-ui@latest add button card input badge tabs dialog avatar --yes

# Create prisma schema
cat << 'EOF' > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  SUPER_ADMIN
  HOD
  FACULTY
  PUBLIC
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(FACULTY)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  facultyProfile FacultyProfile?
  auditLogs      AuditLog[]      @relation("UserAuditLogs")
}

model Department {
  id          String           @id @default(cuid())
  name        String           @unique
  code        String           @unique
  faculties   FacultyProfile[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model FacultyProfile {
  id               String       @id @default(cuid())
  userId           String       @unique
  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  departmentId     String
  department       Department   @relation(fields: [departmentId], references: [id])
  
  name             String
  designation      String
  office           String?
  phone            String?
  profileImage     String?
  researchTags     String       @db.Text // Comma separated tags
  
  scholarLink      String?
  linkedinLink     String?
  orcid            String?
  cvUrl            String?
  
  phdGuidance      Boolean      @default(false)
  collaboration    Boolean      @default(false)
  consultancy      Boolean      @default(false)
  
  profileCompletion Int         @default(0)

  publications     Publication[]
  projects         Project[]
  patents          Patent[]
  awards           Award[]
  activities       ActivityTimeline[]
  pendingChanges   PendingChange[]

  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
}

model Publication {
  id               String         @id @default(cuid())
  facultyProfileId String
  facultyProfile   FacultyProfile @relation(fields: [facultyProfileId], references: [id], onDelete: Cascade)
  title            String
  authors          String
  venue            String
  year             Int
  link             String?
  createdAt        DateTime       @default(now())
}

model Project {
  id               String         @id @default(cuid())
  facultyProfileId String
  facultyProfile   FacultyProfile @relation(fields: [facultyProfileId], references: [id], onDelete: Cascade)
  title            String
  fundingAgency    String
  amount           String
  duration         String
  status           String         // Ongoing, Completed
  createdAt        DateTime       @default(now())
}

model Patent {
  id               String         @id @default(cuid())
  facultyProfileId String
  facultyProfile   FacultyProfile @relation(fields: [facultyProfileId], references: [id], onDelete: Cascade)
  title            String
  inventors        String
  patentNumber     String
  year             Int
  status           String
  createdAt        DateTime       @default(now())
}

model Award {
  id               String         @id @default(cuid())
  facultyProfileId String
  facultyProfile   FacultyProfile @relation(fields: [facultyProfileId], references: [id], onDelete: Cascade)
  title            String
  awardedBy        String
  year             Int
  createdAt        DateTime       @default(now())
}

model ActivityTimeline {
  id               String         @id @default(cuid())
  facultyProfileId String
  facultyProfile   FacultyProfile @relation(fields: [facultyProfileId], references: [id], onDelete: Cascade)
  year             Int
  title            String
  description      String?
  createdAt        DateTime       @default(now())
}

model PendingChange {
  id               String         @id @default(cuid())
  facultyProfileId String
  facultyProfile   FacultyProfile @relation(fields: [facultyProfileId], references: [id], onDelete: Cascade)
  changeData       String         @db.LongText // JSON string of the proposed changes
  status           ApprovalStatus @default(PENDING)
  submittedAt      DateTime       @default(now())
  reviewedAt       DateTime?
  reviewedById     String?
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation("UserAuditLogs", fields: [userId], references: [id])
  action      String
  details     String   @db.Text
  createdAt   DateTime @default(now())
}
EOF
