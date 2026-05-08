import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role, departmentId, designation } = body;
    const safeRole = role === "HOD" ? "HOD" : "FACULTY";

    // Validate email
    if (!email.endsWith("@nitt.edu")) {
      return NextResponse.json(
        { message: "Only @nitt.edu emails are allowed." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: safeRole,
        },
      });

      if ((safeRole === "FACULTY" || safeRole === "HOD") && departmentId && name) {
        const existingOfficialProfile = await prisma.facultyProfile.findFirst({
          where: {
            officialEmail: email,
            userId: null,
          },
        });

        if (existingOfficialProfile) {
          await prisma.facultyProfile.update({
            where: { id: existingOfficialProfile.id },
            data: {
              userId: newUser.id,
              departmentId,
              name: existingOfficialProfile.name || name,
              designation: existingOfficialProfile.designation || designation || "Assistant Professor",
              isPublic: existingOfficialProfile.isPublic,
            },
          });
        } else {
          await prisma.facultyProfile.create({
            data: {
              userId: newUser.id,
              officialEmail: email,
              departmentId,
              name,
              designation: designation || "Assistant Professor",
              researchTags: "",
              isPublic: false,
            },
          });
        }
      } else if (safeRole === "FACULTY" || safeRole === "HOD") {
        const existingOfficialProfile = await prisma.facultyProfile.findFirst({
          where: {
            officialEmail: email,
            userId: null,
          },
        });

        if (existingOfficialProfile) {
          await prisma.facultyProfile.update({
            where: { id: existingOfficialProfile.id },
            data: { userId: newUser.id },
          });
        } else if (departmentId && name) {
          await prisma.facultyProfile.create({
            data: {
              userId: newUser.id,
              officialEmail: email,
              departmentId,
              name,
              designation: designation || "Assistant Professor",
              researchTags: "",
              isPublic: false,
            },
          });
        }
      }

      return newUser;
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
