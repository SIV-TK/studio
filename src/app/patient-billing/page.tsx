'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Receipt,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  FileText,
  Building,
  Smartphone
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';
import { 
  HospitalFinanceService, 
  HospitalBill, 
  PatientFinancialProfile 
} from '@/lib/hospital-finance-service';
import MpesaPaymentModal from '@/components/ui/mpesa-payment-modal';

interface PatientBillingData {
  profile: PatientFinancialProfile | null;
  bills: HospitalBill[];
  loading: boolean;
  error: string | null;
}

export default function PatientBillingPage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [billingData, setBillingData] = useState<PatientBillingData>({
    profile: null,
    bills: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    // Mock session for demo
    setSession({ user: { id: 'user_001', name: 'John Doe' } });
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadBillingData();
    }
  }, [session]);

  const loadBillingData = async () => {
    try {
      setBillingData(prev => ({ ...prev, loading: true, error: null }));

      const [profile, bills] = await Promise.all([
        HospitalFinanceService.getPatientFinancialProfile(session.user.id),
        HospitalFinanceService.getBillsByPatient(session.user.id)
      ]);

      setBillingData({
        profile,
        bills,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading billing data:', error);
      setBillingData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load billing information'
      }));
    }
  };

  const formatCurrency = (amount: number) => HospitalFinanceService.formatCurrency(amount);

  if (billingData.loading) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your billing information...</p>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  const { profile, bills } = billingData;

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bills</h1>
              <p className="text-gray-600 mt-2">View and manage your hospital bills and payments</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Statement
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (profile?.activeBills.length) {
                    setSelectedBill(profile.activeBills[0]);
                    setShowMpesaModal(true);
                  }
                }}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Pay with M-Pesa
              </Button>
            </div>
          </div>

          {billingData.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{billingData.error}</p>
              </div>
            </div>
          )}

          {!profile ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Billing Information</h3>
                <p className="text-gray-600">You don't have any bills at this time.</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bills">My Bills</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Account Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Billed</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(profile.totalAmount)}
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
                            {formatCurrency(profile.paidAmount)}
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
                            {formatCurrency(profile.pendingAmount)}
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
                            {formatCurrency(profile.overdueAmount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Progress</CardTitle>
                    <CardDescription>Your current payment status across all bills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Paid: {formatCurrency(profile.paidAmount)}</span>
                          <span>Total: {formatCurrency(profile.totalAmount)}</span>
                        </div>
                        <Progress 
                          value={(profile.paidAmount / profile.totalAmount) * 100} 
                          className="h-3"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{profile.totalBills}</p>
                          <p className="text-sm text-gray-600">Total Bills</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {bills.filter(b => b.status === 'Fully Paid').length}
                          </p>
                          <p className="text-sm text-gray-600">Paid Bills</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">
                            {profile.activeBills.length}
                          </p>
                          <p className="text-sm text-gray-600">Active Bills</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Bills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Bills</CardTitle>
                    <CardDescription>Bills requiring your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.activeBills.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                          <p className="text-gray-600">All your bills are fully paid!</p>
                        </div>
                      ) : (
                        profile.activeBills.map((bill) => (
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
                              <p className="font-medium">{formatCurrency(bill.pendingAmount)}</p>
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
              </TabsContent>

              {/* Bills Tab */}
              <TabsContent value="bills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Bills</CardTitle>
                    <CardDescription>Complete history of your hospital bills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bill ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Paid</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bills.map((bill) => (
                          <TableRow key={bill.billId}>
                            <TableCell className="font-medium">{bill.billId}</TableCell>
                            <TableCell>{new Date(bill.admissionDate).toLocaleDateString()}</TableCell>
                            <TableCell>{bill.department}</TableCell>
                            <TableCell>
                              <Badge className={HospitalFinanceService.getBillTypeColor(bill.billType)}>
                                {bill.billType}
                              </Badge>
                            </TableCell>
                            <TableCell>{bill.doctorName}</TableCell>
                            <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
                            <TableCell className="text-green-600">{formatCurrency(bill.paidAmount)}</TableCell>
                            <TableCell className="text-orange-600">{formatCurrency(bill.pendingAmount)}</TableCell>
                            <TableCell>
                              <Badge className={HospitalFinanceService.getBillStatusColor(bill.status)}>
                                {bill.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                {bill.pendingAmount > 0 && (
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      setSelectedBill(bill);
                                      setShowMpesaModal(true);
                                    }}
                                  >
                                    <Smartphone className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment History Tab */}
              <TabsContent value="payments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Record of all your payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.paymentHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No payment history found</p>
                        </div>
                      ) : (
                        profile.paymentHistory
                          .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                          .map((payment) => (
                          <div key={payment.paymentId} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">{formatCurrency(payment.amount)}</p>
                                <p className="text-sm text-gray-600">
                                  {payment.paymentMethod} • {payment.receivedBy}
                                </p>
                                {payment.notes && (
                                  <p className="text-xs text-gray-500">{payment.notes}</p>
                                )}
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
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Support Tab */}
              <TabsContent value="support" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Billing Department</CardTitle>
                      <CardDescription>Get help with your bills and payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Phone</p>
                            <p className="text-sm text-gray-600">(555) 123-4567</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-gray-600">billing@hospital.com</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Office Hours</p>
                            <p className="text-sm text-gray-600">Mon-Fri: 8AM-6PM</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Options</CardTitle>
                      <CardDescription>Ways to pay your hospital bills</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-gray-600">Pay securely online with card or bank transfer</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Phone Payment</p>
                          <p className="text-sm text-gray-600">Call billing department to pay over phone</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">In-Person</p>
                          <p className="text-sm text-gray-600">Visit billing office during business hours</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Payment Plan</p>
                          <p className="text-sm text-gray-600">Set up monthly payment arrangements</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
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
            patientId={session?.user?.id || 'user_001'}
            onPaymentSuccess={(transactionId) => {
              console.log('Payment successful:', transactionId);
              setShowMpesaModal(false);
              setSelectedBill(null);
              loadBillingData(); // Refresh data
            }}
          />
        )}
      </MainLayout>
    </AuthGuard>
  );
}
