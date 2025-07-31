'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';

const patientServices = [
  {
    title: 'Chronic Disease Management',
    description: 'Monitor and manage diabetes, hypertension, heart disease',
    href: '/patient/chronic-diseases',
    icon: <Heart className="h-8 w-8 text-red-600" />,
    color: 'from-red-50 to-pink-50 border-red-200',
    status: 'active'
  },
  {
    title: 'Medication Tracking',
    description: 'Track medications, dosages, and adherence',
    href: '/pharmacy',
    icon: <Pill className="h-8 w-8 text-green-600" />,
    color: 'from-green-50 to-emerald-50 border-green-200',
    status: 'active'
  },
  {
    title: 'Symptom Monitoring',
    description: 'Daily symptom tracking and AI health insights',
    href: '/symptom-checker',
    icon: <Activity className="h-8 w-8 text-blue-600" />,
    color: 'from-blue-50 to-indigo-50 border-blue-200',
    status: 'pending'
  },
  {
    title: 'My Lab Results',
    description: 'View lab results with AI-powered health insights',
    href: '/patient/lab-results',
    icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
    color: 'from-purple-50 to-pink-50 border-purple-200',
    status: 'active'
  },
  {
    title: 'Mental Health Monitoring',
    description: 'Track mood, anxiety, and mental wellness',
    href: '/mental-health',
    icon: <Brain className="h-8 w-8 text-teal-600" />,
    color: 'from-teal-50 to-cyan-50 border-teal-200',
    status: 'active'
  },
  {
    title: 'Appointment Management',
    description: 'Schedule and track medical appointments',
    href: '/booking',
    icon: <Calendar className="h-8 w-8 text-orange-600" />,
    color: 'from-orange-50 to-yellow-50 border-orange-200',
    status: 'active'
  }
];

const healthMetrics = [
  { 
    name: 'Blood Pressure', 
    current: '125/82', 
    target: '<130/80', 
    status: 'good', 
    trend: 'improving',
    lastUpdated: '2 hours ago'
  },
  { 
    name: 'Blood Sugar', 
    current: '145 mg/dL', 
    target: '<140 mg/dL', 
    status: 'elevated', 
    trend: 'stable',
    lastUpdated: '4 hours ago'
  },
  { 
    name: 'Weight', 
    current: '72.5 kg', 
    target: '70 kg', 
    status: 'improving', 
    trend: 'decreasing',
    lastUpdated: '1 day ago'
  },
  { 
    name: 'Heart Rate', 
    current: '78 bpm', 
    target: '60-80 bpm', 
    status: 'good', 
    trend: 'stable',
    lastUpdated: '30 minutes ago'
  }
];

const medications = [
  { name: 'Metformin', dosage: '500mg', frequency: '2x daily', adherence: 95, nextDose: '6:00 PM' },
  { name: 'Lisinopril', dosage: '10mg', frequency: '1x daily', adherence: 88, nextDose: '8:00 AM' },
  { name: 'Atorvastatin', dosage: '20mg', frequency: '1x evening', adherence: 92, nextDose: '9:00 PM' }
];

const upcomingAppointments = [
  { date: 'Dec 15, 2024', time: '10:30 AM', doctor: 'Dr. Johnson', specialty: 'Endocrinology', type: 'Follow-up' },
  { date: 'Dec 22, 2024', time: '2:00 PM', doctor: 'Dr. Smith', specialty: 'Cardiology', type: 'Routine Check' },
  { date: 'Jan 5, 2025', time: '11:00 AM', doctor: 'Dr. Wilson', specialty: 'Primary Care', type: 'Physical Exam' }
];

