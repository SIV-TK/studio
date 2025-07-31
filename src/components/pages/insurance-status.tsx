'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { InsuranceFinanceService, PatientAccount } from '@/lib/insurance-finance-service';

interface InsuranceStatusProps {
  userId?: string;
}

export function InsuranceStatus({ userId }: InsuranceStatusProps) {
  const [account, setAccount] = useState<PatientAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadInsuranceData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadInsuranceData = async () => {
    try {
      const accountData = await InsuranceFinanceService.getPatientAccountSelf(userId || '');
      setAccount(accountData);
    } catch (error) {
      console.error('Error loading insurance data:', error);
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
        return <Shield className="h-4 w-4 text-gray-600" />;
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

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Checking insurance status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!account) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Insurance Coverage</p>
                <p className="text-xs text-gray-500">No active policy found</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/patient/insurance">
                Setup
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'border-green-200 bg-green-50';
      case 'Suspended':
        return 'border-red-200 bg-red-50';
      case 'Pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'Expired':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className={`${getStatusColor(account.accountStatus)}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {getStatusIcon(account.accountStatus)}
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-gray-900">
                  {account.planType} Insurance
                </p>
                <Badge 
                  variant={account.accountStatus === 'Active' ? 'default' : 'secondary'}
                  className={account.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {account.accountStatus}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-xs text-gray-600">
                  Coverage: {formatCurrency(account.remainingAmount)} remaining
                </p>
                <p className="text-xs text-gray-600">
                  Policy: {account.policyNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">Next Payment</p>
              <p className="text-sm font-semibold flex items-center">
                <CreditCard className="h-3 w-3 mr-1" />
                {new Date(account.nextPaymentDue).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/patient/insurance">
                View
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
