'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  Droplets,
  Trophy,
  Calendar,
  Brain,
  Plus,
  TrendingUp,
  Award
} from 'lucide-react';

interface BloodDonationCardProps {
  userType: 'patient' | 'general';
  userProfile: {
    bloodType: string;
    totalDonations: number;
    totalPoints: number;
    nextEligibleDate: string;
    eligibilityStatus: string;
  };
}

export default function BloodDonationCard({ userType, userProfile }: BloodDonationCardProps) {
  const getPointsBadgeColor = (points: number) => {
    if (points >= 1000) return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    if (points >= 500) return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    if (points >= 200) return 'bg-gradient-to-r from-green-500 to-teal-500 text-white';
    return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'eligible':
        return 'text-green-600 bg-green-50';
      case 'not eligible':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Blood Donation Hub
            </CardTitle>
            <CardDescription>
              Track your donation history and earn life-saving rewards
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-600">
              <Droplets className="h-3 w-3 mr-1" />
              {userProfile.bloodType}
            </Badge>
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${getPointsBadgeColor(userProfile.totalPoints)}`}>
              <Trophy className="h-3 w-3 inline mr-1" />
              {userProfile.totalPoints}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{userProfile.totalDonations}</div>
            <div className="text-xs text-red-800">Total Donations</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-semibold text-blue-600">{userProfile.nextEligibleDate}</div>
            <div className="text-xs text-blue-800">Next Eligible</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Donation Status</span>
            <Badge className={getStatusColor(userProfile.eligibilityStatus)}>
              {userProfile.eligibilityStatus}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button className="w-full" size="sm">
            <Calendar className="h-3 w-3 mr-2" />
            Find Blood Drives
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              View History
            </Button>
            <Button variant="outline" size="sm">
              <Brain className="h-3 w-3 mr-1" />
              AI Guide
            </Button>
          </div>
          
          {userProfile.totalDonations > 0 && (
            <div className="text-center pt-2 border-t">
              <div className="text-xs text-gray-600 mb-1">Latest Achievement</div>
              <div className="flex items-center justify-center gap-1">
                <Award className="h-3 w-3 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-600">
                  {userProfile.totalDonations >= 10 ? 'Gold Donor' : 
                   userProfile.totalDonations >= 5 ? 'Silver Donor' : 'Bronze Donor'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
          <div className="text-xs text-center text-red-800">
            {userProfile.totalDonations === 0 
              ? "🩸 Every donation can save up to 3 lives! Ready to be a hero?"
              : `🎉 You've potentially saved ${userProfile.totalDonations * 3} lives! Keep it up!`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
