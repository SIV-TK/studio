'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  healthInsightsFromTracker,
  type HealthInsightsFromTrackerOutput,
} from '@/ai/flows/health-insights-from-tracker';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles, Lightbulb, Salad } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  healthData: z
    .string()
    .min(50, 'Please provide detailed health data for accurate insights.'),
  userDietaryRequirements: z
    .string()
    .min(10, 'Please describe your dietary requirements.'),
});

export function HealthTrackerForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<HealthInsightsFromTrackerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      healthData: '',
      userDietaryRequirements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const currentUser = await AuthService.getCurrentUser();
      let enhancedValues = values;
      
      if (currentUser) {
        const userData = await UserDataStore.getComprehensiveUserData(currentUser.userId);
        const aiContext = await UserDataStore.prepareAIContext(currentUser.userId);
        
        enhancedValues = {
          ...values,
          healthData: `${values.healthData}\n\nSTORED HEALTH DATA:\n${aiContext}`,
          userDietaryRequirements: `${values.userDietaryRequirements}\nAllergies: ${userData.profile?.allergies.join(', ') || 'None'}`,
        };
      }
      
      const insights = await healthInsightsFromTracker(enhancedValues);
      setResult(insights);
    } catch (error) {
      console.error('Error getting health insights:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Failed to generate health insights. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="healthData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Your Health Data
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your exported health data here. e.g., 'Avg Heart Rate: 72bpm, Steps/day: 8,200, Sleep: 7.5hrs/night...'"
                        className="resize-y min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This data is used solely for generating your personalized
                      insights.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userDietaryRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Dietary Requirements
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vegetarian, gluten-free, low-sodium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get My Insights
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(loading || result) && (
        <div className="mt-10 space-y-8">
          {loading ? (
            <>
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </>
          ) : (
            result && (
              <>
                <Card className="bg-primary/20 border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-headline">
                      <Lightbulb className="mr-3 h-8 w-8 text-accent-foreground" />
                      Personalized Health Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{result.advice}</p>
                  </CardContent>
                </Card>
                <Card className="bg-accent/20 border-accent/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-headline">
                      <Salad className="mr-3 h-8 w-8 text-accent-foreground" />
                      Food Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">
                      {result.foodRecommendations}
                    </p>
                  </CardContent>
                </Card>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}
