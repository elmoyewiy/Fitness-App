import { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your FitLife Pro account",
};
export default async function LoginPage() {
  //   const session = await getServerSession(authOptions);
  //   if (session) {
  //     redirect("/app/dashboard");
  //   }
  return <LoginForm />;
}
