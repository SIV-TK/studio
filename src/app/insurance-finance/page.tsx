'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InsuranceAuthService } from '@/lib/insurance-auth-service';
import { InsuranceFinanceService, PatientAccount, HospitalClaim, FinancialSummary, BalanceSheetData } from '@/lib/insurance-finance-service';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  PieChart,
  BarChart3,
  Calculator,
  CreditCard,
  Wallet,
  Receipt,
  Building,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

export default function InsuranceFinancePage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Financial data
  const [patientAccounts, setPatientAccounts] = useState<PatientAccount[]>([]);
  const [hospitalClaims, setHospitalClaims] = useState<HospitalClaim[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // UI states
  const [selectedClaim, setSelectedClaim] = useState<HospitalClaim | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<PatientAccount | null>(null);
  const [claimsFilter, setClaimsFilter] = useState('all');
  const [accountsFilter, setAccountsFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Approval/Rejection
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalAmount, setApprovalAmount] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const userSession = InsuranceAuthService.getSession();
    if (!userSession) {
      router.push('/insurance-login');
      return;
    }
    setSession(userSession);
    loadFinanceData();
  }, [router]);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const [accounts, claims, summary, balance, analyticsData] = await Promise.all([
        InsuranceFinanceService.getAllPatientAccounts(),
        InsuranceFinanceService.getAllHospitalClaims(),
        InsuranceFinanceService.getFinancialSummary(),
        InsuranceFinanceService.getBalanceSheet(),
        InsuranceFinanceService.getFinancialAnalytics()
      ]);
      
      setPatientAccounts(accounts);
      setHospitalClaims(claims);
      setFinancialSummary(summary);
      setBalanceSheet(balance);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaim = async () => {
    if (!selectedClaim || !approvalAmount) return;
    
    setApprovalLoading(true);
    try {
      await InsuranceFinanceService.approveClaim(
        selectedClaim.claimId,
        parseFloat(approvalAmount),
        session.name
      );
      
      // Refresh data
      await loadFinanceData();
      setSelectedClaim(null);
      setApprovalAmount('');
    } catch (error) {
      console.error('Error approving claim:', error);
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleRejectClaim = async () => {
    if (!selectedClaim || !rejectionReason) return;
    
    setApprovalLoading(true);
    try {
      await InsuranceFinanceService.rejectClaim(
        selectedClaim.claimId,
        rejectionReason,
        session.name
      );
      
      // Refresh data
      await loadFinanceData();
      setSelectedClaim(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting claim:', error);
    } finally {
      setApprovalLoading(false);
    }
  };

  const filteredClaims = hospitalClaims.filter(claim => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = claimsFilter === 'all' || claim.status === claimsFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredAccounts = patientAccounts.filter(account => {
    const matchesSearch = account.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = accountsFilter === 'all' || account.accountStatus === accountsFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading finance data...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Finance Portal</h1>
                <p className="text-sm text-gray-600">{session.companyName} - Financial Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={loadFinanceData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => router.push('/insurance-dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="claims">Claims Management</TabsTrigger>
            <TabsTrigger value="accounts">Patient Accounts</TabsTrigger>
            <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Premiums</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialSummary?.totalPremiumsCollected.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Claims Paid</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialSummary?.totalClaimsPaid.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Loss ratio: {financialSummary?.lossRatio}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialSummary?.totalClaimsPending.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.claimsByStatus.pending} claims pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${financialSummary?.netIncome.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Profit margin: {financialSummary?.profitMargin}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Financial Health Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Financial Ratios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Combined Ratio</span>
                      <Badge className={financialSummary && financialSummary.combinedRatio < 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {financialSummary?.combinedRatio}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Loss Ratio</span>
                      <span className="text-sm font-medium">{financialSummary?.lossRatio}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Expense Ratio</span>
                      <span className="text-sm font-medium">{financialSummary?.expenseRatio}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cash Flow</span>
                      <span className="text-sm font-medium text-green-600">${financialSummary?.cashFlow.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Claims Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics?.claimsByStatus || {}).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{status.replace(/([A-Z])/g, ' $1')}</span>
                        <Badge className={InsuranceFinanceService.getClaimStatusColor(status)}>
                          {String(count)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Claims Management Tab */}
          <TabsContent value="claims" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Claims Management</h2>
                <p className="text-gray-600">Review and approve hospital claims</p>
              </div>
              <div className="flex gap-4">
                <Input
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <select
                  value={claimsFilter}
                  onChange={(e) => setClaimsFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Claims</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredClaims.map((claim) => (
                <Card key={claim.claimId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{claim.patientName}</h3>
                        <p className="text-sm text-gray-600">Claim ID: {claim.claimId}</p>
                        <p className="text-sm text-gray-600">{claim.hospitalName}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${claim.claimAmount.toLocaleString()}</div>
                        <Badge className={InsuranceFinanceService.getClaimStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                        <Badge className={InsuranceFinanceService.getPriorityColor(claim.priority)} variant="outline">
                          {claim.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Service Details</h4>
                        <p className="text-sm">{claim.description}</p>
                        <p className="text-xs text-gray-600 mt-1">Service Date: {claim.serviceDate}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Medical Information</h4>
                        <p className="text-sm">{claim.diagnosis}</p>
                        <p className="text-xs text-gray-600 mt-1">Type: {claim.claimType}</p>
                      </div>
                    </div>

                    {claim.status === 'Pending' || claim.status === 'Under Review' ? (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setSelectedClaim(claim)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review/Approve
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => setSelectedClaim(claim)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {claim.status === 'Approved' && claim.approvedAmount && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approved: ${claim.approvedAmount.toLocaleString()}
                          </div>
                        )}
                        {claim.status === 'Rejected' && (
                          <div className="flex items-center text-sm text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejected: {claim.rejectionReason}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Patient Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Patient Accounts</h2>
                <p className="text-gray-600">Monitor patient coverage and account balances</p>
              </div>
              <div className="flex gap-4">
                <Input
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <select
                  value={accountsFilter}
                  onChange={(e) => setAccountsFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Accounts</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredAccounts.map((account) => (
                <Card key={account.patientId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{account.patientName}</h3>
                        <p className="text-sm text-gray-600">Policy: {account.policyNumber}</p>
                        <p className="text-sm text-gray-600">Plan: {account.planType}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={InsuranceFinanceService.getAccountStatusColor(account.accountStatus)}>
                          {account.accountStatus}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">Premium: ${account.monthlyPremium}/month</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm text-blue-700">Total Coverage</h4>
                        <p className="text-xl font-bold text-blue-900">${account.totalCoverage.toLocaleString()}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm text-orange-700">Used Amount</h4>
                        <p className="text-xl font-bold text-orange-900">${account.usedAmount.toLocaleString()}</p>
                        <p className="text-xs text-orange-600">
                          {((account.usedAmount / account.totalCoverage) * 100).toFixed(1)}% utilized
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm text-green-700">Remaining</h4>
                        <p className="text-xl font-bold text-green-900">${account.remainingAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Deductible Status</h4>
                        <div className="flex justify-between text-sm">
                          <span>Met: ${account.deductibleMet}</span>
                          <span>Total: ${account.deductible}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(account.deductibleMet / account.deductible) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Payment Info</h4>
                        <p className="text-sm">Last Claim: {account.lastClaimDate}</p>
                        <p className="text-sm">Next Payment: {account.nextPaymentDue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Balance Sheet Tab */}
          <TabsContent value="balance-sheet" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Balance Sheet Analysis</h2>
              <p className="text-gray-600">Comprehensive financial position overview</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cash & Equivalents</span>
                      <span className="font-medium">${balanceSheet?.assets.cash.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Investments</span>
                      <span className="font-medium">${balanceSheet?.assets.investments.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Premiums Receivable</span>
                      <span className="font-medium">${balanceSheet?.assets.premiumsReceivable.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reinsurance Recoverables</span>
                      <span className="font-medium">${balanceSheet?.assets.reinsuranceRecoverables.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Assets</span>
                        <span className="font-bold text-lg">${balanceSheet?.assets.totalAssets.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Liabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Claim Reserves</span>
                      <span className="font-medium">${balanceSheet?.liabilities.claimReserves.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Unearned Premiums</span>
                      <span className="font-medium">${balanceSheet?.liabilities.unearmedPremiums.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accounts Payable</span>
                      <span className="font-medium">${balanceSheet?.liabilities.accountsPayable.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Liabilities</span>
                        <span className="font-bold text-lg">${balanceSheet?.liabilities.totalLiabilities.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Shareholders' Equity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Paid-in Capital</span>
                      <span className="font-medium">${balanceSheet?.equity.paidInCapital.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Retained Earnings</span>
                      <span className="font-medium">${balanceSheet?.equity.retainedEarnings.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Equity</span>
                        <span className="font-bold text-lg">${balanceSheet?.equity.totalEquity.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Ratios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Key Financial Ratios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Ratio</span>
                      <Badge className={balanceSheet && balanceSheet.ratios.currentRatio > 1.5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {balanceSheet?.ratios.currentRatio}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Debt-to-Equity</span>
                      <Badge className={balanceSheet && balanceSheet.ratios.debtToEquity < 1.0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {balanceSheet?.ratios.debtToEquity}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Return on Equity</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {balanceSheet?.ratios.returnOnEquity}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Asset Turnover</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {balanceSheet?.ratios.assetTurnover}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
              <p className="text-gray-600">Detailed insights into financial performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claims by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics?.claimsByType || {}).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(Number(count) / Object.values(analytics?.claimsByType || {}).reduce((a: number, b: any) => a + Number(b), 0)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{String(count)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Utilization Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Coverage Utilization</span>
                        <span className="text-sm font-medium">{analytics?.utilizationRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${analytics?.utilizationRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Claims Approval Rate</span>
                        <span className="text-sm font-medium">{analytics?.approvalRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${analytics?.approvalRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Claim Amount</span>
                        <span className="font-medium">${analytics?.averageClaimAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Claim Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review Claim: {selectedClaim.claimId}</CardTitle>
              <CardDescription>
                Patient: {selectedClaim.patientName} | Amount: ${selectedClaim.claimAmount.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Hospital</Label>
                  <p className="text-sm">{selectedClaim.hospitalName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Date</Label>
                  <p className="text-sm">{selectedClaim.serviceDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm">{selectedClaim.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Diagnosis</Label>
                <p className="text-sm">{selectedClaim.diagnosis}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="approvalAmount">Approved Amount ($)</Label>
                  <Input
                    id="approvalAmount"
                    type="number"
                    value={approvalAmount}
                    onChange={(e) => setApprovalAmount(e.target.value)}
                    placeholder={selectedClaim.claimAmount.toString()}
                    max={selectedClaim.claimAmount}
                  />
                </div>

                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedClaim(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectClaim}
                  variant="destructive"
                  disabled={approvalLoading || !rejectionReason}
                >
                  {approvalLoading ? 'Processing...' : 'Reject Claim'}
                </Button>
                <Button
                  onClick={handleApproveClaim}
                  disabled={approvalLoading || !approvalAmount}
                >
                  {approvalLoading ? 'Processing...' : 'Approve Claim'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
