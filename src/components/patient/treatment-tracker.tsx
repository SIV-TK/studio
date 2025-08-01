'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Activity
} from 'lucide-react';

interface TreatmentStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'waiting';
  timestamp?: string;
  doctor?: string;
  department: string;
  icon: React.ReactNode;
  estimatedTime?: string;
}

interface TreatmentTrackerProps {
  patientId?: string;
}

export function TreatmentTracker({ patientId }: TreatmentTrackerProps) {
  const [treatmentSteps, setTreatmentSteps] = useState<TreatmentStep[]>([
    {
      id: '1',
      title: 'Patient Assessment',
      description: 'Initial examination and symptom evaluation completed',
      status: 'completed',
      timestamp: '10:30 AM',
      doctor: 'Dr. Johnson',
      department: 'Cardiology',
      icon: <Stethoscope className="h-5 w-5" />
    },
    {
      id: '2', 
      title: 'AI Analysis',
      description: 'AI analyzing symptoms and generating treatment recommendations',
      status: 'completed',
      timestamp: '10:45 AM',
      department: 'Cardiology',
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'Doctor Review',
      description: 'Doctor reviewing AI recommendations and lab results',
      status: 'in-progress',
      doctor: 'Dr. Johnson',
      department: 'Cardiology',
      icon: <User className="h-5 w-5" />,
      estimatedTime: '5-10 minutes'
    },
    {
      id: '4',
      title: 'Treatment Approval',
      description: 'Final treatment plan approval and medication selection',
      status: 'pending',
      department: 'Cardiology',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: '5',
      title: 'Pharmacy Processing',
      description: 'Medications being prepared by pharmacy',
      status: 'pending',
      department: 'Pharmacy',
      icon: <Pill className="h-5 w-5" />
    }
  ]);

  const [currentProgress, setCurrentProgress] = useState(40);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTreatmentSteps(prev => {
        const updated = [...prev];
        const inProgressIndex = updated.findIndex(step => step.status === 'in-progress');
        
        if (inProgressIndex !== -1 && Math.random() > 0.7) {
          // Complete current step
          updated[inProgressIndex].status = 'completed';
          updated[inProgressIndex].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          // Start next step
          if (inProgressIndex + 1 < updated.length) {
            updated[inProgressIndex + 1].status = 'in-progress';
            setCurrentProgress(prev => Math.min(prev + 20, 100));
          }
        }
        
        return updated;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waiting': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'waiting': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Real-Time Treatment Tracking
        </CardTitle>
        <CardDescription className="text-blue-700">
          Follow your treatment progress in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Treatment Progress</span>
            <span className="text-sm text-gray-600">{currentProgress}% Complete</span>
          </div>
          <Progress value={currentProgress} className="h-3" />
        </div>

        {/* Treatment Steps */}
        <div className="space-y-4">
          {treatmentSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {index < treatmentSteps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(step.status)}`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-full ${
                    step.status === 'completed' ? 'bg-green-100' :
                    step.status === 'in-progress' ? 'bg-blue-100' :
                    step.status === 'waiting' ? 'bg-orange-100' : 'bg-gray-100'
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
                      {step.estimatedTime && step.status === 'in-progress' && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <AlertTriangle className="h-3 w-3" />
                          ETA: {step.estimatedTime}
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
            {treatmentSteps.find(step => step.status === 'in-progress')?.description || 
             'Treatment completed successfully!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}