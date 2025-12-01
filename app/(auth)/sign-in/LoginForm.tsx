"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      toast.success("Signed in successfully");
      router.push(redirect ?? "/dashboard");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />

        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-
400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "0.5s" }}
        />
      </div>
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Dumbbell
          className="absolute top-20 left-20 w-12 h-12 text-white/20 animate-bounce"
          style={{ animationDuration: "3s" }}
        />
        <Sparkles
          className="absolute top-40 right-40 w-8 h-8 text-white/20 animate-bounce"
          style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}
        />
        <Dumbbell
          className="absolute bottom-32 right-32 w-10 h-10 text-white/20 animate-bounce"
          style={{ animationDuration: "3.5s", animationDelay: "0.7s" }}
        />
      </div>
      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center pb-6">
          <div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex itemscenter
justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text texttransparent">
            Welcome Back!
          </h1>
          <p className="text-base text-gray-600">
            Sign in to continue your fitness journey
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}
          {/* Social Login */}
          {/* <SocialLogin onLoading={setLoading} /> */}
          {/* Divider */}
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
          {/* Login Form */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
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
                            placeholder="john@example.com"
                            {...field}
                            className={`pl-10 h-12 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                            disabled={loading}
                          />
                        </FormControl>

                        <FormMessage />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
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
                            disabled={loading}
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

                {/* Remember & Forgot */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                        <Label htmlFor="remember" className="cursor-pointer">
                          Remember me
                        </Label>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600"
                        onClick={() => router.push("/forgot-password")}
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}
                />

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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t">
            <span className="text-sm text-gray-600">
              Dont have an account?{" "}
            </span>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 font-semibold"
              onClick={() => router.push("/sign-up")}
            >
              Sign up for free
            </Button>
          </div>
          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Secured with industry-standard encryption
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
