'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Pill, 
  Clock, 
  CheckCircle, 
  Bell,
  AlertCircle,
  Calendar,
  Activity,
  BookOpen,
  Utensils,
  Shield,
  Eye,
  FileText,
  Heart,
  TrendingUp,
  User,
  Brain
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { useSession } from '@/hooks/use-session';
import { pharmacyService, PatientPortalData, MedicationReminder, PatientPrescription } from '@/lib/pharmacy-service';

export default function PatientPortalPage() {
  const [portalData, setPortalData] = useState<PatientPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { session } = useSession();

  useEffect(() => {
    loadPatientData();
  }, [session]);

  const loadPatientData = async () => {
    if (!session?.userId) return;
    
    setLoading(true);
    try {
      const data = await pharmacyService.getPatientPortalData(session.userId);
      setPortalData(data);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markReminderTaken = (reminderId: string, taken: boolean) => {
    if (!portalData) return;
    
    setPortalData({
      ...portalData,
      reminders: portalData.reminders.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, taken, skipped: !taken }
          : reminder
      )
    });
  };

  const getTodaysReminders = () => {
    if (!portalData) return [];
    const today = new Date().toDateString();
    return portalData.reminders.filter(reminder => 
      new Date(reminder.doseTime).toDateString() === today
    );
  };

  const getUpcomingReminders = () => {
    if (!portalData) return [];
    const now = new Date();
    return portalData.reminders
      .filter(reminder => new Date(reminder.doseTime) > now)
      .sort((a, b) => new Date(a.doseTime).getTime() - new Date(b.doseTime).getTime())
      .slice(0, 5);
  };

  const getActivePrescriptions = () => {
    if (!portalData) return [];
    return portalData.prescriptions.filter(rx => rx.status === 'active');
  };

  const getAdherenceRate = () => {
    if (!portalData) return 0;
    const totalReminders = portalData.reminders.length;
    const takenReminders = portalData.reminders.filter(r => r.taken).length;
    return totalReminders > 0 ? Math.round((takenReminders / totalReminders) * 100) : 0;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Pill className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500">Loading your medication information...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!portalData) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center py-12">
            <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Medication Data</h2>
            <p className="text-gray-500">You don't have any active prescriptions or medication reminders.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const todaysReminders = getTodaysReminders();
  const upcomingReminders = getUpcomingReminders();
  const activePrescriptions = getActivePrescriptions();
  const adherenceRate = getAdherenceRate();

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-100 rounded-full">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Medication Center
            </h1>
            <p className="text-xl text-gray-600">
              Personal medication tracking with AI-powered guidance and reminders
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-blue-600">
                <Activity className="h-4 w-4 mr-1" />
                {activePrescriptions.length} Active Medications
              </Badge>
              <Badge variant="outline" className="text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {adherenceRate}% Adherence Rate
              </Badge>
              <Badge variant="outline" className="text-purple-600">
                <Brain className="h-4 w-4 mr-1" />
                AI Health Insights
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Doses</p>
                  <p className="text-3xl font-bold text-blue-600">{todaysReminders.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Medications</p>
                  <p className="text-3xl font-bold text-green-600">{activePrescriptions.length}</p>
                </div>
                <Pill className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{adherenceRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Dose</p>
                  <p className="text-lg font-bold text-orange-600">
                    {upcomingReminders.length > 0 
                      ? new Date(upcomingReminders[0].doseTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      : 'None'
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="medications">My Medications</TabsTrigger>
            <TabsTrigger value="education">AI Health Guidance</TabsTrigger>
            <TabsTrigger value="history">Medication History</TabsTrigger>
          </TabsList>

          {/* Today's Schedule */}
          <TabsContent value="today" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Reminders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Today's Medication Schedule
                  </CardTitle>
                  <CardDescription>
                    Mark your doses as taken when you take them
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaysReminders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No doses scheduled for today</p>
                    ) : (
                      todaysReminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{reminder.medicationName}</h4>
                            <p className="text-sm text-gray-600">{reminder.dosage}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(reminder.doseTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-xs text-gray-400">{reminder.instructions}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {reminder.taken ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Taken
                              </Badge>
                            ) : reminder.skipped ? (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Skipped
                              </Badge>
                            ) : (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm"
                                  onClick={() => markReminderTaken(reminder.id, true)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark Taken
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => markReminderTaken(reminder.id, false)}
                                >
                                  Skip
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Reminders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Upcoming Doses
                  </CardTitle>
                  <CardDescription>
                    Your next medication reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingReminders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No upcoming doses</p>
                    ) : (
                      upcomingReminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{reminder.medicationName}</h4>
                            <p className="text-sm text-gray-600">{reminder.dosage}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-orange-600">
                              {new Date(reminder.doseTime).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(reminder.doseTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Medications */}
          <TabsContent value="medications" className="mt-6">
            <div className="space-y-6">
              {activePrescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{prescription.medication}</CardTitle>
                        <CardDescription>
                          {prescription.dosage} • {prescription.frequency}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {prescription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                          <p className="text-sm text-gray-700">{prescription.instructions}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Remaining Doses</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.max(10, (prescription.remainingDoses / 30) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{prescription.remainingDoses} left</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {prescription.sideEffectsToWatch.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Watch for Side Effects</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {prescription.sideEffectsToWatch.slice(0, 3).map((effect, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <AlertCircle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                  {effect}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {prescription.foodAdvice.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Food Guidelines</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {prescription.foodAdvice.slice(0, 2).map((advice, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Utensils className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  {advice}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Health Guidance */}
          <TabsContent value="education" className="mt-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">AI-Powered Medication Guidance</h3>
              </div>
              <p className="text-sm text-blue-700">
                Personalized recommendations and educational content generated by our AI system based on your specific medications and health profile.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {portalData.educationalContent.map((content) => (
                <Card key={`${content.medicationName}_${content.type}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {content.type === 'effect' && <Activity className="h-5 w-5 text-blue-600" />}
                      {content.type === 'food' && <Utensils className="h-5 w-5 text-green-600" />}
                      {content.type === 'activity' && <Shield className="h-5 w-5 text-orange-600" />}
                      {content.type === 'monitoring' && <Heart className="h-5 w-5 text-red-600" />}
                      {content.type === 'storage' && <FileText className="h-5 w-5 text-purple-600" />}
                      {content.title}
                    </CardTitle>
                    <CardDescription>
                      {content.medicationName} • AI-Generated {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Guidance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <Badge 
                        variant={content.priority === 'high' ? 'destructive' : content.priority === 'medium' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {content.priority} priority
                      </Badge>
                      <p className="text-sm text-gray-700 flex-1">{content.content}</p>
                    </div>
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      💡 This guidance is generated by AI based on your prescription. Always consult your healthcare provider for medical decisions.
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medication History */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medication History</CardTitle>
                <CardDescription>
                  Your complete medication and dosing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portalData.prescriptions.map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{prescription.medication}</h4>
                        <p className="text-sm text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                        <p className="text-xs text-gray-500">
                          Status: {prescription.status} • Next due: {new Date(prescription.nextDueTime).toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        className={
                          prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                          prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {prescription.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
