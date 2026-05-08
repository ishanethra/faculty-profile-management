import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const SCALAR_SECTION_KEYS = new Set(['identity', 'research', 'opportunities']);
const ALLOWED_PROFILE_FIELDS = new Set([
  'name',
  'designation',
  'office',
  'phone',
  'researchTags',
  'scholarLink',
  'linkedinLink',
  'orcid',
  'cvUrl',
  'phdGuidance',
  'collaboration',
  'consultancy',
]);

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

function sanitizeProfileData(data: Record<string, any>) {
  return Object.fromEntries(Object.entries(data).filter(([key]) => ALLOWED_PROFILE_FIELDS.has(key)));
}

function pick(row: Record<string, any>, keys: string[]) {
  return Object.fromEntries(Object.entries(row).filter(([key, value]) => keys.includes(key) && value !== undefined));
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || (session.user.role !== 'HOD' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pendingChangeId, status, rejectionReason } = await req.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const pendingChange = await prisma.pendingChange.findUnique({
      where: { id: pendingChangeId },
      include: { facultyProfile: true }
    });

    if (!pendingChange) {
      return NextResponse.json({ error: 'Pending change not found' }, { status: 404 });
    }

    // HOD can approve only within their own department. SUPER_ADMIN can approve any.
    if (session.user.role === 'HOD') {
      const reviewer = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { facultyProfile: true },
      });

      if (!reviewer?.facultyProfile?.departmentId) {
        return NextResponse.json({ error: 'Reviewer profile/department not found' }, { status: 403 });
      }

      if (reviewer.facultyProfile.departmentId !== pendingChange.facultyProfile.departmentId) {
        return NextResponse.json({ error: 'Cannot approve changes for another department' }, { status: 403 });
      }
    }

    // Update pending change status
    const updatedChange = await prisma.pendingChange.update({
      where: { id: pendingChangeId },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        reviewedAt: new Date(),
        reviewedById: session.user.id
      }
    });

    // If approved, update the actual profile
    if (status === 'APPROVED') {
      const newProfileData = JSON.parse(pendingChange.changeData);

      await prisma.$transaction(async (tx) => {
        if (Array.isArray(newProfileData.sections)) {
          const scalarData: Record<string, any> = {};

          for (const section of newProfileData.sections) {
            if (SCALAR_SECTION_KEYS.has(section.key) && section.data && !Array.isArray(section.data)) {
              Object.assign(scalarData, sanitizeProfileData(section.data));
              continue;
            }

            const applyRelation = RELATION_APPLIERS[section.key];
            if (applyRelation && Array.isArray(section.data)) {
              await applyRelation(tx, pendingChange.facultyProfileId, section.data);
            }
          }

          await tx.facultyProfile.update({
            where: { id: pendingChange.facultyProfileId },
            data: {
              ...scalarData,
              isPublic: true,
            },
          });
        } else {
          await tx.facultyProfile.update({
            where: { id: pendingChange.facultyProfileId },
            data: {
              ...sanitizeProfileData(newProfileData),
              isPublic: true,
            },
          });
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `PROFILE_CHANGE_${status}`,
        details: `Reviewed change ${pendingChangeId} for ${pendingChange.facultyProfile.name}`
      }
    });

    return NextResponse.json({ success: true, updatedChange });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
