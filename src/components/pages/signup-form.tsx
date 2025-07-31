'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirestoreService } from '@/lib/firestore-service';
import { HospitalDirectoryService } from '@/lib/hospital-directory-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus, User, Stethoscope, Heart, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  userType: z.enum(['doctor', 'patient', 'general'], {
    required_error: 'Please select your user type',
  }),
  hospitalName: z.string().optional(),
  medicalLicense: z.string().optional(),
  specialization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.userType === 'doctor') {
    return data.hospitalName && data.hospitalName.length > 0 && data.medicalLicense && data.medicalLicense.length > 0;
  }
  return true;
}, {
  message: "Hospital name and medical license are required for doctors",
  path: ["hospitalName"],
});

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: undefined,
      hospitalName: '',
      medicalLicense: '',
      specialization: '',
    },
  });

  const userType = form.watch('userType');

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setLoading(true);
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: values.name
      });

      // Create initial user profile in Firestore
      await FirestoreService.createUserProfile(user.uid, {
        name: values.name,
        userType: values.userType,
        hospitalName: values.hospitalName || '',
        medicalLicense: values.medicalLicense || '',
        specialization: values.specialization || '',
        age: 0,
        gender: '',
        healthProfile: '',
        allergies: [],
        conditions: [],
        emergencyContact: ''
      });

      // Register doctor with hospital directory if doctor
      if (values.userType === 'doctor' && values.hospitalName && values.medicalLicense) {
        await HospitalDirectoryService.registerDoctor({
          userId: user.uid,
          name: values.name,
          hospitalName: values.hospitalName,
          medicalLicense: values.medicalLicense,
          specialization: values.specialization || '',
          isActive: true
        });
      }

      // Set user type in localStorage for navigation
      localStorage.setItem('userType', values.userType);

      toast({
        title: 'Account Created Successfully!',
        description: `Welcome ${values.name}! You've been registered as a ${values.userType}.`,
      });
      
      // Redirect based on user type
      setTimeout(() => {
        const redirectMap = {
          doctor: '/doctor/dashboard',
          patient: '/patient/dashboard',
          general: '/general/dashboard'
        };
        window.location.href = redirectMap[values.userType] || '/dashboard';
      }, 2000);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message || 'An error occurred during registration. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-center">
            <User className="h-6 w-6" />
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="doctor">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            <div>
                              <div className="font-medium">Doctor/Medical Professional</div>
                              <div className="text-xs text-gray-500">Hospital management & patient care</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <div>
                              <div className="font-medium">Patient</div>
                              <div className="text-xs text-gray-500">Disease monitoring & health tracking</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="general">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <div>
                              <div className="font-medium">General User</div>
                              <div className="text-xs text-gray-500">Personalized health & wellness</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {userType === 'doctor' && (
                <>
                  <FormField
                    control={form.control}
                    name="hospitalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital/Clinic Name</FormLabel>
                        <FormControl>
                          <Input placeholder="General Hospital" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="MD123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Cardiology, Internal Medicine, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg" className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : ''} Account
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}