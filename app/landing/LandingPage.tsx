import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FitLife Pro
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </a>
              <a href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Transform Your Body & Mind
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Complete{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fitness & Nutrition
              </span>
              <br />
              Platform
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track workouts, monitor nutrition, and achieve your fitness goals
              with personalized plans, 3D exercise demos, and AI-powered
              coaching.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 h-14 group"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14"
                >
                  Sign In
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools for your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  3D Workout Library
                </h3>
                <p className="text-gray-600">
                  Access hundreds of exercises with interactive 3D
                  demonstrations showing proper form and technique.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Apple className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Nutrition Tracking
                </h3>
                <p className="text-gray-600">
                  Track your meals, monitor macros, and get personalized meal
                  plans tailored to your goals.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Progress Analytics
                </h3>
                <p className="text-gray-600">
                  Visualize your progress with detailed charts, body
                  measurements, and achievement tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Dumbbell className="w-12 h-12 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">1M+</div>
              <div className="text-gray-600">Workouts Completed</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Goals Achieved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users already achieving their fitness goals
          </p>
          <a href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 h-14 group"
            >
              Create Your Free Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <p className="mt-4 text-sm text-blue-100">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-white font-semibold underline hover:no-underline"
            >
              Sign in here
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">FitLife Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete fitness and nutrition companion for a healthier
                lifestyle.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 FitLife Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
