"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

import {
  User,
  Target,
  TrendingUp,
  Dumbbell,
  Apple,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Flame,
  Droplets,
  Award,
  Star,
  Menu,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as THREE from "three";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "COACH" | "ADMIN";
  subscription: "FREE" | "STANDARD" | "PREMIUM";
  profile: {
    weight: number;
    height: number;
    age: number;
    goal: "lose_weight" | "gain_muscle" | "maintain";
  };
}

interface DashboardClientProps {
  userClient: {
    name?: string | null | undefined;
    email?: string | null | undefined;
  };
}

interface Workout {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  calories: number;
  description: string;
  exercises: Exercise[];
  rating: number;
  reviews: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  targetMuscles: string[];
  instructions: string[];
  hasDemo: boolean;
}

interface NutritionEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  timestamp: Date;
}

interface ProgressData {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}

// Mock Data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "USER",
  subscription: "PREMIUM",
  profile: {
    weight: 75.5,
    height: 180,
    age: 28,
    goal: "lose_weight",
  },
};

const mockWorkouts: Workout[] = [
  {
    id: "1",
    title: "Upper Body Blast",
    difficulty: "Advanced",
    duration: 45,
    calories: 320,
    description:
      "Intense upper body workout focusing on chest, shoulders, and arms",
    exercises: [
      {
        id: "1",
        name: "Push-ups",
        sets: 3,
        reps: 15,
        targetMuscles: ["Chest", "Shoulders", "Triceps"],
        instructions: [
          "Start in plank position with hands shoulder-width apart",
          "Lower body until chest nearly touches floor",
          "Push back up to starting position",
        ],
        hasDemo: true,
      },
    ],
    rating: 4.8,
    reviews: 234,
  },
  {
    id: "2",
    title: "Core & Cardio",
    difficulty: "Intermediate",
    duration: 30,
    calories: 280,
    description: "High-intensity cardio with core strengthening",
    exercises: [],
    rating: 4.6,
    reviews: 189,
  },
  {
    id: "3",
    title: "Yoga Flow",
    difficulty: "Beginner",
    duration: 60,
    calories: 180,
    description: "Gentle yoga flow for flexibility and mindfulness",
    exercises: [],
    rating: 4.9,
    reviews: 156,
  },
];

const progressData: ProgressData[] = [
  { date: "2025-01-01", weight: 78.0 },
  { date: "2025-01-15", weight: 77.2 },
  { date: "2025-02-01", weight: 76.1 },
  { date: "2025-02-15", weight: 75.5 },
  { date: "2025-03-01", weight: 74.8 },
  { date: "2025-03-15", weight: 73.9 },
];

const nutritionData = [
  { name: "Protein", value: 130, target: 200, color: "#3B82F6" },
  { name: "Carbs", value: 90, target: 200, color: "#10B981" },
  { name: "Fat", value: 56, target: 70, color: "#F59E0B" },
];

