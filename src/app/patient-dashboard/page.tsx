'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Pill,
  Receipt,
  CreditCard,
  User,
  Calendar,
  Phone,
  Mail,
  Activity,
  Smartphone
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';
import { PatientFinanceIntegration, IntegratedPatientData } from '@/lib/patient-finance-integration';
import MpesaPaymentModal from '@/components/ui/mpesa-payment-modal';

export default function PatientDashboardPage() {
  const [patientData, setPatientData] = useState<IntegratedPatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
      const data = await PatientFinanceIntegration.getIntegratedPatientData(session.userId);
      setPatientData(data);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  if (!patientData) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
              <p className="text-gray-500">Unable to load your dashboard information.</p>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {patientData.personalInfo.name}</h1>
              <p className="text-gray-600 mt-2">Your integrated health and billing dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-blue-600">
                <Heart className="h-4 w-4 mr-1" />
                {patientData.medical.adherenceRate}% Adherence
              </Badge>
              <Badge variant="outline" className="text-red-600">
                <Receipt className="h-4 w-4 mr-1" />
                {PatientFinanceIntegration.formatCurrency(patientData.financial.paymentDue)} Due
              </Badge>
            </div>
          </div>

          {/* Alerts Section */}
          {patientData.alerts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Alerts</h2>
              <div className="grid gap-4">
                {patientData.alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${PatientFinanceIntegration.getAlertColor(alert.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {alert.type === 'medication' && <Pill className="h-5 w-5 mt-0.5" />}
                        {alert.type === 'payment' && <CreditCard className="h-5 w-5 mt-0.5" />}
                        {alert.type === 'appointment' && <Calendar className="h-5 w-5 mt-0.5" />}
                        {alert.type === 'health' && <Activity className="h-5 w-5 mt-0.5" />}
                        <div>
                          <h3 className="font-medium">{alert.title}</h3>
                          <p className="text-sm mt-1">{alert.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.priority}
                        </Badge>
                        {alert.actionRequired && alert.actionUrl && (
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Pill className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Medications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {patientData.medical.medications?.prescriptions.filter(p => p.status === 'active').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{patientData.medical.adherenceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {PatientFinanceIntegration.formatCurrency(patientData.financial.paymentDue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Bell className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{patientData.alerts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Today's Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-blue-600" />
                      Today's Medications
                    </CardTitle>
                    <CardDescription>
                      Medications scheduled for today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patientData.medical.medications?.reminders
                        .filter(r => new Date(r.doseTime).toDateString() === new Date().toDateString())
                        .slice(0, 3)
                        .map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{reminder.medicationName}</p>
                            <p className="text-sm text-gray-600">{reminder.dosage}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(reminder.doseTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                          <div>
                            {reminder.taken ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Taken
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Bills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-green-600" />
                      Recent Bills
                    </CardTitle>
                    <CardDescription>
                      Your latest billing activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patientData.financial.profile?.activeBills.slice(0, 3).map((bill) => (
                        <div key={bill.billId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{bill.billId}</p>
                            <p className="text-sm text-gray-600">{bill.department}</p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{PatientFinanceIntegration.formatCurrency(bill.pendingAmount)}</p>
                            <Badge className={PatientFinanceIntegration.getBillStatusColor(bill.status)}>
                              {bill.status}
                            </Badge>
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
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <Button 
                      className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        if (patientData?.financial.profile?.activeBills.length) {
                          setSelectedBill(patientData.financial.profile.activeBills[0]);
                          setShowMpesaModal(true);
                        }
                      }}
                    >
                      <Smartphone className="h-6 w-6 mb-2" />
                      Pay with M-Pesa
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Pill className="h-6 w-6 mb-2" />
                      Refill Rx
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Calendar className="h-6 w-6 mb-2" />
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Phone className="h-6 w-6 mb-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs with placeholder content */}
            <TabsContent value="medications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medication Management</CardTitle>
                  <CardDescription>Track your medications and adherence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Detailed medication management available in integrated portal</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>Manage your hospital bills and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Detailed billing management available in patient billing section</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Profile</CardTitle>
                  <CardDescription>Your personal and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{patientData.personalInfo.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{patientData.personalInfo.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{patientData.personalInfo.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Insurance Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <Badge className={
                              patientData.financial.insuranceStatus === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }>
                              {patientData.financial.insuranceStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* M-Pesa Payment Modal */}
        {showMpesaModal && selectedBill && (
          <MpesaPaymentModal
            isOpen={showMpesaModal}
            onClose={() => {
              setShowMpesaModal(false);
              setSelectedBill(null);
            }}
            billId={selectedBill.billId}
            amount={selectedBill.pendingAmount}
            patientId={session?.userId || 'user_001'}
            onPaymentSuccess={(transactionId) => {
              console.log('Payment successful:', transactionId);
              setShowMpesaModal(false);
              setSelectedBill(null);
              loadPatientData(); // Refresh data
            }}
          />
        )}
      </MainLayout>
    </AuthGuard>
  );
}