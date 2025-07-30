'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarPlus, Video, HeartPulse, Salad, Stethoscope, FileText, Brain, AlertTriangle, Pill, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsDashboard } from '@/components/pages/analytics-dashboard';
import { DataDashboard } from '@/components/pages/data-dashboard';
import { AuthGuard } from '@/components/auth/auth-guard';
import { HealthProfilePopup } from '@/components/pages/health-profile-popup';
import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth-service';
import { UserDataStore } from '@/lib/user-data-store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Heart, Calendar, Edit } from 'lucide-react';

const services = [
  {
    icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
    title: 'AI Emergency Department',
    description: '24/7 emergency triage and immediate care guidance.',
    href: '/emergency',
    cta: 'Emergency Care',
    color: 'from-red-50 to-orange-50 border-red-200',
  },
  {
    icon: <Stethoscope className="h-10 w-10 text-indigo-500" />,
    title: 'AI Symptom Checker',
    description: 'Research-enhanced symptom analysis and diagnosis.',
    href: '/symptom-checker',
    cta: 'Check Symptoms',
    color: 'from-indigo-50 to-purple-50 border-indigo-200',
  },
  {
    icon: <FileText className="h-10 w-10 text-teal-500" />,
    title: 'Lab Results Analyzer',
    description: 'Comprehensive lab analysis with personalized recommendations.',
    href: '/lab-results',
    cta: 'Analyze Results',
    color: 'from-teal-50 to-cyan-50 border-teal-200',
  },
  {
    icon: <Pill className="h-10 w-10 text-green-500" />,
    title: 'AI Pharmacy Services',
    description: 'Drug interaction checking and medication management.',
    href: '/pharmacy',
    cta: 'Pharmacy',
    color: 'from-green-50 to-emerald-50 border-green-200',
  },
  {
    icon: <Zap className="h-10 w-10 text-yellow-500" />,
    title: 'AI Radiology',
    description: 'Medical imaging analysis and diagnostic support.',
    href: '/radiology',
    cta: 'Radiology',
    color: 'from-yellow-50 to-amber-50 border-yellow-200',
  },
  {
    icon: <Activity className="h-10 w-10 text-blue-500" />,
    title: 'AI Surgery Planning',
    description: 'Pre-operative planning and post-operative care guidance.',
    href: '/surgery',
    cta: 'Surgery Planning',
    color: 'from-blue-50 to-indigo-50 border-blue-200',
  },
  {
    icon: <Brain className="h-10 w-10 text-pink-500" />,
    title: 'Mental Health Services',
    description: 'AI-powered mental health support and therapy guidance.',
    href: '/mental-health',
    cta: 'Mental Health',
    color: 'from-pink-50 to-rose-50 border-pink-200',
  },
  {
    icon: <Salad className="h-10 w-10 text-orange-500" />,
    title: 'AI-Powered Dietician',
    description: 'Get research-based food recommendations for diseases, symptoms, or general health.',
    href: '/dietician',
    cta: 'Find Foods',
    color: 'from-orange-50 to-red-50 border-orange-200',
  },
  {
    icon: <HeartPulse className="h-10 w-10 text-purple-500" />,
    title: 'Health Tracker',
    description: 'Integrate your health data for personalized insights and advice.',
    href: '/health-tracker',
    cta: 'Get Insights',
    color: 'from-purple-50 to-pink-50 border-purple-200',
  },
  {
    icon: <Video className="h-10 w-10 text-cyan-500" />,
    title: 'Telehealth Platform',
    description: 'Virtual consultations with AI-powered diagnostics.',
    href: '/telehealth',
    cta: 'Consult Online',
    color: 'from-cyan-50 to-blue-50 border-cyan-200',
  },
  {
    icon: <CalendarPlus className="h-10 w-10 text-violet-500" />,
    title: 'Online Booking',
    description: 'Schedule appointments with specialists hassle-free.',
    href: '/booking',
    cta: 'Book Now',
    color: 'from-violet-50 to-purple-50 border-violet-200',
  },
  {
    icon: <Activity className="h-10 w-10 text-red-600" />,
    title: 'AI ICU Monitoring',
    description: 'Real-time intensive care monitoring with critical alerts.',
    href: '/icu',
    cta: 'ICU Monitor',
    color: 'from-red-50 to-pink-50 border-red-200',
  },
];

