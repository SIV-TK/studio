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
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Users,
  Calendar,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Receipt
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';
import { 
  HospitalFinanceService, 
  HospitalBill, 
  FinancialDashboardData,
  PatientFinancialProfile 
} from '@/lib/hospital-finance-service';

interface FinancePageData {
  dashboardData: FinancialDashboardData | null;
  bills: HospitalBill[];
  overdueBills: HospitalBill[];
  loading: boolean;
  error: string | null;
}

export default function HospitalFinancePage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [financeData, setFinanceData] = useState<FinancePageData>({
    dashboardData: null,
    bills: [],
    overdueBills: [],
    loading: true,
    error: null
  });

  // Filters
  const [billsFilter, setBillsFilter] = useState({
    status: 'all',
    department: 'all',
    billType: 'all'
  });

  // Selected items
  const [selectedBill, setSelectedBill] = useState<HospitalBill | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientFinancialProfile | null>(null);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setFinanceData(prev => ({ ...prev, loading: true, error: null }));

      const [dashboardData, bills, overdueBills] = await Promise.all([
        HospitalFinanceService.getFinancialDashboard(),
        HospitalFinanceService.getAllBills(),
        HospitalFinanceService.getOverdueBills()
      ]);

      setFinanceData({
        dashboardData,
        bills,
        overdueBills,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading finance data:', error);
      setFinanceData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load finance data'
      }));
    }
  };

  const handleViewPatientProfile = async (patientId: string) => {
    try {
      const profile = await HospitalFinanceService.getPatientFinancialProfile(patientId);
      setSelectedPatient(profile);
    } catch (error) {
      console.error('Error loading patient profile:', error);
    }
  };

  const handleRecordPayment = async (billId: string, amount: number, method: string) => {
    try {
      await HospitalFinanceService.recordPayment(billId, {
        amount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: method as any,
        receivedBy: session?.user?.name || 'Finance Staff'
      });
      await loadFinanceData();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const formatCurrency = (amount: number) => HospitalFinanceService.formatCurrency(amount);

  if (financeData.loading) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading finance data...</p>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  const { dashboardData, bills, overdueBills } = financeData;

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hospital Finance Management</h1>
              <p className="text-gray-600 mt-2">Manage billing, payments, and financial operations</p>
            </div>
            <div className="flex space-x-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Bill
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {financeData.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{financeData.error}</p>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bills">Bills</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {dashboardData && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(dashboardData.totalRevenue)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(dashboardData.monthlyRevenue)}
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
                            <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(dashboardData.pendingAmount)}
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
                            <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(dashboardData.overdueAmount)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bills Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Bills Summary</CardTitle>
                        <CardDescription>Overview of all hospital bills</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Bills</span>
                            <Badge variant="outline">{dashboardData.totalBills}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Paid Bills</span>
                            <Badge className="bg-green-100 text-green-800">{dashboardData.paidBills}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Pending Bills</span>
                            <Badge className="bg-yellow-100 text-yellow-800">{dashboardData.pendingBills}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Overdue Bills</span>
                            <Badge className="bg-red-100 text-red-800">{dashboardData.overdueBills}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Revenue breakdown by payment method</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dashboardData.paymentMethodStats.map((method, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{method.method}</span>
                                <span className="font-medium">{formatCurrency(method.amount)}</span>
                              </div>
                              <Progress value={method.percentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Bills & Overdue Alerts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Bills</CardTitle>
                        <CardDescription>Latest billing activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {bills.slice(0, 5).map((bill) => (
                            <div key={bill.billId} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{bill.patientName}</p>
                                <p className="text-sm text-gray-600">{bill.department}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(bill.totalAmount)}</p>
                                <Badge className={HospitalFinanceService.getBillStatusColor(bill.status)}>
                                  {bill.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          Overdue Bills
                        </CardTitle>
                        <CardDescription>Bills requiring immediate attention</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {overdueBills.slice(0, 5).map((bill) => (
                            <div key={bill.billId} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                              <div>
                                <p className="font-medium">{bill.patientName}</p>
                                <p className="text-sm text-gray-600">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-red-600">{formatCurrency(bill.pendingAmount)}</p>
                                <Button size="sm" variant="outline" className="text-xs">
                                  Contact
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Bills Tab */}
            <TabsContent value="bills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Bills</CardTitle>
                  <CardDescription>Manage hospital bills and patient accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <select 
                      value={billsFilter.status} 
                      onChange={(e) => setBillsFilter(prev => ({...prev, status: e.target.value}))}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Fully Paid">Fully Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    
                    <select 
                      value={billsFilter.department} 
                      onChange={(e) => setBillsFilter(prev => ({...prev, department: e.target.value}))}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Departments</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Emergency">Emergency</option>
                    </select>

                    <select 
                      value={billsFilter.billType} 
                      onChange={(e) => setBillsFilter(prev => ({...prev, billType: e.target.value}))}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Types</option>
                      <option value="Inpatient">Inpatient</option>
                      <option value="Outpatient">Outpatient</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Surgery">Surgery</option>
                    </select>
                  </div>

                  {/* Bills Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bills.map((bill) => (
                        <TableRow key={bill.billId}>
                          <TableCell className="font-medium">{bill.billId}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{bill.patientName}</p>
                              <p className="text-sm text-gray-600">{bill.patientContact}</p>
                            </div>
                          </TableCell>
                          <TableCell>{bill.department}</TableCell>
                          <TableCell>
                            <Badge className={HospitalFinanceService.getBillTypeColor(bill.billType)}>
                              {bill.billType}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
                          <TableCell className="text-green-600">{formatCurrency(bill.paidAmount)}</TableCell>
                          <TableCell className="text-orange-600">{formatCurrency(bill.pendingAmount)}</TableCell>
                          <TableCell>
                            <Badge className={HospitalFinanceService.getBillStatusColor(bill.status)}>
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedBill(bill)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewPatientProfile(bill.patientId)}
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Processing</CardTitle>
                  <CardDescription>Record and track patient payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Payment processing interface coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {dashboardData && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Department Revenue</CardTitle>
                        <CardDescription>Revenue breakdown by department</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dashboardData.departmentRevenue.map((dept, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{dept.department}</span>
                                <span className="text-sm text-gray-600">{formatCurrency(dept.revenue)}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                                <span>Bills: {dept.billCount}</span>
                                <span>Avg: {formatCurrency(dept.averageBillAmount)}</span>
                                <span>Pending: {formatCurrency(dept.pendingAmount)}</span>
                              </div>
                              <Separator />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Services</CardTitle>
                        <CardDescription>Highest revenue generating services</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dashboardData.topServices.slice(0, 8).map((service, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{service.serviceName}</p>
                                <p className="text-sm text-gray-600">{service.department}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(service.revenue)}</p>
                                <p className="text-xs text-gray-600">{service.count} times</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>Generate and export financial reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Report generation interface coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bill Details Modal */}
          {selectedBill && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto m-4">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Bill Details - {selectedBill.billId}</h2>
                    <Button variant="outline" onClick={() => setSelectedBill(null)}>
                      Close
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {selectedBill.patientName}</p>
                        <p><strong>Contact:</strong> {selectedBill.patientContact}</p>
                        <p><strong>Admission:</strong> {new Date(selectedBill.admissionDate).toLocaleDateString()}</p>
                        {selectedBill.dischargeDate && (
                          <p><strong>Discharge:</strong> {new Date(selectedBill.dischargeDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
                      <div className="space-y-2">
                        <p><strong>Total Amount:</strong> {formatCurrency(selectedBill.totalAmount)}</p>
                        <p><strong>Paid Amount:</strong> {formatCurrency(selectedBill.paidAmount)}</p>
                        <p><strong>Pending Amount:</strong> {formatCurrency(selectedBill.pendingAmount)}</p>
                        <p><strong>Due Date:</strong> {new Date(selectedBill.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Services</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBill.services.map((service) => (
                          <TableRow key={service.serviceId}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{service.serviceName}</p>
                                <p className="text-sm text-gray-600">{service.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>{service.department}</TableCell>
                            <TableCell>{service.quantity}</TableCell>
                            <TableCell>{formatCurrency(service.unitPrice)}</TableCell>
                            <TableCell>{formatCurrency(service.totalPrice)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {selectedBill.paymentHistory.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Received By</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedBill.paymentHistory.map((payment) => (
                            <TableRow key={payment.paymentId}>
                              <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                              <TableCell>{formatCurrency(payment.amount)}</TableCell>
                              <TableCell>{payment.paymentMethod}</TableCell>
                              <TableCell>{payment.receivedBy}</TableCell>
                              <TableCell>{payment.notes || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
