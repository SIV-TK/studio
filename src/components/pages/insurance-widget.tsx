'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { InsuranceFinanceService, PatientAccount } from '@/lib/insurance-finance-service';
import { generalFinanceService } from '@/lib/general-finance-service';

interface InsuranceWidgetProps {
  userId?: string;
  compact?: boolean;
  onPlanSelected?: () => void;
}

export function InsuranceWidget({ userId, compact = false, onPlanSelected }: InsuranceWidgetProps) {
  const [account, setAccount] = useState<PatientAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadInsuranceData();
    }
  }, [userId]);

  const loadInsuranceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const accountData = await InsuranceFinanceService.getPatientAccountSelf(userId || '');
      setAccount(accountData);
    } catch (error) {
      console.error('Error loading insurance data:', error);
      setError('Unable to load insurance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Suspended':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Expired':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const handlePlanSelection = async (planName: string, price: number) => {
    if (!userId) return;
    
    try {
      const result = await generalFinanceService.purchaseInsurancePlan(planName, price, userId);
      if (result.success) {
        onPlanSelected?.();
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  if (loading) {
    return (
      <Card className={compact ? "h-32" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !account) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Choose Insurance Plan
          </CardTitle>
          <CardDescription>Select a plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Basic Plan', price: 1500, coverage: '50K', features: ['Emergency Care', 'Basic Checkups'] },
              { name: 'Standard Plan', price: 3000, coverage: '150K', features: ['Full Coverage', 'Specialist Care', 'Lab Tests'] },
              { name: 'Premium Plan', price: 5000, coverage: '500K', features: ['Comprehensive Care', 'Dental & Vision', 'International Coverage'] }
            ].map((plan) => (
              <div key={plan.name} className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-gray-600">Coverage: KSh {plan.coverage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">KSh {plan.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">/month</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {plan.features.join(' • ')}
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handlePlanSelection(plan.name, plan.price)}
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = calculateUsagePercentage(account.usedAmount, account.totalCoverage);

  if (compact) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Insurance</span>
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
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Coverage Used</span>
              <span>{usagePercentage}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{formatCurrency(account.usedAmount)} used</span>
              <span>{formatCurrency(account.remainingAmount)} remaining</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-4" asChild>
            <Link href="/patient/insurance">
              View Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Insurance Coverage</span>
          </CardTitle>
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
        <CardDescription>
          {account.planType} Plan • Policy: {account.policyNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Coverage Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            </div>
            <p className="text-sm text-gray-600">Total Coverage</p>
            <p className="font-semibold">{formatCurrency(account.totalCoverage)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
            </div>
            <p className="text-sm text-gray-600">Used</p>
            <p className="font-semibold">{formatCurrency(account.usedAmount)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Shield className="h-4 w-4 text-blue-600 mr-1" />
            </div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="font-semibold">{formatCurrency(account.remainingAmount)}</p>
          </div>
        </div>

        {/* Usage Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Coverage Used</span>
            <span>{usagePercentage}%</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Monthly Premium</p>
            <p className="font-semibold">{formatCurrency(account.monthlyPremium)}</p>
          </div>
          <div>
            <p className="text-gray-600">Copay</p>
            <p className="font-semibold">{formatCurrency(account.copayAmount)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/patient/insurance">
              View Full Details
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
