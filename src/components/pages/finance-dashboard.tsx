'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { 
  HospitalFinanceService, 
  FinancialDashboardData 
} from '@/lib/hospital-finance-service';

interface FinanceDashboardProps {
  showHeader?: boolean;
  compact?: boolean;
}

export default function FinanceDashboard({ showHeader = true, compact = false }: FinanceDashboardProps) {
  const [dashboardData, setDashboardData] = useState<FinancialDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HospitalFinanceService.getFinancialDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading finance dashboard:', error);
      setError('Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => HospitalFinanceService.formatCurrency(amount);

  if (loading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Finance Overview</h2>
            <Button variant="outline" size="sm">
              <Link href="/hospital-finance">View Details</Link>
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 w-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const collectionRate = dashboardData.totalRevenue > 0 
    ? ((dashboardData.totalRevenue / (dashboardData.totalRevenue + dashboardData.pendingAmount)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Finance Overview</h2>
            <p className="text-gray-600">Hospital billing and payment status</p>
          </div>
          <Link href="/hospital-finance">
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      )}

      {/* Key Financial Metrics */}
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
                <p className="text-xs text-green-600">Collected payments</p>
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
                <p className="text-xs text-blue-600">Current month</p>
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
                <p className="text-xs text-yellow-600">{dashboardData.pendingBills} bills</p>
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
                <p className="text-xs text-red-600">{dashboardData.overdueBills} bills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!compact && (
        <>
          {/* Bills Summary and Collection Rate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bills Summary</CardTitle>
                <CardDescription>Current status of all hospital bills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Fully Paid</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {dashboardData.paidBills}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Pending Payment</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {dashboardData.pendingBills}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Overdue</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800">
                      {dashboardData.overdueBills}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Collection Rate</span>
                      <span className="text-lg font-bold text-green-600">
                        {collectionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Departments by Revenue</CardTitle>
                <CardDescription>Revenue leaders this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.departmentRevenue
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((dept, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-gray-600">
                          {dept.billCount} bills • Avg: {formatCurrency(dept.averageBillAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatCurrency(dept.revenue)}
                        </p>
                        {dept.pendingAmount > 0 && (
                          <p className="text-xs text-orange-600">
                            {formatCurrency(dept.pendingAmount)} pending
                          </p>
                        )}
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
              <CardDescription>Common finance management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/hospital-finance?tab=bills&filter=overdue">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    View Overdue Bills ({dashboardData.overdueBills})
                  </Button>
                </Link>
                
                <Link href="/hospital-finance?tab=payments">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                    Record Payment
                  </Button>
                </Link>
                
                <Link href="/hospital-finance?tab=analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
