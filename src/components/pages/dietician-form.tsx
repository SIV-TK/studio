'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  personalizedFoodRecommendations,
  type PersonalizedFoodRecommendationsOutput,
} from '@/ai/flows/personalized-food-recommendations';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles, Salad } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  healthData: z.string().min(50, {
    message: 'Please provide detailed health data for accurate recommendations.',
  }),
});

export default function DieticianForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<PersonalizedFoodRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      healthData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const recommendations = await personalizedFoodRecommendations(values);
      setResult(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate recommendations. Please try again later.',
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
                      Your Health Profile
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your health status, dietary needs, preferences, and any allergies. e.g., '28-year-old male, active lifestyle, looking for high-protein vegetarian meals. Allergic to peanuts.'"
                        className="resize-y min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detail you provide, the better the
                      recommendations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Meals...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(loading || result) && (
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-headline">
                <Salad className="mr-3 h-8 w-8 text-accent-foreground" />
                Your Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                result && (
                  <p className="whitespace-pre-wrap">{result.recommendations}</p>
                )
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
