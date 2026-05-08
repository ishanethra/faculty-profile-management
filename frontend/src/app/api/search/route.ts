import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag') || '';

  try {
    const faculties = await prisma.facultyProfile.findMany({
      where: {
        researchTags: {
          contains: tag
        }
      },
      include: {
        department: true
      }
    });

    return NextResponse.json({ faculties });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
