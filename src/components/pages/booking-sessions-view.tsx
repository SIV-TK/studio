'use client';

import { useState, useEffect } from 'react';
import { UserDataStore } from '@/lib/user-data-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

export function BookingSessionsView() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookingSessions = async () => {
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        try {
          const userData = await UserDataStore.getComprehensiveUserData(userId);
          setConsultations(userData.consultations || []);
        } catch (error) {
          console.error('Error loading booking sessions:', error);
        }
      }
      setLoading(false);
    };

    loadBookingSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Booking Sessions</h3>
        <p className="text-gray-500">You haven't booked any appointments yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6">
        {consultations.map((consultation) => (
          <Card key={consultation.id} className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    {consultation.doctorName}
                  </CardTitle>
                  <p className="text-muted-foreground">{consultation.specialty}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Scheduled
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(consultation.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{consultation.followUp}</span>
                </div>
              </div>
              
              {consultation.recommendations && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Reason for Visit:</h4>
                  <p className="text-sm text-gray-600">{consultation.recommendations}</p>
                </div>
              )}
              
              {consultation.diagnosis !== 'Scheduled appointment' && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Diagnosis:</h4>
                  <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}