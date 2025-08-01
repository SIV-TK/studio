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
  Pill,
  DollarSign,
  User,
  Settings,
  Edit,
  Wallet
} from 'lucide-react';

export default function Navigation() {
  const [userType, setUserType] = useState<'doctor' | 'patient' | 'general'>('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [insurancePlan, setInsurancePlan] = useState<string>('Free Mode');
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
          // Set insurance plan or default to Free Mode
          setInsurancePlan(profile.insurancePlan || 'Free Mode');
        }
      });
    }
  }, [session]);

  const handleUserTypeChange = (type: 'doctor' | 'patient' | 'general') => {
    setUserType(type);
    localStorage.setItem('userType', type);
    // Close mobile menu when changing user type
    setMobileMenuOpen(false);
  };

  // Enhanced mobile-optimized service lists
  const doctorServices = [
    { name: 'Hospital Dashboard', href: '/doctor/dashboard', icon: Building2, priority: 'high' },
    { name: 'Patient Management', href: '/patient-management', icon: Users, priority: 'high' },
    { name: 'Hospital Finance', href: '/hospital-finance', icon: DollarSign, priority: 'high' },
    { name: 'Lab Results Analyzer', href: '/lab-results', icon: Brain, priority: 'medium' },
    { name: 'Pharmacy Department', href: '/pharmacy', icon: Pill, priority: 'high' },
    { name: 'Cardiology', href: '/cardiology', icon: Heart, priority: 'medium' },
    { name: 'Emergency Protocols', href: '/emergency', icon: Shield, priority: 'high' },
    { name: 'Surgery Planning', href: '/surgery', icon: Activity, priority: 'medium' },
    { name: 'ICU Monitoring', href: '/icu', icon: MonitorSpeaker, priority: 'high' },
    { name: 'Oncology', href: '/oncology', icon: Shield, priority: 'medium' },
    { name: 'Pediatrics', href: '/pediatrics', icon: Users, priority: 'low' },
    { name: 'Geriatrics', href: '/geriatrics', icon: Activity, priority: 'low' },
    { name: 'Pharmacy Demo', href: '/pharmacy-demo', icon: Activity, priority: 'low' },
  ];

  const patientServices = [
    { name: 'Dashboard', href: '/patient/dashboard', icon: Heart, priority: 'high' },
    { name: 'Health Monitor', href: '/health-tracker', icon: Activity, priority: 'high' },
    { name: 'My Medications', href: '/patient-portal', icon: Pill, priority: 'high' },
    { name: 'My Bills', href: '/patient-billing', icon: DollarSign, priority: 'high' },
    { name: 'Symptom Checker', href: '/symptom-checker', icon: Stethoscope, priority: 'high' },
    { name: 'Lab Results', href: '/patient/lab-results', icon: Brain, priority: 'medium' },
    { name: 'Appointments', href: '/booking', icon: Users, priority: 'high' },
    { name: 'Mental Health', href: '/mental-health', icon: Brain, priority: 'medium' },
  ];

  const generalServices = [
    { name: 'Dashboard', href: '/general/dashboard', icon: Heart, priority: 'high' },
    { name: 'Personal Health', href: '/general/personalized-health', icon: Heart, priority: 'high' },
    { name: 'Symptom Check', href: '/symptom-checker', icon: Stethoscope, priority: 'high' },
    { name: 'Nutrition Guide', href: '/dietician', icon: Activity, priority: 'medium' },
    { name: 'Preventive Care', href: '/lab-results', icon: Shield, priority: 'medium' },
    { name: 'Mental Wellness', href: '/mental-health', icon: Brain, priority: 'medium' },
    { name: 'Emergency Care', href: '/emergency', icon: Shield, priority: 'high' },
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

  // Get high priority services for mobile quick access
  const getQuickAccessServices = () => {
    return getCurrentServices()
      .filter(service => service.priority === 'high')
      .slice(0, 4); // Limit to 4 for mobile
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-18">
          {/* Logo - Enhanced mobile version */}
          <Link href="/" className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <Heart className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 text-blue-600" />
            <div className="flex flex-col">
              <span className="font-bold text-base xs:text-lg sm:text-xl text-gray-900">MediAssist AI</span>
              {userType === 'doctor' && userProfile?.hospitalName && (
                <span className="text-xs text-gray-500 hidden xs:block">{userProfile.hospitalName}</span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation - Better spacing */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">

            {/* Services Dropdown - Enhanced design */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-sm xl:text-base h-8 xl:h-9">
                  Services
                  <ChevronDown className="ml-1 h-3 w-3 xl:h-4 xl:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 xl:w-64">
                {getCurrentServices().map((service) => (
                  <DropdownMenuItem key={service.name} asChild>
                    <Link href={service.href} className="flex items-center gap-2 xl:gap-3">
                      <service.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm xl:text-base">{service.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Access */}
            <Link 
              href={userType === 'doctor' ? '/doctor/dashboard' : userType === 'patient' ? '/patient/dashboard' : '/dashboard'}
              className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base"
            >
              Dashboard
            </Link>

            {/* Auth Section - Responsive design */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 xl:h-9 xl:w-9 rounded-full">
                    <User className="h-4 w-4 xl:h-5 xl:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <div className="p-3 border-b">
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{userType} Mode</p>
                    <p className="text-xs text-blue-600">{insurancePlan}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Health Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      User Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/billing" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Billing Balance
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                    <User className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="text-xs xl:text-sm h-8 xl:h-9">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="text-xs xl:text-sm h-8 xl:h-9">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Enhanced touch targets */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden p-2 xs:p-2.5 h-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? 
              <X className="h-4 w-4 xs:h-5 xs:w-5" /> : 
              <Menu className="h-4 w-4 xs:h-5 xs:w-5" />
            }
          </Button>
        </div>

        {/* Enhanced Mobile Menu - Better UX and layout */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-3 xs:py-4 sm:py-5 bg-white/95 backdrop-blur-sm">


            {/* Quick Access Services - Priority items first */}
            <div className="mb-4 xs:mb-5">
              <h3 className="font-semibold text-gray-900 mb-2 xs:mb-3 text-sm xs:text-base">
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-2 xs:gap-3 mb-3 xs:mb-4">
                {getQuickAccessServices().map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="flex flex-col items-center gap-1 xs:gap-2 p-2 xs:p-3 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <service.icon className="h-5 w-5 xs:h-6 xs:w-6 text-blue-600" />
                    <span className="text-xs xs:text-sm text-gray-700 text-center leading-tight">{service.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* All Services - Collapsible list */}
            <div className="mb-4 xs:mb-5">
              <h3 className="font-semibold text-gray-900 mb-2 xs:mb-3 text-sm xs:text-base">
                {userType === 'doctor' && 'All Hospital Services'}
                {userType === 'patient' && 'All Patient Services'}
                {userType === 'general' && 'All Health Services'}
              </h3>
              <div className="grid gap-1 xs:gap-2 max-h-60 overflow-y-auto">
                {getCurrentServices().map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="flex items-center gap-2 xs:gap-3 p-2 xs:p-2.5 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <service.icon className="h-4 w-4 xs:h-4.5 xs:w-4.5 text-blue-600 flex-shrink-0" />
                    <span className="text-xs xs:text-sm text-gray-700">{service.name}</span>
                    {service.priority === 'high' && (
                      <Badge variant="secondary" className="ml-auto text-xs">Popular</Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Dashboard Link - Prominent */}
            <Link 
              href={userType === 'doctor' ? '/doctor/dashboard' : userType === 'patient' ? '/patient/dashboard' : '/dashboard'}
              className="block p-3 xs:p-4 text-center bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md mb-4 xs:mb-5 font-medium text-sm xs:text-base transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Go to Dashboard
            </Link>

            {/* Auth Section - Enhanced mobile layout */}
            {session ? (
              <div className="border-t pt-3 xs:pt-4">
                <div className="mb-3">
                  <p className="font-medium">{session.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{userType} Mode</p>
                  <p className="text-xs text-blue-600">{insurancePlan}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Link href="/profile/edit">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link href="/billing">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Wallet className="h-4 w-4 mr-2" />
                      Billing
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full justify-start text-red-600" onClick={logout}>
                    <User className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 xs:gap-3 border-t pt-3 xs:pt-4">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-9 xs:h-10 text-sm xs:text-base">Login</Button>
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
