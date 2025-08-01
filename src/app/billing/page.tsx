'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Wallet, Smartphone, CreditCard } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import { MainLayout } from '@/components/layout/main-layout';
import { generalFinanceService, type GeneralBill, type FinancialSummary } from '@/lib/general-finance-service';
import MpesaPaymentModal from '@/components/ui/mpesa-payment-modal';

export default function BillingPage() {
  const { session } = useSession();
  const [bills, setBills] = useState<GeneralBill[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<GeneralBill | null>(null);
  const [currentPlan, setCurrentPlan] = useState('Free Mode');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [billsData, summaryData] = await Promise.all([
      generalFinanceService.getBills(),
      generalFinanceService.getFinancialSummary()
    ]);
    setBills(billsData);
    setFinancialSummary(summaryData);
    setCurrentPlan('Standard Plan');
  };

  const handlePayBill = (bill: GeneralBill) => {
    setSelectedBill(bill);
    setShowMpesaModal(true);
  };

  const handlePaymentSuccess = () => {
    loadData();
    setShowMpesaModal(false);
    setSelectedBill(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Finance</h1>
          <p className="text-gray-600">Manage your payments and insurance plan</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{currentPlan}</h3>
                    <p className="text-gray-600">Active since January 2024</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly Premium</p>
                    <p className="font-semibold">KSh 3,000</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Coverage</p>
                    <p className="font-semibold">KSh 150,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-red-600" />
                  Recent Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{bill.description}</p>
                        <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">KSh {bill.amount.toLocaleString()}</p>
                        {bill.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="mt-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handlePayBill(bill)}
                          >
                            <Smartphone className="h-3 w-3 mr-1" />
                            Pay with M-Pesa
                          </Button>
                        )}
                        {bill.status === 'paid' && (
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-red-600">
                    KSh {financialSummary?.totalPending.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Total Paid</p>
                    <p className="font-semibold">KSh {financialSummary?.totalPaid.toLocaleString() || '0'}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">This Month</p>
                    <p className="font-semibold">KSh {financialSummary?.monthlySpending.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                  <Smartphone className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium">M-Pesa</p>
                    <p className="text-sm text-gray-600">Preferred payment method</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {selectedBill && (
          <MpesaPaymentModal
            isOpen={showMpesaModal}
            onClose={() => setShowMpesaModal(false)}
            billId={selectedBill.id}
            amount={selectedBill.amount}
            patientId={session?.userId || 'general-user'}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
}