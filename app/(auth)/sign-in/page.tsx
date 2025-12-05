import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginForm from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your FitLife Pro account",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white text-lg font-medium">Loading sign in...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
