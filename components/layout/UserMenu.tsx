"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings,
  CreditCard,
  BarChart3,
  Dumbbell,
  Apple,
} from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1">
          <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">
              {user.name || "User"}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/workouts">
            <DropdownMenuItem className="cursor-pointer">
              <Dumbbell className="mr-2 h-4 w-4" />
              <span>Workouts</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/nutrition">
            <DropdownMenuItem className="cursor-pointer">
              <Apple className="mr-2 h-4 w-4" />
              <span>Nutrition</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile/subscription">
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Subscription</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-1">
          <SignOutButton
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
            showConfirm={true}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
