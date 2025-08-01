'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Shield, Wallet, Settings } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function ProfilePage() {
  const { session } = useSession();
  const [userType, setUserType] = useState<string>('general');
  const [insurancePlan, setInsurancePlan] = useState<string>('Free Mode');
  const [billingBalance, setBillingBalance] = useState<number>(0);

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') || 'general';
    setUserType(savedUserType);
    // Mock data - replace with actual API calls
    setInsurancePlan('Standard Plan');
    setBillingBalance(2500);
  }, []);

  const userInfo = {
    name: session?.name || 'John Doe',
    email: session?.email || 'john.doe@example.com',
    phone: '+254 712 345 678',
    age: 32,
    gender: 'Male',
    bloodType: 'O+',
    emergencyContact: 'Jane Doe - +254 712 345 679'
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your personal information and settings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-lg font-semibold">{userInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{userInfo.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-lg">{userInfo.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-lg">{userInfo.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-lg">{userInfo.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Blood Type</label>
                    <p className="text-lg">{userInfo.bloodType}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                  <p className="text-lg">{userInfo.emergencyContact}</p>
                </div>
                <Button className="mt-4">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">User Mode</label>
                  <Badge className="ml-2 capitalize">{userType}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Insurance Plan</label>
                  <p className="text-sm text-blue-600 font-medium">{insurancePlan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Type</label>
                  <p className="text-sm">Premium Member</p>
                </div>
              </CardContent>
            </Card>

            {/* Billing Balance */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Billing Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">KSh {billingBalance.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mb-4">Outstanding Balance</p>
                  <Link href="/billing">
                    <Button size="sm" className="w-full">
                      View Bills
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Link href="/profile/edit">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/insurance">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Insurance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}