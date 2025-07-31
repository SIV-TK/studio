'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from '@/hooks/use-session';
import { FirestoreService } from '@/lib/firestore-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useSession();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const session = await login(values.email, values.password);
      
      if (session) {
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${session.name}!`,
        });
        
        // Get user profile to determine user type
        const userProfile = await FirestoreService.getUserProfile(session.userId);
        if (userProfile && userProfile.userType) {
          localStorage.setItem('userType', userProfile.userType);
          
          // Redirect based on user type
          const redirectMap = {
            doctor: '/doctor/dashboard',
            patient: '/patient/dashboard',
            general: '/general/dashboard'
          };
          window.location.href = redirectMap[userProfile.userType] || '/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during login. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in-up">
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl rounded-3xl transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(186,85,211,0.37)]">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-purple-700 font-extrabold tracking-tight drop-shadow-sm">
            Login to MediAssist AI
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
              <FormLabel className="text-pink-700 font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} className="rounded-xl border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
              <FormLabel className="text-green-700 font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} className="rounded-xl border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <a href="#" className="text-sm text-purple-500 hover:underline transition-all">Forgot password?</a>
              </div>
              <Button type="submit" disabled={loading} size="lg" className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-green-500 text-white font-semibold shadow-lg hover:from-pink-600 hover:to-green-600 transition-all duration-200 rounded-xl">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="my-8 border-t border-pink-100" />
        </CardContent>
      </Card>
    </div>
  );
}