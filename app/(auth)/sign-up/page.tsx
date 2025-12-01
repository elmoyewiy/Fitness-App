import type { Metadata } from "next";
import SignInForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <main>
      <SignInForm />
    </main>
  );
}
