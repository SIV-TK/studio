'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  CreditCard, 
  FileText, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Activity,
  TrendingUp,
  Download,
  Eye,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';
import { InsuranceFinanceService, PatientAccount, HospitalClaim } from '@/lib/insurance-finance-service';

interface PatientInsuranceData {
  account: PatientAccount | null;
  claims: HospitalClaim[];
  loading: boolean;
  error: string | null;
}

export default function PatientInsurancePage() {
  const { session } = useSession();
  const [insuranceData, setInsuranceData] = useState<PatientInsuranceData>({
    account: null,
    claims: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (session?.userId) {
      loadInsuranceData();
    }
  }, [session]);

  const loadInsuranceData = async () => {
    try {
      setInsuranceData(prev => ({ ...prev, loading: true, error: null }));
      
      // Load patient account data
      const account = await InsuranceFinanceService.getPatientAccountSelf(session?.userId || '');
      
      // Load patient claims
      const claims = account ? await InsuranceFinanceService.getClaimsByPatientSelf(account.patientId) : [];
      
      setInsuranceData({
        account,
        claims,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading insurance data:', error);
      setInsuranceData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load insurance data'
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Suspended':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Expired':
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  if (insuranceData.loading) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading insurance information...</p>
              </div>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  if (insuranceData.error) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Error loading insurance data: {insuranceData.error}</span>
                </div>
                <Button 
                  onClick={loadInsuranceData} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  if (!insuranceData.account) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Insurance Coverage Found</h3>
                <p className="text-gray-600 mb-6">
                  You don't currently have an active insurance policy in our system.
                </p>
                <div className="space-y-2">
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <p className="text-sm text-gray-500">
                    Need help finding your insurance information? Our support team can assist you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  const account = insuranceData.account;
  const usagePercentage = calculateUsagePercentage(account.usedAmount, account.totalCoverage);
  const deductibleProgress = (account.deductibleMet / account.deductible) * 100;

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Insurance</h1>
              <p className="text-gray-600">View your policy details, coverage, and claims</p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(account.accountStatus)}
              <Badge 
                variant={account.accountStatus === 'Active' ? 'default' : 'secondary'}
                className={account.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : ''}
              >
                {account.accountStatus}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="coverage">Coverage</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Policy Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Plan Type</p>
                        <p className="text-2xl font-bold text-gray-900">{account.planType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Coverage</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.totalCoverage)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Used Amount</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.usedAmount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Target className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Remaining</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.remainingAmount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Coverage Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Usage</CardTitle>
                  <CardDescription>
                    You've used {usagePercentage}% of your annual coverage limit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Used: {formatCurrency(account.usedAmount)}</span>
                        <span>Total: {formatCurrency(account.totalCoverage)}</span>
                      </div>
                      <Progress value={usagePercentage} className="h-2" />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Deductible Progress</span>
                        <span>{formatCurrency(account.deductibleMet)} / {formatCurrency(account.deductible)}</span>
                      </div>
                      <Progress value={deductibleProgress} className="h-2" />
                      {account.deductibleMet >= account.deductible && (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Deductible met for this year
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Policy Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Policy Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Policy Number</p>
                        <p className="text-lg font-semibold">{account.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Copay Amount</p>
                        <p className="text-lg font-semibold">{formatCurrency(account.copayAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Premium</p>
                        <p className="text-lg font-semibold">{formatCurrency(account.monthlyPremium)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Last Claim Date</p>
                        <p className="text-lg font-semibold">{new Date(account.lastClaimDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Next Payment Due</p>
                        <p className="text-lg font-semibold">{new Date(account.nextPaymentDue).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Yearly Premium Paid</p>
                        <p className="text-lg font-semibold">{formatCurrency(account.yearlyPremiumPaid)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Coverage Tab */}
            <TabsContent value="coverage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Details</CardTitle>
                  <CardDescription>Your {account.planType} plan benefits and limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Medical Coverage</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Annual Deductible</span>
                            <span className="font-semibold">{formatCurrency(account.deductible)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Copay (Primary Care)</span>
                            <span className="font-semibold">{formatCurrency(account.copayAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Coverage Limit</span>
                            <span className="font-semibold">{formatCurrency(account.totalCoverage)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Plan Features</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Emergency Care</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Prescription Drugs</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Preventive Care</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Specialist Visits</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Lab Tests & Diagnostics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Claims Tab */}
            <TabsContent value="claims" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Claims</CardTitle>
                  <CardDescription>Your claim history and status</CardDescription>
                </CardHeader>
                <CardContent>
                  {insuranceData.claims.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No claims found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {insuranceData.claims.map((claim) => (
                        <div key={claim.claimId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{claim.description}</h4>
                              <p className="text-sm text-gray-600">{claim.hospitalName}</p>
                              <p className="text-sm text-gray-500">Service Date: {new Date(claim.serviceDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">{formatCurrency(claim.claimAmount)}</p>
                              <Badge className={InsuranceFinanceService.getClaimStatusColor(claim.status)}>
                                {claim.status}
                              </Badge>
                            </div>
                          </div>
                          {claim.status === 'Approved' && claim.approvedAmount && (
                            <div className="mt-2 text-sm text-green-600">
                              Approved Amount: {formatCurrency(claim.approvedAmount)}
                            </div>
                          )}
                          {claim.status === 'Rejected' && claim.rejectionReason && (
                            <div className="mt-2 text-sm text-red-600">
                              Reason: {claim.rejectionReason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Premium payments and billing details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-4">Payment Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Monthly Premium</span>
                            <span className="font-semibold">{formatCurrency(account.monthlyPremium)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Year-to-Date Paid</span>
                            <span className="font-semibold">{formatCurrency(account.yearlyPremiumPaid)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Next Payment Due</span>
                            <span className="font-semibold">{new Date(account.nextPaymentDue).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-4">Contact Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-600" />
                            <span>1-800-INSURANCE</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-600" />
                            <span>support@insurance.com</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span>24/7 Customer Support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex space-x-4">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Policy
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Statements
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
