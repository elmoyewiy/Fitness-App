"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, Loader2 } from "lucide-react";

interface SignOutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showConfirm?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function SignOutButton({
  variant = "outline",
  size = "default",
  showIcon = true,
  showConfirm = true,
  className = "",
  children,
}: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const SignOutContent = () => (
    <Button
      variant={variant}
      size={size}
      onClick={!showConfirm ? handleSignOut : undefined}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          {showIcon && <LogOut className="w-4 h-4 mr-2" />}
          {children || "Sign Out"}
        </>
      )}
    </Button>
  );

  if (!showConfirm) {
    return <SignOutContent />;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={loading}
          className={className}
        >
          {showIcon && <LogOut className="w-4 h-4 mr-2" />}
          {children || "Sign Out"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign Out</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out? You&apos;ll need to sign in again
            to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOut}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing out...
              </>
            ) : (
              "Sign Out"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