export default function DashboardPage() {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [userName, setUserName] = useState('');
  const [showProfileReminder, setShowProfileReminder] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      const userId = localStorage.getItem('currentUserId');
      
      if (userId) {
        try {
          const userData = await UserDataStore.getComprehensiveUserData(userId);
          const isIncomplete = !userData.profile || userData.profile.age === 0 || !userData.profile.healthProfile || userData.profile.healthProfile === '';
          
          // Only show popup for truly incomplete profiles (new users)
          if (isIncomplete && userData.profile && userData.profile.age === 0) {
            setShowProfilePopup(true);
          } else if (isIncomplete) {
            // Show reminder banner if profile was skipped
            setShowProfileReminder(true);
          }
          
          // Set user name for profile icon
          if (userData.profile) {
            setUserName(userData.profile.name);
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };

    checkProfileCompletion();
  }, []);

  return (
    <AuthGuard>
      <HealthProfilePopup 
        isOpen={showProfilePopup} 
        onComplete={() => {
          setShowProfilePopup(false);
          // Check if profile is still incomplete after closing popup
          const checkIncomplete = async () => {
            const userId = localStorage.getItem('currentUserId');
            if (userId) {
              const userData = await UserDataStore.getComprehensiveUserData(userId);
              const isIncomplete = !userData.profile || userData.profile.age === 0 || !userData.profile.healthProfile;
              setShowProfileReminder(isIncomplete);
            }
          };
          checkIncomplete();
        }} 
      />
      <HealthProfilePopup 
        isOpen={showProfileView} 
        onComplete={() => setShowProfileView(false)} 
      />
      <div className="flex flex-col items-center p-2 sm:p-4 md:p-8">
        {/* Header with Profile Icon */}
        <div className="w-full max-w-7xl flex justify-between items-center mb-4 sm:mb-8">
          <div></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                {userName || 'Profile'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 sm:w-48">
              <DropdownMenuItem onClick={() => setShowProfileView(true)}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                <Heart className="mr-2 h-4 w-4" />
                Health Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/booking'}>
                <Calendar className="mr-2 h-4 w-4" />
                Booking Sessions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowProfileView(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                localStorage.removeItem('currentUserId');
                localStorage.removeItem('userEmail');
                window.location.href = '/home';
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Profile Reminder Banner */}
        {showProfileReminder && (
          <div className="w-full max-w-7xl mb-4 sm:mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium text-sm sm:text-base">Complete Your Health Profile</p>
                  <p className="text-yellow-700 text-xs sm:text-sm">Get personalized AI recommendations by updating your health information.</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowProfileReminder(false)}
                  className="text-yellow-700 border-yellow-300 flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Dismiss
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setShowProfileView(true);
                    setShowProfileReminder(false);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-6 sm:mb-8 md:mb-12 px-2">
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-foreground">
            AI-Powered Digital Hospital
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mt-2 sm:mt-4 max-w-2xl mx-auto">
            Complete hospital services powered by AI - Emergency care, Surgery planning, Pharmacy, Radiology, and comprehensive medical services online.
          </p>
        </div>

        <DataDashboard />

        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl mt-6 sm:mt-8 md:mt-12 px-2 sm:px-0">
          {services.map((service) => (
            <Link href={service.href} key={service.title} className="group">
              <Card className={`h-full flex flex-col bg-gradient-to-br ${service.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2`}>
                <CardHeader className="flex flex-col items-center text-center p-3 sm:p-6">
                  <div className="p-2 sm:p-3 bg-white/80 rounded-full mb-2 sm:mb-3 shadow-sm">
                    {service.icon}
                  </div>
                  <CardTitle className="font-headline text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-700 leading-tight">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end p-3 sm:p-6 pt-0">
                  <div className="text-center font-semibold text-gray-800 group-hover:underline text-xs sm:text-sm">
                    {service.cta} &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-12 md:mt-16 w-full max-w-7xl px-2 sm:px-0">
          <AnalyticsDashboard />
        </div>
      </div>
    </AuthGuard>
  );
}