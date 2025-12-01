"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FitLife Pro
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/workouts"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Workouts
              </Link>
              <Link
                href="/nutrition"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Nutrition
              </Link>
              <Link
                href="/progress"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Progress
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/#features"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
