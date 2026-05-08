import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;

  switch (role) {
    case "SUPER_ADMIN":
      redirect("/dashboard/admin");
      break;
    case "HOD":
      redirect("/dashboard/hod");
      break;
    case "FACULTY":
      redirect("/dashboard/faculty");
      break;
    default:
      // Fallback for unknown roles
      redirect("/directory");
      break;
  }

  // This should not be reached due to redirects
  return null;
}
