import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FitnessApp from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // TODO: Check for authentication
  const session = await getServerSession();
  const user = session?.user;

  // if (!user) unauthorized();
  if (!session || !user) {
    redirect("/sign-up");
  }

  return <FitnessApp userClient={session?.user} />;
}
