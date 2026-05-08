# NIT Trichy Faculty Portal (Monorepo)

This project has been restructured for smooth deployment and evaluation.

## Structure
- **frontend/**: Next.js 14 Web Application.
- **backend/**: Prisma ORM, MySQL Schema, and Data Seeding logic.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure MySQL is running and `.env` is configured in the root.
   ```bash
   npm run db:generate
   npm run db:seed
   ```

### Deployment Data Setup

To make faculty data available in deployed environments as well, run:

```bash
npm run db:prepare:deploy
```

This runs:
- Prisma client generation
- Schema sync (`db push`)
- CSE/ECE seed
- Non-CSE/ECE department seed

Set production `DATABASE_URL` before running this command.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Standardized Profiles
The profile page has been updated to support all institutional sections:
- Profile Images
- Academic Qualifications
- Employment History
- Administrative Responsibilities
- Sponsored Projects
- PhD Scholars Guided
- Awards & Honours
- Invited Talks
- Professional Memberships
- Patents
# faculty-profile-management
