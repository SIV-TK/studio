'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart,
  AlertTriangle,
  Baby,
  Shield,
  Scissors,
  Pill,
  Activity,
  Users,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { useSession } from '@/hooks/use-session';
import FinanceDashboard from '@/components/pages/finance-dashboard';
import Link from 'next/link';

interface DepartmentStats {
  name: string;
  icon: React.ReactNode;
  color: string;
  patientsToday: number;
  prescriptionsSent: number;
  aiRecommendations: number;
  averageProcessingTime: string;
  href: string;
}

interface RecentActivity {
  id: string;
  type: 'assessment' | 'prescription' | 'ai_analysis';
  department: string;
  patient: string;
  doctor: string;
  timestamp: string;
  status: string;
}

export default function HospitalDashboard() {
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalPatients: 0,
    totalPrescriptions: 0,
    aiAnalyses: 0,
    averageConfidence: 0
  });
  const { session } = useSession();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Mock data for demonstration
    const mockStats: DepartmentStats[] = [
      {
        name: 'Cardiology',
        icon: <Heart className="h-6 w-6 text-white" />,
        color: 'bg-red-500',
        patientsToday: 12,
        prescriptionsSent: 8,
        aiRecommendations: 15,
        averageProcessingTime: '18 min',
        href: '/cardiology'
      },
      {
        name: 'Emergency',
        icon: <AlertTriangle className="h-6 w-6 text-white" />,
        color: 'bg-red-600',
        patientsToday: 28,
        prescriptionsSent: 22,
        aiRecommendations: 35,
        averageProcessingTime: '8 min',
        href: '/emergency'
      },
      {
        name: 'Pediatrics',
        icon: <Baby className="h-6 w-6 text-white" />,
        color: 'bg-blue-500',
        patientsToday: 16,
        prescriptionsSent: 12,
        aiRecommendations: 20,
        averageProcessingTime: '22 min',
        href: '/pediatrics'
      },
      {
        name: 'Oncology',
        icon: <Shield className="h-6 w-6 text-white" />,
        color: 'bg-purple-600',
        patientsToday: 8,
        prescriptionsSent: 6,
        aiRecommendations: 10,
        averageProcessingTime: '35 min',
        href: '/oncology'
      },
      {
        name: 'Surgery',
        icon: <Scissors className="h-6 w-6 text-white" />,
        color: 'bg-green-600',
        patientsToday: 6,
        prescriptionsSent: 4,
        aiRecommendations: 8,
        averageProcessingTime: '45 min',
        href: '/surgery'
      },
      {
        name: 'Blood Bank',
        icon: <Activity className="h-6 w-6 text-white" />, // You can replace with a more appropriate icon
        color: 'bg-pink-600',
        patientsToday: 4,
        prescriptionsSent: 0,
        aiRecommendations: 5,
        averageProcessingTime: '30 min',
        href: '/blood-bank'
      }
    ];

    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'assessment',
        department: 'Cardiology',
        patient: 'John Smith',
        doctor: 'Dr. Sarah Johnson',
        timestamp: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: '2',
        type: 'prescription',
        department: 'Emergency',
        patient: 'Maria Garcia',
        doctor: 'Dr. Michael Chen',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'sent_to_pharmacy'
      },
      {
        id: '3',
        type: 'ai_analysis',
        department: 'Pediatrics',
        patient: 'Robert Chen',
        doctor: 'Dr. Emily Rodriguez',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'analyzed'
      }
    ];

    setDepartmentStats(mockStats);
    setRecentActivity(mockActivity);
    
    // Calculate totals
    const totals = mockStats.reduce((acc, dept) => ({
      totalPatients: acc.totalPatients + dept.patientsToday,
      totalPrescriptions: acc.totalPrescriptions + dept.prescriptionsSent,
      aiAnalyses: acc.aiAnalyses + dept.aiRecommendations,
      averageConfidence: 87 // Mock average
    }), { totalPatients: 0, totalPrescriptions: 0, aiAnalyses: 0, averageConfidence: 0 });

    setSystemStats(totals);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <Activity className="h-4 w-4" />;
      case 'prescription': return <Pill className="h-4 w-4" />;
      case 'ai_analysis': return <Brain className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'text-blue-600';
      case 'prescription': return 'text-green-600';
      case 'ai_analysis': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hospital Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              AI-Powered Department Management & Treatment Overview
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-900">
              Dr. {session?.name || 'Medical Professional'}
            </p>
          </div>
        </div>

        {/* System Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients Today</p>
                  <p className="text-3xl font-bold text-blue-600">{systemStats.totalPatients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prescriptions Sent</p>
                  <p className="text-3xl font-bold text-green-600">{systemStats.totalPrescriptions}</p>
                </div>
                <Pill className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Analyses</p>
                  <p className="text-3xl font-bold text-purple-600">{systemStats.aiAnalyses}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                  <p className="text-3xl font-bold text-orange-600">{systemStats.averageConfidence}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Department Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Today's activity across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept) => (
                  <Link key={dept.name} href={dept.href}>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${dept.color}`}>
                          {dept.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{dept.name}</p>
                          <p className="text-sm text-gray-500">Avg: {dept.averageProcessingTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-blue-600">{dept.patientsToday}</p>
                            <p className="text-gray-500">Patients</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-green-600">{dept.prescriptionsSent}</p>
                            <p className="text-gray-500">Rx Sent</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-purple-600">{dept.aiRecommendations}</p>
                            <p className="text-gray-500">AI Rec</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className={`p-1 rounded ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === 'assessment' && 'Patient Assessment'}
                          {activity.type === 'prescription' && 'Prescription Sent'}
                          {activity.type === 'ai_analysis' && 'AI Analysis Complete'}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {activity.patient} • {activity.department} • {activity.doctor}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Department Access</CardTitle>
            <CardDescription>Navigate directly to department treatment systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {departmentStats.map((dept) => (
                <Link key={dept.name} href={dept.href}>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <div className={`p-2 rounded ${dept.color}`}>
                      {dept.icon}
                    </div>
                    <span className="text-sm font-medium">{dept.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pharmacy Integration Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-600" />
                Pharmacy Integration Status
              </CardTitle>
              <CardDescription>Real-time prescription processing overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Pharmacy System Connected</p>
                    <p className="text-sm text-green-600">All prescriptions are being processed automatically</p>
                  </div>
                </div>
                <Link href="/pharmacy">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    View Pharmacy Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Finance Dashboard */}
        <div className="mt-8">
          <FinanceDashboard compact={false} />
        </div>
      </div>
    </MainLayout>
  );
}
