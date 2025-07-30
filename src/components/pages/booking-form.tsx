'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in detail.',
  }),
  appointmentDate: z.date({
    required_error: 'A date of appointment is required.',
  }),
  medicalHistory: z.string().optional(),
});

export function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingSymptoms, setAnalyzingSymptoms] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      symptoms: '',
      medicalHistory: '',
    },
  });

  // Auto-fill form with user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem('currentUserId');
      const userEmail = localStorage.getItem('userEmail');
      
      if (userId) {
        try {
          const userData = await UserDataStore.getComprehensiveUserData(userId);
          if (userData.profile) {
            const medicalHistory = `Age: ${userData.profile.age}, Gender: ${userData.profile.gender}\nHealth Profile: ${userData.profile.healthProfile}\nConditions: ${userData.profile.conditions.join(', ') || 'None'}\nAllergies: ${userData.profile.allergies.join(', ') || 'None'}`;
            
            form.reset({
              fullName: userData.profile.name || '',
              email: userEmail || '',
              symptoms: '',
              medicalHistory: medicalHistory,
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [form]);

  const analyzeSymptoms = async () => {
    const symptoms = form.getValues('symptoms');
    if (!symptoms || symptoms.length < 10) return;
    
    setAnalyzingSymptoms(true);
    try {
      // Mock AI analysis for now
      const analysis = {
        recommendedSpecialty: 'General Medicine',
        urgencyLevel: 'Medium',
        enhancedDescription: `Patient reports: ${symptoms}. Requires medical evaluation.`,
        suggestedQuestions: ['Duration of symptoms?', 'Any triggers?', 'Previous treatments?'],
        appointmentType: 'Consultation'
      };
      
      setTimeout(() => {
        setAiAnalysis(analysis);
        setAnalyzingSymptoms(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setAnalyzingSymptoms(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      let enhancedValues = values;
      
      if (currentUser) {
        const userData = await UserDataStore.getComprehensiveUserData(currentUser.userId);
        const aiContext = await UserDataStore.prepareAIContext(currentUser.userId);
        
        enhancedValues = {
          ...values,
          fullName: userData.profile?.name || values.fullName,
          medicalHistory: `${values.medicalHistory}\n\nSTORED MEDICAL DATA:\n${aiContext}`,
        };
        
        // Store appointment with AI analysis
        await UserDataStore.addConsultation({
          userId: currentUser.userId,
          doctorName: 'To be assigned',
          specialty: aiAnalysis?.recommendedSpecialty || 'General Medicine',
          diagnosis: aiAnalysis?.enhancedDescription || 'Scheduled appointment',
          recommendations: `Symptoms: ${values.symptoms}\n\nAI Analysis: ${aiAnalysis?.enhancedDescription || 'Initial consultation'}\n\nUrgency: ${aiAnalysis?.urgencyLevel || 'Medium'}`,
          prescriptions: 'Pending consultation',
          followUp: format(values.appointmentDate, 'PPP'),
          date: new Date().toISOString(),
        });
      }
      
      console.log(enhancedValues);
      toast({
        title: 'Appointment Booked Successfully!',
        description: `Thank you, ${enhancedValues.fullName}. Your appointment for ${aiAnalysis?.recommendedSpecialty || 'General Medicine'} on ${format(values.appointmentDate, 'PPP')} has been scheduled.`,
      });
      
      // Redirect to booking sessions after 2 seconds
      setTimeout(() => {
        window.location.href = '/booking-sessions';
      }, 2000);
      
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Booking failed',
        description: 'There was an error booking your appointment.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="fullName"
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Headache for 2 days, fever, nausea..."
                        className="min-h-[100px]"
                        {...field}
                        onBlur={analyzeSymptoms}
                      />
                    </FormControl>
                    <FormDescription>
                      AI will analyze your symptoms to recommend the best specialist.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {analyzingSymptoms && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-blue-800">AI is analyzing your symptoms...</span>
                </div>
              </div>
            )}
            
            {aiAnalysis && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-green-800">AI Analysis Results</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Recommended Specialist:</span>
                    <p className="text-green-800">{aiAnalysis.recommendedSpecialty}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Urgency Level:</span>
                    <p className="text-green-800">{aiAnalysis.urgencyLevel}</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-green-700">Enhanced Description:</span>
                  <p className="text-green-800 text-sm mt-1">{aiAnalysis.enhancedDescription}</p>
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Medical History (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little about your medical history..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will help our specialists prepare for your visit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full md:w-auto" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
