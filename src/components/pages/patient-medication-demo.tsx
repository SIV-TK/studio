import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pill, 
  Clock, 
  CheckCircle,
  Brain,
  Heart,
  Activity,
  Utensils,
  AlertCircle,
  Shield,
  User
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';

export default function PatientMedicationDemoPage() {
  const sampleMedications = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      nextDose: '8:00 AM tomorrow',
      adherence: 95,
      aiInsights: [
        'Take consistently at the same time each day',
        'Monitor for dry cough - contact doctor if persistent',
        'Can be taken with or without food'
      ]
    },
    {
      name: 'Metformin',
      dosage: '500mg', 
      frequency: 'Twice daily',
      nextDose: '8:00 PM today',
      adherence: 90,
      aiInsights: [
        'Take with meals to reduce stomach upset',
        'Stay hydrated throughout the day',
        'Monitor blood sugar levels regularly'
      ]
    }
  ];

  const todaysSchedule = [
    { time: '8:00 AM', medication: 'Lisinopril 10mg', taken: true },
    { time: '8:00 AM', medication: 'Metformin 500mg', taken: true },
    { time: '8:00 PM', medication: 'Metformin 500mg', taken: false, upcoming: true }
  ];

  const aiEducation = [
    {
      title: 'Managing Blood Pressure',
      content: 'Your Lisinopril helps lower blood pressure by relaxing blood vessels. Regular monitoring and consistent medication timing are key to success.',
      priority: 'high',
      type: 'effect'
    },
    {
      title: 'Diabetes Management',
      content: 'Metformin helps control blood sugar by reducing glucose production in your liver. Taking it with meals helps prevent stomach upset.',
      priority: 'high', 
      type: 'effect'
    },
    {
      title: 'Dietary Guidelines',
      content: 'Maintain a consistent, balanced diet. Avoid excessive potassium-rich foods while on Lisinopril. Take Metformin with meals.',
      priority: 'medium',
      type: 'food'
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Demo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Patient Medication Experience Demo
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Personalized medication tracking with AI-powered guidance
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Demo Patient: John Doe
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              AI Personalized Guidance
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Real-time Reminders
            </Badge>
          </div>

          <Link href="/patient-portal">
            <Button size="lg" className="mr-4">
              <Pill className="h-5 w-5 mr-2" />
              Access My Medication Center
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Medications</p>
                  <p className="text-3xl font-bold text-blue-600">2</p>
                </div>
                <Pill className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Doses</p>
                  <p className="text-3xl font-bold text-green-600">3</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
                  <p className="text-3xl font-bold text-purple-600">92%</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Insights</p>
                  <p className="text-3xl font-bold text-orange-600">6</p>
                </div>
                <Brain className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Medication Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                Your medication reminders for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysSchedule.map((dose, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    dose.taken ? 'bg-green-50 border border-green-200' : 
                    dose.upcoming ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border'
                  }`}>
                    <div>
                      <p className="font-medium text-gray-900">{dose.time}</p>
                      <p className="text-sm text-gray-600">{dose.medication}</p>
                    </div>
                    {dose.taken ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Taken
                      </Badge>
                    ) : dose.upcoming ? (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Due Soon
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">
                        Scheduled
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-600" />
                My Current Medications
              </CardTitle>
              <CardDescription>
                Active prescriptions with AI insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleMedications.map((med, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{med.name} {med.dosage}</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {med.adherence}% adherence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{med.frequency} • Next: {med.nextDose}</p>
                    <div className="space-y-1">
                      {med.aiInsights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Brain className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Health Guidance */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI-Powered Health Guidance
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your medications and health profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {aiEducation.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {item.type === 'effect' && <Heart className="h-4 w-4 text-red-600" />}
                    {item.type === 'food' && <Utensils className="h-4 w-4 text-green-600" />}
                    {item.type === 'activity' && <Shield className="h-4 w-4 text-orange-600" />}
                    <h5 className="font-medium text-gray-900">{item.title}</h5>
                    <Badge 
                      variant={item.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{item.content}</p>
                  <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700">
                    💡 AI-generated guidance based on your prescription
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Smart Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Personalized dosing schedules</li>
                <li>• Take/skip tracking</li>
                <li>• Adherence monitoring</li>
                <li>• Missed dose guidance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Medication effect explanations</li>
                <li>• Food interaction guidance</li>
                <li>• Side effect monitoring</li>
                <li>• Personalized education</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Safety Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Drug interaction alerts</li>
                <li>• Allergy warnings</li>
                <li>• Emergency contact info</li>
                <li>• Healthcare provider notifications</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
