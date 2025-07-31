'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import { useSession } from '@/hooks/use-session';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  age: z.coerce.number().min(1).max(120, 'Please enter a valid age'),
  gender: z.string().min(1, 'Please select gender'),
  healthProfile: z.string().min(1, 'Please select health profile'),
  allergies: z.string(),
  conditions: z.string(),
  emergencyContact: z.string().min(10, 'Please provide emergency contact'),
  currentMedications: z.string(),
  bloodType: z.string(),
});


interface HealthProfilePopupProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function HealthProfilePopup({ isOpen, onComplete }: HealthProfilePopupProps) {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const { toast } = useToast();
  const { session } = useSession();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: 0,
      gender: '',
      healthProfile: '',
      allergies: '',
      conditions: '',
      emergencyContact: '',
      currentMedications: '',
      bloodType: '',
    },
  });

  // Load existing profile data when popup opens
  useEffect(() => {
    const loadProfileData = async () => {
      if (isOpen && session?.userId) {
        try {
          const userData = await UserDataStore.getComprehensiveUserData(session.userId);
          setProfileData(userData.profile || null);
          const activeMeds = userData.medications?.filter(m => m.status === 'active').map(m => m.medication).join(', ') || '';
          form.reset({
            age: userData.profile?.age || 0,
            gender: userData.profile?.gender || '',
            healthProfile: userData.profile?.healthProfile || '',
            allergies: userData.profile?.allergies?.join(', ') || '',
            conditions: userData.profile?.conditions?.join(', ') || '',
            emergencyContact: userData.profile?.emergencyContact || '',
            currentMedications: activeMeds,
            bloodType: '',
          });
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      }
    };
    loadProfileData();
    setViewMode(true);
  }, [isOpen, session?.userId, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setLoading(true);
    try {
      // Get the authenticated user ID from session instead of localStorage
      if (!session?.userId) {
        throw new Error('No authenticated user found');
      }
      
      const userId = session.userId;
      const allergiesArray = values.allergies.split(',').map(a => a.trim()).filter(a => a);
      const conditionsArray = values.conditions.split(',').map(c => c.trim()).filter(c => c);
      
      await UserDataStore.updateUserProfile(userId, {
        age: values.age,
        gender: values.gender,
        healthProfile: values.healthProfile,
        allergies: allergiesArray,
        conditions: conditionsArray,
        emergencyContact: values.emergencyContact,
      });

      // Add medications if provided
      if (values.currentMedications) {
        const medications = values.currentMedications.split(',').map(m => m.trim()).filter(m => m);
        for (const med of medications) {
          await UserDataStore.addMedication({
            userId: userId,
            medication: med,
            dosage: 'As prescribed',
            frequency: 'Daily',
            startDate: new Date().toISOString(),
            prescribedBy: 'Self-reported',
            status: 'active',
          });
        }
      }

      toast({
        title: 'Profile Updated Successfully!',
        description: 'Your health profile has been personalized. The system will now provide tailored recommendations.',
      });

      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-blue-600" />
            {profileData && viewMode ? 'Your Health Profile' : 'Complete Your Health Profile'}
          </DialogTitle>
          <p className="text-muted-foreground">
            {profileData && viewMode
              ? 'Review your health profile below. Click Edit to make changes.'
              : 'Complete your health information to get personalized AI recommendations and tailored medical guidance.'}
          </p>
          {!profileData && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
              <p className="text-sm text-blue-800 font-medium">
                🎯 Why complete your profile? Get personalized recommendations, medication reminders, and AI-powered health insights tailored specifically for you!
              </p>
            </div>
          )}
        </DialogHeader>

        {viewMode && profileData ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><span className="font-semibold">Age:</span> {profileData.age}</div>
              <div><span className="font-semibold">Gender:</span> {profileData.gender}</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><span className="font-semibold">Primary Health Profile:</span> {profileData.healthProfile}</div>
              <div><span className="font-semibold">Blood Type:</span> {profileData.bloodType || '-'}</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><span className="font-semibold">Emergency Contact:</span> {profileData.emergencyContact}</div>
              <div><span className="font-semibold">Allergies:</span> {profileData.allergies?.join(', ') || '-'}</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><span className="font-semibold">Medical Conditions:</span> {profileData.conditions?.join(', ') || '-'}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
              <Button type="button" variant="outline" onClick={onComplete} className="flex-1 text-sm sm:text-base">
                Close
              </Button>
              <Button type="button" onClick={() => setViewMode(false)} className="flex-1 text-sm sm:text-base">
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="healthProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Health Profile</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary health profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Adult</SelectItem>
                        <SelectItem value="pregnant">Pregnant</SelectItem>
                        <SelectItem value="pediatric">Pediatric</SelectItem>
                        <SelectItem value="elderly">Elderly (65+)</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="hypertension">Hypertension</SelectItem>
                        <SelectItem value="cancer">Cancer Patient</SelectItem>
                        <SelectItem value="hiv">HIV/AIDS</SelectItem>
                        <SelectItem value="kidney_disease">Kidney Disease</SelectItem>
                        <SelectItem value="heart_disease">Heart Disease</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="A+, B-, O+, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Name and phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Penicillin, Peanuts, Shellfish" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Diabetes, Hypertension, Asthma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications (comma-separated, optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Metformin, Lisinopril, Albuterol..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onComplete}
                  className="flex-1 text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} size="lg" className="flex-1 text-sm sm:text-base">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}