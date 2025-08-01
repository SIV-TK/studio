'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  Clock, 
  CheckCircle, 
  Bell,
  AlertCircle,
  Activity,
  Utensils,
  Shield,
  FileText,
  Heart,
  TrendingUp,
  User,
  Brain,
  DollarSign,
  Receipt,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { useSession } from '@/hooks/use-session';
import { pharmacyService, PatientPortalData } from '@/lib/pharmacy-service';
import { HospitalFinanceService, PatientFinancialProfile } from '@/lib/hospital-finance-service';
import MpesaPaymentModal from '@/components/ui/mpesa-payment-modal';

export default function IntegratedPatientPortal() {
  const [portalData, setPortalData] = useState<PatientPortalData | null>(null);
  const [financialProfile, setFinancialProfile] = useState<PatientFinancialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const { session } = useSession();

  useEffect(() => {
    loadPatientData();
  }, [session]);

  const loadPatientData = async () => {
    if (!session?.userId) return;
    
    setLoading(true);
    try {
      const [medicationData, financeData] = await Promise.all([
        pharmacyService.getPatientPortalData(session.userId),
        HospitalFinanceService.getPatientFinancialProfile(session.userId)
      ]);
      setPortalData(medicationData);
      setFinancialProfile(financeData);
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
              <User className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500">Loading your health dashboard...</p>
            </div>
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
              My Health Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Integrated medication tracking and billing management
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
              {financialProfile && (
                <Badge variant="outline" className="text-red-600">
                  <Receipt className="h-4 w-4 mr-1" />
                  {HospitalFinanceService.formatCurrency(financialProfile.pendingAmount)} Due
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Financial Alert */}
        {financialProfile && financialProfile.overdueAmount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-medium text-red-800">Outstanding Balance</h3>
                  <p className="text-sm text-red-700">
                    You have {HospitalFinanceService.formatCurrency(financialProfile.overdueAmount)} in overdue bills
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setSelectedBill({ billId: 'BILL-2024-001', amount: financialProfile.overdueAmount });
                  setShowMpesaModal(true);
                }}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Pay with M-Pesa
              </Button>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Account Balance</p>
                  <p className="text-lg font-bold text-red-600">
                    {financialProfile ? HospitalFinanceService.formatCurrency(financialProfile.pendingAmount) : '$0'}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="medications">My Medications</TabsTrigger>
            <TabsTrigger value="billing">Bills & Payments</TabsTrigger>
            <TabsTrigger value="education">AI Health Guidance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Today's Schedule */}
          <TabsContent value="today" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
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
                          </div>
                          <div className="flex items-center gap-2">
                            {reminder.taken ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Taken
                              </Badge>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => markReminderTaken(reminder.id, true)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Mark Taken
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bills & Payments Tab */}
          <TabsContent value="billing" className="mt-6">
            {!financialProfile ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Billing Information</h3>
                  <p className="text-gray-600">You don't have any bills at this time.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Financial Summary */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Billed</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {HospitalFinanceService.formatCurrency(financialProfile.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Amount Paid</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {HospitalFinanceService.formatCurrency(financialProfile.paidAmount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {HospitalFinanceService.formatCurrency(financialProfile.pendingAmount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Overdue</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {HospitalFinanceService.formatCurrency(financialProfile.overdueAmount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Bills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-blue-600" />
                      Active Bills
                    </CardTitle>
                    <CardDescription>
                      Bills requiring your attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {financialProfile.activeBills.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                          <p className="text-gray-600">All your bills are fully paid!</p>
                        </div>
                      ) : (
                        financialProfile.activeBills.map((bill) => (
                          <div key={bill.billId} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{bill.billId}</p>
                              <p className="text-sm text-gray-600">
                                {bill.department} • {new Date(bill.admissionDate).toLocaleDateString()}
                              </p>
                              <Badge className={HospitalFinanceService.getBillStatusColor(bill.status)}>
                                {bill.status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{HospitalFinanceService.formatCurrency(bill.pendingAmount)}</p>
                              <p className="text-sm text-gray-600">
                                Due: {new Date(bill.dueDate).toLocaleDateString()}
                              </p>
                              <Button 
                                size="sm" 
                                className="mt-2 bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setShowMpesaModal(true);
                                }}
                              >
                                <Smartphone className="h-4 w-4 mr-2" />
                                Pay with M-Pesa
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Button 
                    className="h-16 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      if (financialProfile?.activeBills.length) {
                        setSelectedBill(financialProfile.activeBills[0]);
                        setShowMpesaModal(true);
                      }
                    }}
                  >
                    <Smartphone className="h-6 w-6 mb-2" />
                    Pay with M-Pesa
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    View All Bills
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Building className="h-6 w-6 mb-2" />
                    Contact Billing
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI Health Guidance */}
          <TabsContent value="education" className="mt-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">AI-Powered Health Guidance</h3>
              </div>
              <p className="text-sm text-blue-700">
                Personalized recommendations based on your medications and health profile.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {portalData?.educationalContent.map((content) => (
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
                      {content.medicationName} • AI-Generated Guidance
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="medications">Medication History</TabsTrigger>
                <TabsTrigger value="billing">Billing History</TabsTrigger>
              </TabsList>

              <TabsContent value="medications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medication History</CardTitle>
                    <CardDescription>
                      Your complete medication and dosing history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portalData?.prescriptions.map((prescription) => (
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

              <TabsContent value="billing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      Complete history of your hospital bills and payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!financialProfile ? (
                        <p className="text-gray-500 text-center py-8">No billing history found</p>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                            <div className="space-y-2">
                              {financialProfile.paymentHistory.map((payment) => (
                                <div key={payment.paymentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <CreditCard className="h-4 w-4 text-green-600" />
                                    <div>
                                      <p className="font-medium">{HospitalFinanceService.formatCurrency(payment.amount)}</p>
                                      <p className="text-sm text-gray-600">{payment.paymentMethod} • {payment.receivedBy}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium">
                                      {new Date(payment.paymentDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {payment.transactionId && `ID: ${payment.transactionId}`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Bill Summary</h4>
                            <div className="grid md:grid-cols-3 gap-4 text-center">
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{financialProfile.totalBills}</p>
                                <p className="text-sm text-gray-600">Total Bills</p>
                              </div>
                              <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">
                                  {HospitalFinanceService.formatCurrency(financialProfile.paidAmount)}
                                </p>
                                <p className="text-sm text-gray-600">Total Paid</p>
                              </div>
                              <div className="p-4 bg-orange-50 rounded-lg">
                                <p className="text-2xl font-bold text-orange-600">
                                  {HospitalFinanceService.formatCurrency(financialProfile.pendingAmount)}
                                </p>
                                <p className="text-sm text-gray-600">Outstanding</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* M-Pesa Payment Modal */}
        {showMpesaModal && selectedBill && (
          <MpesaPaymentModal
            isOpen={showMpesaModal}
            onClose={() => {
              setShowMpesaModal(false);
              setSelectedBill(null);
            }}
            billId={selectedBill.billId}
            amount={selectedBill.pendingAmount || selectedBill.amount}
            patientId={session?.userId || 'user_001'}
            onPaymentSuccess={(transactionId) => {
              console.log('Payment successful:', transactionId);
              setShowMpesaModal(false);
              setSelectedBill(null);
              loadPatientData(); // Refresh data
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}