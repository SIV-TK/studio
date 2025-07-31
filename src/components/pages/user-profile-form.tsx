'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserDataStore } from '@/lib/user-data-store';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(1).max(120, 'Please enter a valid age'),
  gender: z.string().min(1, 'Please select gender'),
  healthProfile: z.string().min(1, 'Please select health profile'),
  allergies: z.string(),
  conditions: z.string(),
  emergencyContact: z.string().min(10, 'Please provide emergency contact'),
});


import { useEffect } from 'react';

export function UserProfileForm() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [viewMode, setViewMode] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      age: 0,
      gender: '',
      healthProfile: '',
      allergies: '',
      conditions: '',
      emergencyContact: '',
    },
  });

  // Load existing profile data on mount
  useEffect(() => {
    const loadProfileData = async () => {
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        try {
          const userData = await UserDataStore.getComprehensiveUserData(userId);
          setProfileData(userData.profile || null);
          form.reset({
            name: userData.profile?.name || '',
            age: userData.profile?.age || 0,
            gender: userData.profile?.gender || '',
            healthProfile: userData.profile?.healthProfile || '',
            allergies: userData.profile?.allergies?.join(', ') || '',
            conditions: userData.profile?.conditions?.join(', ') || '',
            emergencyContact: userData.profile?.emergencyContact || '',
          });
        } catch (error) {
          // ignore if not found
        }
      }
    };
    loadProfileData();
  }, []);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setLoading(true);
    try {
      const allergiesArray = values.allergies.split(',').map(a => a.trim()).filter(a => a);
      const conditionsArray = values.conditions.split(',').map(c => c.trim()).filter(c => c);
      
      const newUserId = await UserDataStore.createUserProfile({
        ...values,
        allergies: allergiesArray,
        conditions: conditionsArray,
      });
      
      setUserId(newUserId);
      localStorage.setItem('currentUserId', newUserId);
      
      toast({
        title: 'Profile Created',
        description: `Your profile has been created successfully. User ID: ${newUserId}`,
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {profileData && viewMode ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><span className="font-semibold">Full Name:</span> {profileData.name}</div>
                <div><span className="font-semibold">Age:</span> {profileData.age}</div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><span className="font-semibold">Gender:</span> {profileData.gender}</div>
                <div><span className="font-semibold">Health Profile:</span> {profileData.healthProfile}</div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><span className="font-semibold">Allergies:</span> {profileData.allergies?.join(', ') || '-'}</div>
                <div><span className="font-semibold">Medical Conditions:</span> {profileData.conditions?.join(', ') || '-'}</div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><span className="font-semibold">Emergency Contact:</span> {profileData.emergencyContact}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setViewMode(false)} className="flex-1 text-sm sm:text-base">
                  Edit Profile
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="healthProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Profile</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select profile" />
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
                <Button type="submit" disabled={loading} size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {profileData ? 'Update Health Profile' : 'Create Health Profile'}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    {/* Settings Section */}
    <Card className="shadow-lg mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="h-6 w-6" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">Email Notifications</span>
            <input type="checkbox" className="toggle toggle-success" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Dark Mode</span>
            <input type="checkbox" className="toggle toggle-dark" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Share Data for Research</span>
            <input type="checkbox" className="toggle toggle-info" />
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          These settings help personalize your experience and control your privacy.
        </div>
      </CardContent>
    </Card>
  </div>
  );
}