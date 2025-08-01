'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Stethoscope, 
  Brain, 
  TestTube, 
  Pill, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Activity,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp?: string;
  doctor?: string;
  department: string;
  icon: React.ReactNode;
  estimatedTime?: string;
}

export default function DemoTrackingPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([
    {
      id: '1',
      title: 'Patient Registration',
      description: 'Patient admitted and initial information recorded',
      status: 'pending',
      department: 'Admission',
      icon: <User className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'Doctor Assessment',
      description: 'Initial examination and symptom evaluation',
      status: 'pending',
      doctor: 'Dr. Johnson',
      department: 'Cardiology',
      icon: <Stethoscope className="h-5 w-5" />
    },
    {
      id: '3', 
      title: 'AI Analysis',
      description: 'AI analyzing symptoms and generating recommendations',
      status: 'pending',
      department: 'Cardiology',
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'Laboratory Tests',
      description: 'Blood work and diagnostic tests in progress',
      status: 'pending',
      department: 'Laboratory',
      icon: <TestTube className="h-5 w-5" />
    },
    {
      id: '5',
      title: 'Treatment Plan',
      description: 'Doctor reviewing results and finalizing treatment',
      status: 'pending',
      doctor: 'Dr. Johnson',
      department: 'Cardiology',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: '6',
      title: 'Pharmacy Processing',
      description: 'Medications being prepared for patient',
      status: 'pending',
      department: 'Pharmacy',
      icon: <Pill className="h-5 w-5" />
    }
  ]);

  const startDemo = () => {
    setIsRunning(true);
    setCurrentProgress(0);
    setDemoSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const, timestamp: undefined })));
  };

  const pauseDemo = () => {
    setIsRunning(false);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentProgress(0);
    setDemoSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const, timestamp: undefined })));
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDemoSteps(prev => {
        const updated = [...prev];
        const pendingIndex = updated.findIndex(step => step.status === 'pending');
        const inProgressIndex = updated.findIndex(step => step.status === 'in-progress');

        if (inProgressIndex !== -1) {
          // Complete current step
          updated[inProgressIndex].status = 'completed';
          updated[inProgressIndex].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setCurrentProgress(prev => Math.min(prev + (100 / updated.length), 100));
        } else if (pendingIndex !== -1) {
          // Start next step
          updated[pendingIndex].status = 'in-progress';
        } else {
          // All steps completed
          setIsRunning(false);
        }

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/patient/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treatment Tracking Demo</h1>
            <p className="text-gray-600">Experience real-time hospital care monitoring</p>
          </div>
        </div>

        {/* Demo Controls */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Demo Controls
            </CardTitle>
            <CardDescription className="text-blue-700">
              Control the demo to see how treatment tracking works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={startDemo} 
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Demo
              </Button>
              <Button 
                onClick={pauseDemo} 
                disabled={!isRunning}
                variant="outline"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button 
                onClick={resetDemo}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Tracker */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Real-Time Treatment Tracking
            </CardTitle>
            <CardDescription className="text-blue-700">
              Demo Patient: John Doe • Department: Cardiology
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Treatment Progress</span>
                <span className="text-sm text-gray-600">{Math.round(currentProgress)}% Complete</span>
              </div>
              <Progress value={currentProgress} className="h-3" />
            </div>

            {/* Treatment Steps */}
            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < demoSteps.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                  )}
                  
                  <div className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(step.status)}`}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-full ${
                        step.status === 'completed' ? 'bg-green-100' :
                        step.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {step.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(step.status)}
                            <Badge variant="outline" className="text-xs">
                              {step.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{step.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {step.department}
                          </span>
                          {step.doctor && (
                            <span className="flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" />
                              {step.doctor}
                            </span>
                          )}
                          {step.timestamp && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {step.timestamp}
                            </span>
                          )}
                          {step.status === 'in-progress' && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <AlertTriangle className="h-3 w-3" />
                              Processing...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Status */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Current Status</span>
              </div>
              <p className="text-sm text-blue-700">
                {demoSteps.find(step => step.status === 'in-progress')?.description || 
                 (currentProgress === 100 ? 'Demo completed! Treatment process finished successfully.' : 'Click "Start Demo" to begin the treatment tracking simulation.')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="mt-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">About This Demo</h4>
                <p className="text-sm text-green-700">
                  This demonstration shows how patients can track their treatment progress in real-time when admitted to the hospital. 
                  Each step updates automatically as medical staff complete different phases of care.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}