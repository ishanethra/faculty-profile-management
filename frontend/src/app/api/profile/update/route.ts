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
    const sections: Array<{ key: string; label: string; details?: string; data?: any }> = [];

    const identityData = changedFields(profile, data, ['name', 'designation', 'office', 'phone']);
    if (Object.keys(identityData).length > 0) {
      sections.push({ key: 'identity', label: SECTION_LABELS.identity, data: identityData });
    }

    const researchData = changedFields(profile, data, ['researchTags', 'scholarLink', 'linkedinLink', 'orcid', 'cvUrl']);
    if (Object.keys(researchData).length > 0) {
      sections.push({ key: 'research', label: SECTION_LABELS.research, data: researchData });
    }

    const opportunitiesData = changedFields(profile, data, ['phdGuidance', 'collaboration', 'consultancy']);
    if (Object.keys(opportunitiesData).length > 0) {
      sections.push({ key: 'opportunities', label: SECTION_LABELS.opportunities, data: opportunitiesData });
    }

    if (data.sectionKey && data.sectionDetails) {
      let rows: unknown = undefined;
      if (data.sectionRowsJson) {
        try {
          rows = JSON.parse(data.sectionRowsJson);
        } catch {
          return NextResponse.json({ error: 'Section rows must be valid JSON.' }, { status: 400 });
        }
        if (!Array.isArray(rows)) {
          return NextResponse.json({ error: 'Section rows must be a JSON array.' }, { status: 400 });
        }
      }

      sections.push({
        key: data.sectionKey,
        label: SECTION_LABELS[data.sectionKey] || data.sectionKey,
        details: data.sectionDetails,
        ...(rows ? { data: rows } : {}),
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

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
