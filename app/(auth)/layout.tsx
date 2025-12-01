import { ReactNode } from "react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
export const metadata: Metadata = {
  title: {
    template: "%s | FitLife Pro",
    default: "Authentication",
  },
  description: "Sign in or create an account to access FitLife Pro",
};
interface AuthLayoutProps {
  children: ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
