import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const SECTION_LABELS: Record<string, string> = {
  identity: 'Identity & Location',
  research: 'Academic Research',
  opportunities: 'Opportunities',
  education: 'Academic Qualifications',
  experience: 'Employment Profile',
  responsibilities: 'Administrative Responsibilities',
  publications: 'Publications',
  projects: 'Sponsored Projects',
  phdsGuided: 'PhD Scholars',
  awards: 'Awards & Honours',
  patents: 'Patents',
  invitedTalks: 'Invited Talks',
  memberships: 'Professional Memberships',
  foreignVisits: 'Academic Foreign Visits',
};

const changedFields = (current: Record<string, any>, next: Record<string, any>, keys: string[]) =>
  Object.fromEntries(
    keys
      .filter((key) => next[key] !== undefined && current[key] !== next[key])
      .map((key) => [key, next[key]])
  );

const changedFieldDetails = (current: Record<string, any>, next: Record<string, any>, keys: string[]) =>
  keys
    .filter((key) => next[key] !== undefined && current[key] !== next[key])
    .map((key) => ({
      field: key,
      from: current[key] ?? '',
      to: next[key] ?? '',
    }));

const formatFieldChange = (change: { field: string; from: any; to: any }) =>
  `${change.field.replace(/([A-Z])/g, ' $1')}: "${String(change.from)}" -> "${String(change.to)}"`;

const RELATION_APPLIERS: Record<string, (tx: any, facultyProfileId: string, rows: any[]) => Promise<void>> = {
  education: async (tx, facultyProfileId, rows) => {
    await tx.education.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.education.createMany({ data: rows.map((row) => ({ ...pick(row, ['degree', 'institution', 'year', 'details']), facultyProfileId })) });
  },
  experience: async (tx, facultyProfileId, rows) => {
    await tx.experience.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.experience.createMany({ data: rows.map((row) => ({ ...pick(row, ['title', 'organization', 'from', 'to']), facultyProfileId })) });
  },
  responsibilities: async (tx, facultyProfileId, rows) => {
    await tx.responsibility.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.responsibility.createMany({ data: rows.map((row) => ({ ...pick(row, ['position', 'organization', 'from', 'to', 'type']), facultyProfileId })) });
  },
  publications: async (tx, facultyProfileId, rows) => {
    await tx.publication.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.publication.createMany({ data: rows.map((row) => ({ ...pick(row, ['title', 'authors', 'venue', 'year', 'link']), facultyProfileId })) });
  },
  projects: async (tx, facultyProfileId, rows) => {
    await tx.project.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.project.createMany({ data: rows.map((row) => ({ ...pick(row, ['title', 'fundingAgency', 'amount', 'duration', 'status']), facultyProfileId })) });
  },
  phdsGuided: async (tx, facultyProfileId, rows) => {
    await tx.phDGuided.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.phDGuided.createMany({ data: rows.map((row) => ({ ...pick(row, ['studentName', 'thesisTitle', 'role', 'year']), facultyProfileId })) });
  },
  awards: async (tx, facultyProfileId, rows) => {
    await tx.award.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.award.createMany({ data: rows.map((row) => ({ ...pick(row, ['title', 'awardedBy', 'year']), facultyProfileId })) });
  },
  patents: async (tx, facultyProfileId, rows) => {
    await tx.patent.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.patent.createMany({ data: rows.map((row) => ({ ...pick(row, ['title', 'inventors', 'patentNumber', 'year', 'status']), facultyProfileId })) });
  },
  invitedTalks: async (tx, facultyProfileId, rows) => {
    await tx.invitedTalk.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.invitedTalk.createMany({ data: rows.map((row) => ({ ...pick(row, ['topic', 'organization', 'date']), facultyProfileId })) });
  },
  memberships: async (tx, facultyProfileId, rows) => {
    await tx.membership.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.membership.createMany({ data: rows.map((row) => ({ ...pick(row, ['type', 'organization', 'membershipNo']), facultyProfileId })) });
  },
  foreignVisits: async (tx, facultyProfileId, rows) => {
    await tx.foreignVisit.deleteMany({ where: { facultyProfileId } });
    if (rows.length > 0) await tx.foreignVisit.createMany({ data: rows.map((row) => ({ ...pick(row, ['country', 'duration', 'purpose']), facultyProfileId })) });
  },
};

function pick(row: Record<string, any>, keys: string[]) {
  return Object.fromEntries(Object.entries(row).filter(([key, value]) => keys.includes(key) && value !== undefined));
}

const RELATION_REQUIRED_FIELDS: Record<string, string[]> = {
  education: ['degree', 'institution', 'year'],
  experience: ['title', 'organization', 'from', 'to'],
  responsibilities: ['position', 'organization', 'from', 'type'],
  publications: ['title', 'authors', 'venue', 'year'],
  projects: ['title', 'fundingAgency', 'amount', 'duration', 'status'],
  phdsGuided: ['studentName', 'thesisTitle', 'role', 'year'],
  awards: ['title', 'awardedBy', 'year'],
  patents: ['title', 'inventors', 'patentNumber', 'year', 'status'],
  invitedTalks: ['topic', 'organization', 'date'],
  memberships: ['type', 'organization'],
  foreignVisits: ['country', 'duration', 'purpose'],
};

