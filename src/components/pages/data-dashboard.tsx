'use client';

import { useState, useEffect } from 'react';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, FileText, Stethoscope, Pill, Activity, RefreshCw } from 'lucide-react';

export function DataDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        const data = await UserDataStore.getComprehensiveUserData(currentUser.userId);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Health Data Overview</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {userData?.profile && (
          <>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">
                  <strong>{userData.profile.name}</strong><br />
                  {userData.profile.age} years, {userData.profile.gender}<br />
                  Profile: {userData.profile.healthProfile}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <FileText className="h-5 w-5" />
                  Lab Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-800">{userData.labResults?.length || 0}</p>
                <p className="text-sm text-green-700">Total lab tests</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Stethoscope className="h-5 w-5" />
                  Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-800">{userData.consultations?.length || 0}</p>
                <p className="text-sm text-purple-700">Doctor visits</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Pill className="h-5 w-5" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-800">
                  {userData.medications?.filter((m: any) => m.status === 'active').length || 0}
                </p>
                <p className="text-sm text-orange-700">Active medications</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {userData?.consultations && userData.consultations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData.consultations.slice(-3).map((consult: any) => (
                <div key={consult.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Dr. {consult.doctorName} - {consult.specialty}</p>
                  <p className="text-sm text-muted-foreground">{consult.date}</p>
                  <p className="text-sm">{consult.diagnosis}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}