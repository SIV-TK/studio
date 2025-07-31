import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pill, 
  Users, 
  Activity, 
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  Heart,
  Shield
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';

export default function PharmacyDemoPage() {
  const demoStats = {
    totalPrescriptions: 6,
    pending: 1,
    aiAnalyzed: 1,
    pharmacistReviewed: 1,
    prepared: 1,
    ready: 1,
    dispensed: 1,
    inlinePatients: 5,
    servedPatients: 1
  };

  const samplePrescriptions = [
    {
      id: 'rx-001',
      patient: 'John Doe',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      medications: ['Lisinopril 10mg', 'Metformin 500mg'],
      status: 'ai_analyzed',
      priority: 'normal',
      time: '1 hour ago'
    },
    {
      id: 'rx-002',
      patient: 'Maria Garcia',
      doctor: 'Dr. Michael Chen',
      department: 'Emergency',
      medications: ['Azithromycin 500mg'],
      status: 'ready',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      id: 'rx-004',
      patient: 'Linda Smith',
      doctor: 'Dr. James Wilson',
      department: 'Endocrinology',
      medications: ['Insulin Lispro'],
      status: 'pending',
      priority: 'urgent',
      time: '30 minutes ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ai_analyzed': return 'bg-blue-100 text-blue-800';
      case 'pharmacist_reviewed': return 'bg-purple-100 text-purple-800';
      case 'prepared': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'dispensed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Demo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Pharmacy Department Demo
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                AI-Enhanced Prescription Management System
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mock Data Loaded
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              AI Analysis Ready
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Real-time Updates
            </Badge>
          </div>

          <Link href="/pharmacy">
            <Button size="lg" className="mr-4">
              <Pill className="h-5 w-5 mr-2" />
              Access Full Pharmacy System
            </Button>
          </Link>
          
          <Link href="/patient-portal">
            <Button variant="outline" size="lg">
              <Users className="h-5 w-5 mr-2" />
              View Patient Portal
            </Button>
          </Link>
        </div>

        {/* Demo Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                  <p className="text-3xl font-bold text-blue-600">{demoStats.totalPrescriptions}</p>
                </div>
                <Pill className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inline Patients</p>
                  <p className="text-3xl font-bold text-orange-600">{demoStats.inlinePatients}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Served Patients</p>
                  <p className="text-3xl font-bold text-green-600">{demoStats.servedPatients}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Analyzed</p>
                  <p className="text-3xl font-bold text-purple-600">{demoStats.aiAnalyzed}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Status Overview */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{demoStats.pending}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Brain className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">AI Analyzed</p>
              <p className="text-2xl font-bold text-blue-600">{demoStats.aiAnalyzed}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Reviewed</p>
              <p className="text-2xl font-bold text-purple-600">{demoStats.pharmacistReviewed}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Prepared</p>
              <p className="text-2xl font-bold text-orange-600">{demoStats.prepared}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Ready</p>
              <p className="text-2xl font-bold text-green-600">{demoStats.ready}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Shield className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Dispensed</p>
              <p className="text-2xl font-bold text-gray-600">{demoStats.dispensed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sample Prescriptions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Sample Prescriptions (Demo Data)
            </CardTitle>
            <CardDescription>
              Real-time prescription management with AI analysis and patient tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {samplePrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Heart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{prescription.patient}</h4>
                      <p className="text-sm text-gray-600">{prescription.doctor} • {prescription.department}</p>
                      <p className="text-sm text-gray-500">{prescription.medications.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(prescription.priority)}>
                      {prescription.priority}
                    </Badge>
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">{prescription.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Showcase */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Drug interaction detection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Dosage recommendations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Food & activity guidance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Side effects monitoring
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Patient Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Inline vs served tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Priority-based queuing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time status updates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Patient portal integration
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Comprehensive Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  6-stage prescription flow
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Pharmacist review system
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Medication reminders
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Educational content delivery
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