export default function PatientDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { session } = useSession();

  return (
    <AuthGuard>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-12 max-w-7xl">
            {/* Header - Mobile optimized */}
            <div className="text-center mb-6 xs:mb-8 sm:mb-10">
              <div className="flex justify-center mb-3 xs:mb-4 sm:mb-6">
                <Heart className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 text-red-600" />
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
                Welcome back, {session?.name || 'Patient'}!
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 px-2 xs:px-3 sm:px-4">
                Your Personal Health Management Dashboard
              </p>
              <Badge className="mt-2 xs:mt-3 sm:mt-4 text-xs xs:text-sm" variant="outline">
                Patient Portal
              </Badge>
            </div>

            {/* Health Status Cards - Enhanced responsive grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8 sm:mb-10">
              {healthMetrics.map((metric) => (
                <Card key={metric.name} className="shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 xs:p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs xs:text-sm font-medium text-gray-600 truncate">{metric.name}</p>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-1 xs:mb-2">
                          {metric.current}
                        </p>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                          <Badge 
                            variant={metric.status === 'good' ? 'default' : metric.status === 'elevated' ? 'destructive' : 'secondary'}
                            className="text-xs w-fit"
                          >
                            {metric.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{metric.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="ml-2 xs:ml-3 sm:ml-4 flex-shrink-0">
                        {metric.trend === 'improving' && <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5 text-green-600" />}
                        {metric.trend === 'stable' && <Activity className="h-4 w-4 xs:h-5 xs:w-5 text-blue-600" />}
                        {metric.trend === 'decreasing' && <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5 text-green-600 transform rotate-180" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs Navigation - Mobile-first approach */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 xs:grid-cols-4 h-auto p-1 mb-6 xs:mb-8">
                <TabsTrigger 
                  value="overview" 
                  className="text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 sm:py-3"
                >
                  Health Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="medications" 
                  className="text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 sm:py-3"
                >
                  Medications
                </TabsTrigger>
                <TabsTrigger 
                  value="appointments" 
                  className="text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 sm:py-3"
                >
                  Appointments
                </TabsTrigger>
                <TabsTrigger 
                  value="monitoring" 
                  className="text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 sm:py-3 col-span-2 xs:col-span-1"
                >
                  Disease Monitoring
                </TabsTrigger>
              </TabsList>

            {/* Health Overview - Enhanced mobile layout */}
            <TabsContent value="overview" className="mt-6 xs:mt-8">
              <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {patientServices.map((service) => (
                  <Link href={service.href} key={service.title} className="group">
                    <Card className={`h-full bg-gradient-to-br ${service.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                      <CardHeader className="text-center p-4 xs:p-5 sm:p-6">
                        <div className="flex justify-center mb-3 xs:mb-4">
                          <div className="transform group-hover:scale-110 transition-transform">
                            {service.icon}
                          </div>
                        </div>
                        <CardTitle className="text-base xs:text-lg sm:text-xl font-bold mb-2">{service.title}</CardTitle>
                        <CardDescription className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 xs:p-5 sm:p-6 pt-0">
                        <div className="flex items-center justify-between mb-3 xs:mb-4">
                          <Badge 
                            variant={service.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {service.status}
                          </Badge>
                          {service.status === 'active' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                        <Button className="w-full group-hover:shadow-md transition-all text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 h-auto" size="sm">
                          Access Service
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Medications */}
            <TabsContent value="medications" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {medications.map((med, index) => (
                  <Card key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-green-800">
                        <span>{med.name}</span>
                        <Pill className="h-5 w-5" />
                      </CardTitle>
                      <CardDescription className="text-green-700">
                        {med.dosage} - {med.frequency}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Adherence Rate</span>
                            <span className="font-medium">{med.adherence}%</span>
                          </div>
                          <Progress value={med.adherence} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm font-medium">Next Dose:</span>
                          <Badge variant="outline" className="text-xs">
                            {med.nextDose}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Medication Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full" size="sm">
                        <Pill className="h-4 w-4 mr-2" />
                        Add New Medication
                      </Button>
                      <Button className="w-full" variant="outline" size="sm">
                        Set Reminders
                      </Button>
                      <Link href="/pharmacy">
                        <Button className="w-full" variant="outline" size="sm">
                          View All Medications
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appointments */}
            <TabsContent value="appointments" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((apt, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-900">{apt.doctor}</p>
                              <p className="text-sm text-gray-600">{apt.specialty}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {apt.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{apt.date}</span>
                            <span>{apt.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/booking">
                      <Button className="w-full mt-4" size="sm">
                        Schedule New Appointment
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Health Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Lose 5 kg</span>
                          <span className="text-sm text-gray-600">Progress: 60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">Target: Jan 31, 2025</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Lower HbA1c to 6.5%</span>
                          <span className="text-sm text-gray-600">Progress: 40%</span>
                        </div>
                        <Progress value={40} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">Target: Mar 1, 2025</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Exercise 150 min/week</span>
                          <span className="text-sm text-gray-600">Progress: 85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">This week: 127 minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Disease Monitoring */}
            <TabsContent value="monitoring" className="mt-8">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Active Conditions & Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-red-800">Type 2 Diabetes</h3>
                          <Badge variant="destructive" className="text-xs">High Priority</Badge>
                        </div>
                        <p className="text-sm text-red-700 mb-3">Last HbA1c: 7.2% (Target: &lt;7.0%)</p>
                        <div className="space-y-2">
                          <div className="text-xs text-red-600">• Check blood sugar 2x daily</div>
                          <div className="text-xs text-red-600">• Next lab work: Dec 20, 2024</div>
                          <div className="text-xs text-red-600">• Medication adherence: 95%</div>
                        </div>
                      </div>

                      <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-orange-800">Hypertension</h3>
                          <Badge className="text-xs bg-orange-200 text-orange-800">Moderate</Badge>
                        </div>
                        <p className="text-sm text-orange-700 mb-3">Current: 125/82 mmHg (Target: &lt;130/80)</p>
                        <div className="space-y-2">
                          <div className="text-xs text-orange-600">• Daily BP monitoring</div>
                          <div className="text-xs text-orange-600">• Low sodium diet</div>
                          <div className="text-xs text-orange-600">• Regular exercise plan</div>
                        </div>
                      </div>

                      <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-green-800">High Cholesterol</h3>
                          <Badge className="text-xs bg-green-200 text-green-800">Controlled</Badge>
                        </div>
                        <p className="text-sm text-green-700 mb-3">Total: 185 mg/dL (Target: &lt;200)</p>
                        <div className="space-y-2">
                          <div className="text-xs text-green-600">• Statin therapy effective</div>
                          <div className="text-xs text-green-600">• Next lipid panel: Jan 15</div>
                          <div className="text-xs text-green-600">• Heart-healthy diet</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Health Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="font-medium text-yellow-800 text-sm">Missed Blood Sugar Check</p>
                          <p className="text-xs text-yellow-600">Remember to check your blood sugar this evening</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="font-medium text-blue-800 text-sm">Lab Results Available</p>
                          <p className="text-xs text-blue-600">Your recent blood work results are ready for review</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Recent Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <p className="font-medium text-green-800 text-sm">7-Day Medication Streak</p>
                          <p className="text-xs text-green-600">Great job maintaining your medication schedule!</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="font-medium text-blue-800 text-sm">Weight Loss Goal</p>
                          <p className="text-xs text-blue-600">Lost 2.5kg this month - you're halfway there!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
