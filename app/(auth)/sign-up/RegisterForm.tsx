"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  AlertCircle,
  ArrowRight,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { passwordSchema } from "@/lib/validation";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [setError] = useState<string | null>(null);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit({ email, password, name }: SignUpValues) {
    setError(null);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/email-verified",
    });

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      toast.success("Signed up successfully");
      router.push("/dashboard");
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      </div>
      {/* Register Card */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center pb-6">
          <div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex itemscenter
justify-center shadow-lg"
          >
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text texttransparent">
            Join FitLife Pro
          </h1>
          <p className="text-base text-gray-600">
            Start your transformation today
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}
          {/* <SocialLogin onLoading={setLoading} /> */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or continue with email
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <FormControl />
                      <Input
                        id="name"
                        type="text"
                        {...field}
                        placeholder="John Doe"
                        className={`pl-10 h-12 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                    </div>

                    <FormMessage />
                  </div>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="moye@example.com"
                          className={"pl-10 h-12 "}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className={`pl-10 pr-10 h-12 ${
                            errors.password ? "border-red-500" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className={`pl-10 pr-10 h-12 ${
                            errors.confirmPassword ? "border-red-500" : ""
                          }`}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Terms */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, terms: checked as boolean })
                    }
                    className={errors.terms ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm leading-snug cursor-pointer"
                  >
                    I agree to the{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600">
                      Privacy Policy
                    </Button>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500 flex items-center gap-1 ml-6">
                    <AlertCircle className="w-4 h-4" />
                    {errors.terms}
                  </p>
                )}
              </div>
              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:topurple-
700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 font-semibold"
              onClick={() => router.push("/sign-in")}
            >
              Sign in instead
            </Button>
          </div>
          {/* Features */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              By signing up, you get:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>3D Workout Demos</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Nutrition Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Progress Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Personal Coach</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