// 3D Exercise Demo Component
const Exercise3DDemo: React.FC<{ exercise: Exercise; isPlaying: boolean }> = ({
  exercise,
  isPlaying,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const figureRef = useRef<THREE.Group>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(400, 300);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create exercise figure
    const figure = new THREE.Group();

    // Torso
    const torsoGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const material = new THREE.MeshPhongMaterial({ color: 0x4f46e5 });
    const torso = new THREE.Mesh(torsoGeometry, material);
    figure.add(torso);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
    const leftArm = new THREE.Mesh(armGeometry, material);
    const rightArm = new THREE.Mesh(armGeometry, material);

    leftArm.position.set(-0.6, 0.2, 0);
    rightArm.position.set(0.6, 0.2, 0);
    figure.add(leftArm);
    figure.add(rightArm);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 1.0, 0.3);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    const rightLeg = new THREE.Mesh(legGeometry, material);

    leftLeg.position.set(-0.3, -1.1, 0);
    rightLeg.position.set(0.3, -1.1, 0);
    figure.add(leftLeg);
    figure.add(rightLeg);

    scene.add(figure);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.set(0, 0, 4);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    figureRef.current = figure;

    // Animation loop
    const animate = () => {
      if (isPlaying && figureRef.current) {
        const time = Date.now() * 0.001;

        // Push-up animation
        if (exercise.name.toLowerCase().includes("push")) {
          const pushUpCycle = Math.sin(time * 2) * 0.3;
          figureRef.current.position.y = pushUpCycle;

          // Arm rotation during push-up
          leftArm.rotation.z = pushUpCycle * 0.5;
          rightArm.rotation.z = -pushUpCycle * 0.5;
        }
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [exercise, isPlaying]);

  return <div ref={mountRef} className="w-full h-full" />;
};

// Main App Component
const FitnessApp: React.FC<DashboardClientProps> = ({ userClient }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isExercisePlaying, setIsExercisePlaying] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useState<User>(mockUser);
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!session) {
    redirect("/login");
  }

  // Navigation Component

  const Navigation = () => (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FitLife Pro
            </div>
            <div className="hidden md:flex space-x-6">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant={activeTab === "workouts" ? "default" : "ghost"}
                onClick={() => setActiveTab("workouts")}
              >
                Workouts
              </Button>
              <Button
                variant={activeTab === "nutrition" ? "default" : "ghost"}
                onClick={() => setActiveTab("nutrition")}
              >
                Nutrition
              </Button>
              <Button
                variant={activeTab === "progress" ? "default" : "ghost"}
                onClick={() => setActiveTab("progress")}
              >
                Progress
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Target className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>
                  {userClient?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{userClient?.name}</div>
                <Badge variant="secondary" className="text-xs">
                  {user.subscription}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Dashboard
              </Button>
              <Button
                variant={activeTab === "workouts" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("workouts");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Workouts
              </Button>
              <Button
                variant={activeTab === "nutrition" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("nutrition");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Nutrition
              </Button>
              <Button
                variant={activeTab === "progress" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("progress");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Progress
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {userClient?.name?.split(" ")[0]}!
          </h1>
          <p className="text-xl opacity-90">
            Your fitness journey continues today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">24</div>
              <div className="text-sm opacity-75">Workouts Completed</div>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">1,240</div>
              <div className="text-sm opacity-75">Calories Burned</div>
              <Flame className="w-8 h-8 mx-auto mt-2 text-orange-400" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">78%</div>
              <div className="text-sm opacity-75">Goal Progress</div>
              <div className="mt-2">
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">5.2</div>
              <div className="text-sm opacity-75">Weight Lost (kg)</div>
              <TrendingUp className="w-8 h-8 mx-auto mt-2 text-green-400" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              Quick Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Start a quick 15-minute session
            </p>
            <Button onClick={() => setActiveTab("workouts")} className="w-full">
              Browse Workouts
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5" />
              Log Meal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Track your nutrition intake</p>
            <Button
              onClick={() => setActiveTab("nutrition")}
              className="w-full"
            >
              Add Meal
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              View Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Check your fitness analytics</p>
            <Button onClick={() => setActiveTab("progress")} className="w-full">
              See Progress
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Workouts Component
  const WorkoutsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Featured Workouts</h2>
        <div className="flex gap-4">
          <select className="px-4 py-2 border rounded-lg">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <Button>Create Workout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWorkouts.map((workout) => (
          <Card
            key={workout.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <Dumbbell className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-sm opacity-75">3D Demo Available</div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-lg font-bold">{workout.title}</div>
                <div className="text-sm opacity-75">
                  {workout.duration} min • {workout.difficulty}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">{workout.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm">
                    {workout.rating} ({workout.reviews} reviews)
                  </span>
                </div>
                <Button onClick={() => setSelectedWorkout(workout)}>
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Exercise Demo:{" "}
                  {selectedWorkout.exercises[0]?.name || "Push-ups"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedWorkout(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 3D Demo */}
                <div className="relative">
                  <div className="w-full h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                    {selectedWorkout.exercises[0] && (
                      <Exercise3DDemo
                        exercise={selectedWorkout.exercises[0]}
                        isPlaying={isExercisePlaying}
                      />
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-center bg-black/50 rounded-lg p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setIsExercisePlaying(!isExercisePlaying)
                          }
                        >
                          {isExercisePlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setIsExercisePlaying(false)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-white text-sm">
                        Speed:{" "}
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          defaultValue="1"
                          className="w-16"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Exercise Instructions
                  </h4>
                  <div className="space-y-3 mb-6">
                    {(
                      selectedWorkout.exercises[0]?.instructions || [
                        "Start in plank position with hands shoulder-width apart",
                        "Lower body until chest nearly touches floor",
                        "Push back up to starting position",
                      ]
                    ).map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{instruction}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        3 sets
                      </div>
                      <div className="text-sm text-gray-600">Recommended</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        10-15 reps
                      </div>
                      <div className="text-sm text-gray-600">Per set</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold mb-2">Target Muscles</h5>
                    <div className="flex flex-wrap gap-2">
                      {(
                        selectedWorkout.exercises[0]?.targetMuscles || [
                          "Chest",
                          "Shoulders",
                          "Triceps",
                        ]
                      ).map((muscle) => (
                        <Badge key={muscle} variant="outline">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">Add to Workout Plan</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Nutrition Component
  const NutritionSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Nutrition Tracker</h2>
        <Button>Log Meal</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todays Nutrition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {nutritionData.map((macro) => (
                  <div key={macro.name} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg
                        className="w-20 h-20 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          stroke={macro.color}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${
                            (macro.value / macro.target) * 100
                          }, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                        {Math.round((macro.value / macro.target) * 100)}%
                      </div>
                    </div>
                    <div className="text-sm font-medium">{macro.name}</div>
                    <div className="text-xs text-gray-500">
                      {macro.value}g / {macro.target}g
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold mb-2">1,450 / 2,000</div>
                <div className="text-sm text-gray-600 mb-4">
                  Calories remaining
                </div>
                <Progress value={72.5} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Apple className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Greek Yogurt Bowl</div>
                      <div className="text-sm text-gray-500">
                        Breakfast • 8:30 AM
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">320 cal</div>
                    <div className="text-sm text-gray-500">25g protein</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Apple className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Chicken Salad</div>
                      <div className="text-sm text-gray-500">
                        Lunch • 12:45 PM
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">450 cal</div>
                    <div className="text-sm text-gray-500">35g protein</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {waterGlasses} / 8 glasses
                </div>
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded ${
                        i < waterGlasses ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  onClick={() => setWaterGlasses(Math.min(8, waterGlasses + 1))}
                  className="w-full"
                  disabled={waterGlasses >= 8}
                >
                  Add Glass
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  🥗 Protein Smoothie
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🍎 Apple & Almonds
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🥪 Turkey Sandwich
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Todays Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dinner</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">Grilled Salmon</div>
                  <div className="text-xs text-gray-500">
                    w/ quinoa & vegetables
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  View Full Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Progress Component
  const ProgressSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Progress Analytics</h2>
        <div className="flex gap-4">
          <select className="px-4 py-2 border rounded-lg">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
          <Button>Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Progress Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey={() => 70}
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Goal"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Current Weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Goal Weight</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    -5.2 kg
                  </div>
                  <div className="text-gray-500">Total Loss</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Workouts</span>
                    <span className="font-bold">6/7</span>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Active Minutes</span>
                    <span className="font-bold">480/300</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Calories Burned</span>
                    <span className="font-bold">2,840</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">7-Day Streak</div>
                    <div className="text-xs text-gray-500">
                      Complete workout streak
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Goal Achieved</div>
                    <div className="text-xs text-gray-500">
                      Lost 5kg milestone
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Body Measurements */}
      <Card>
        <CardHeader>
          <CardTitle>Body Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                72.8 kg
              </div>
              <div className="text-sm text-gray-600 mb-1">Weight</div>
              <div className="text-xs text-green-600">-0.5kg this week</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                18.5%
              </div>
              <div className="text-sm text-gray-600 mb-1">Body Fat</div>
              <div className="text-xs text-green-600">-1.2% this month</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                42.1 kg
              </div>
              <div className="text-sm text-gray-600 mb-1">Muscle Mass</div>
              <div className="text-xs text-green-600">+0.8kg this month</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 mb-2">85 cm</div>
              <div className="text-sm text-gray-600 mb-1">Waist</div>
              <div className="text-xs text-green-600">-3cm this month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workout Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Strength", value: 40, fill: "#3B82F6" },
                      { name: "Cardio", value: 35, fill: "#10B981" },
                      { name: "Flexibility", value: 25, fill: "#F59E0B" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: "Strength", value: 40, fill: "#3B82F6" },
                      { name: "Cardio", value: 35, fill: "#10B981" },
                      { name: "Flexibility", value: 25, fill: "#F59E0B" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Strength</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Cardio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Flexibility</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">Workout Frequency</div>
                    <div className="text-xs text-gray-500">
                      +15% from last month
                    </div>
                  </div>
                </div>
                <div className="text-green-600 font-bold">↗ 15%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Calories Burned</div>
                    <div className="text-xs text-gray-500">
                      +8% from last month
                    </div>
                  </div>
                </div>
                <div className="text-blue-600 font-bold">↗ 8%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-sm">Goal Achievement</div>
                    <div className="text-xs text-gray-500">
                      +22% from last month
                    </div>
                  </div>
                </div>
                <div className="text-purple-600 font-bold">↗ 22%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "workouts":
        return <WorkoutsSection />;
      case "nutrition":
        return <NutritionSection />;
      case "progress":
        return <ProgressSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                FitLife Pro
              </div>
              <p className="text-gray-400 mb-4">
                Your complete fitness and nutrition companion for a healthier
                lifestyle.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    Workout Library
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    Nutrition Tracking
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    3D Exercise Demos
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    Progress Analytics
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    Help Center
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    Contact Us
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-gray-400 hover:text-white"
                  >
                    Terms of Service
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Get the App</h4>
              <p className="text-gray-400 mb-4">
                Download our mobile app for iOS and Android.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full text-black">
                  📱 Download on App Store
                </Button>
                <Button variant="outline" className="w-full text-black">
                  🤖 Get it on Google Play
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 FitLife Pro. All rights reserved. Built with Next.js,
              TypeScript & TailwindCSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FitnessApp;