const YEAR_FIELDS = new Set(['education', 'publications', 'phdsGuided', 'awards', 'patents']);

function sanitizeRelationRows(sectionKey: string, rows: unknown[]) {
  const requiredFields = RELATION_REQUIRED_FIELDS[sectionKey];
  if (!requiredFields) {
    throw new Error(`Unsupported section "${sectionKey}".`);
  }

  return rows.map((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error(`Row ${index + 1} must be an object.`);
    }

    const record = row as Record<string, any>;
    const missingFields = requiredFields.filter((field) => {
      const value = record[field];
      return value === undefined || value === null || String(value).trim() === '';
    });

    if (missingFields.length > 0) {
      throw new Error(`Row ${index + 1} in ${SECTION_LABELS[sectionKey]} is missing: ${missingFields.join(', ')}.`);
    }

    if (YEAR_FIELDS.has(sectionKey)) {
      const year = Number(record.year);
      if (!Number.isInteger(year)) {
        throw new Error(`Row ${index + 1} in ${SECTION_LABELS[sectionKey]} has an invalid year.`);
      }
      return { ...record, year };
    }

    return record;
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || (session.user.role !== 'FACULTY' && session.user.role !== 'HOD')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { facultyProfile: true }
    });

    if (!user || !user.facultyProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = user.facultyProfile;
    const sections: Array<{ key: string; label: string; details?: string; data?: any; changes?: Array<{ field: string; from: any; to: any }> }> = [];

    const identityData = changedFields(profile, data, ['name', 'designation', 'office', 'phone']);
    if (Object.keys(identityData).length > 0) {
      const changes = changedFieldDetails(profile, data, ['name', 'designation', 'office', 'phone']);
      sections.push({
        key: 'identity',
        label: SECTION_LABELS.identity,
        data: identityData,
        changes,
        details: changes.map(formatFieldChange).join('\n'),
      });
    }

    const researchData = changedFields(profile, data, ['researchTags', 'scholarLink', 'linkedinLink', 'orcid', 'cvUrl']);
    if (Object.keys(researchData).length > 0) {
      const changes = changedFieldDetails(profile, data, ['researchTags', 'scholarLink', 'linkedinLink', 'orcid', 'cvUrl']);
      sections.push({
        key: 'research',
        label: SECTION_LABELS.research,
        data: researchData,
        changes,
        details: changes.map(formatFieldChange).join('\n'),
      });
    }

    const opportunitiesData = changedFields(profile, data, ['phdGuidance', 'collaboration', 'consultancy']);
    if (Object.keys(opportunitiesData).length > 0) {
      const changes = changedFieldDetails(profile, data, ['phdGuidance', 'collaboration', 'consultancy']);
      sections.push({
        key: 'opportunities',
        label: SECTION_LABELS.opportunities,
        data: opportunitiesData,
        changes,
        details: changes.map(formatFieldChange).join('\n'),
      });
    }

    if (sections.length === 0) {
      return NextResponse.json({ error: 'No profile changes were submitted.' }, { status: 400 });
    }

    const changeRequest = {
      facultyName: profile.name,
      facultyProfileId: profile.id,
      sections,
    };

    if (session.user.role === 'HOD') {
      const scalarData = Object.assign(
        {},
        identityData,
        researchData,
        opportunitiesData
      );

      await prisma.$transaction(async (tx) => {
        for (const section of sections) {
          const applyRelation = RELATION_APPLIERS[section.key];
          if (applyRelation && Array.isArray(section.data)) {
            await applyRelation(tx, profile.id, section.data);
          }
        }

        await tx.facultyProfile.update({
          where: { id: profile.id },
          data: {
            ...scalarData,
            isPublic: true,
          },
        });
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'HOD_PROFILE_UPDATED',
          details: `Updated ${sections.map((section) => section.label).join(', ')} directly for ${profile.name}`
        }
      });

      return NextResponse.json({ success: true, appliedDirectly: true, changeRequest });
    }

    const pendingChange = await prisma.pendingChange.create({
      data: {
        facultyProfileId: profile.id,
        changeData: JSON.stringify(changeRequest),
        status: 'PENDING'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PROFILE_UPDATE_SUBMITTED',
        details: `Submitted ${sections.map((section) => section.label).join(', ')} changes for ${profile.name}`
      }
    });

    return NextResponse.json({ success: true, pendingChange });

  } catch (error: any) {
    console.error(error);
    if (error?.code === 'P1001' || String(error?.message || '').includes("Can't reach database server")) {
      return NextResponse.json(
        { error: 'Database is not running. Start MySQL, then retry the profile update.' },
        { status: 503 }
      );
    }
    if (String(error?.message || '').includes('officialEmail')) {
      return NextResponse.json(
        { error: 'Database schema is missing FacultyProfile.officialEmail. Run: npm --workspace backend run db:patch:official-profiles' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
