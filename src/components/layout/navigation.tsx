'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/hooks/use-session';
import { FirestoreService } from '@/lib/firestore-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Heart, 
  Stethoscope, 
  Users, 
  Activity, 
  Brain, 
  Building2,
  Shield,
  UserCheck,
  MonitorSpeaker,
  Menu,
  X,
  ChevronDown,
  Pill
} from 'lucide-react';

export default function Navigation() {
  const [userType, setUserType] = useState<'doctor' | 'patient' | 'general'>('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { session, logout } = useSession();

  useEffect(() => {
    // Determine user type based on local storage or session
    const savedUserType = localStorage.getItem('userType') as 'doctor' | 'patient' | 'general';
    if (savedUserType) {
      setUserType(savedUserType);
    }
    
    // Load user profile if session exists
    if (session?.userId) {
      FirestoreService.getUserProfile(session.userId).then(profile => {
        if (profile) {
          setUserProfile(profile);
          if (profile.userType && profile.userType !== savedUserType) {
            setUserType(profile.userType);
            localStorage.setItem('userType', profile.userType);
          }
        }
      });
    }
  }, [session]);

  const handleUserTypeChange = (type: 'doctor' | 'patient' | 'general') => {
    setUserType(type);
    localStorage.setItem('userType', type);
  };

  const doctorServices = [
    { name: 'Hospital Dashboard', href: '/doctor/dashboard', icon: Building2 },
    { name: 'Patient Management', href: '/patient-management', icon: Users },
    { name: 'Lab Results Analyzer', href: '/lab-results', icon: Brain },
    { name: 'Pharmacy Department', href: '/pharmacy', icon: Pill },
    { name: 'Pharmacy Demo', href: '/pharmacy-demo', icon: Activity },
    { name: 'Cardiology', href: '/cardiology', icon: Heart },
    { name: 'Oncology', href: '/oncology', icon: Shield },
    { name: 'Pediatrics', href: '/pediatrics', icon: Users },
    { name: 'Geriatrics', href: '/geriatrics', icon: Activity },
    { name: 'Emergency Protocols', href: '/emergency', icon: Shield },
    { name: 'Surgery Planning', href: '/surgery', icon: Activity },
    { name: 'ICU Monitoring', href: '/icu', icon: MonitorSpeaker },
  ];

  const patientServices = [
    { name: 'Patient Dashboard', href: '/patient/dashboard', icon: Heart },
    { name: 'Health Monitoring', href: '/health-tracker', icon: Activity },
    { name: 'My Medications', href: '/patient-portal', icon: Pill },
    { name: 'Symptom Checker', href: '/symptom-checker', icon: Stethoscope },
    { name: 'My Lab Results', href: '/patient/lab-results', icon: Brain },
    { name: 'Appointments', href: '/booking', icon: Users },
    { name: 'Mental Health', href: '/mental-health', icon: Brain },
  ];

  const generalServices = [
    { name: 'General Dashboard', href: '/general/dashboard', icon: Heart },
    { name: 'Personalized Health', href: '/general/personalized-health', icon: Heart },
    { name: 'Symptom Assessment', href: '/symptom-checker', icon: Stethoscope },
    { name: 'Nutrition Guidance', href: '/dietician', icon: Activity },
    { name: 'Preventive Care', href: '/lab-results', icon: Shield },
    { name: 'Mental Wellness', href: '/mental-health', icon: Brain },
    { name: 'Emergency Care', href: '/emergency', icon: Shield },
  ];

  const getCurrentServices = () => {
    switch (userType) {
      case 'doctor':
        return doctorServices;
      case 'patient':
        return patientServices;
      default:
        return generalServices;
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900">MediAssist AI</span>
              {userType === 'doctor' && userProfile?.hospitalName && (
                <span className="text-xs text-gray-500">{userProfile.hospitalName}</span>
              )}
            </div>
            <Badge variant="outline" className="ml-2 text-xs">
              {userType === 'doctor' ? 'Hospital' : userType === 'patient' ? 'Patient' : 'Health'}
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* User Type Selector */}
            <div className="flex items-center gap-2">
              <Button
                variant={userType === 'doctor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleUserTypeChange('doctor')}
                className="text-xs"
              >
                <Stethoscope className="h-4 w-4 mr-1" />
                Doctor
              </Button>
              <Button
                variant={userType === 'patient' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleUserTypeChange('patient')}
                className="text-xs"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Patient
              </Button>
              <Button
                variant={userType === 'general' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleUserTypeChange('general')}
                className="text-xs"
              >
                <Heart className="h-4 w-4 mr-1" />
                General
              </Button>
            </div>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {getCurrentServices().map((service) => (
                  <DropdownMenuItem key={service.name} asChild>
                    <Link href={service.href} className="flex items-center gap-2">
                      <service.icon className="h-4 w-4 text-blue-600" />
                      <span>{service.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Access */}
            <Link 
              href={userType === 'doctor' ? '/doctor/dashboard' : userType === 'patient' ? '/patient/dashboard' : '/dashboard'}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {session.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {/* User Type Selector */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant={userType === 'doctor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleUserTypeChange('doctor')}
                className="text-xs flex-1"
              >
                <Stethoscope className="h-4 w-4 mr-1" />
                Doctor
              </Button>
              <Button
                variant={userType === 'patient' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleUserTypeChange('patient')}
                className="text-xs flex-1"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Patient
              </Button>
              <Button
                variant={userType === 'general' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleUserTypeChange('general')}
                className="text-xs flex-1"
              >
                <Heart className="h-4 w-4 mr-1" />
                General
              </Button>
            </div>

            {/* Services */}
            <div className="grid gap-2 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {userType === 'doctor' && 'Hospital Services'}
                {userType === 'patient' && 'Patient Care'}
                {userType === 'general' && 'Health Services'}
              </h3>
              {getCurrentServices().map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <service.icon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{service.name}</span>
                </Link>
              ))}
            </div>

            {/* Dashboard Link */}
            <Link 
              href={userType === 'doctor' ? '/doctor/dashboard' : userType === 'patient' ? '/patient/dashboard' : '/dashboard'}
              className="block p-2 text-gray-700 hover:bg-gray-50 rounded-md mb-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            {/* Auth Section */}
            {session ? (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Welcome, {session.name}</p>
                <Button variant="outline" size="sm" onClick={logout} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 border-t pt-4">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
