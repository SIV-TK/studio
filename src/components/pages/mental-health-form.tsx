'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  mentalHealthAnalysis,
  type MentalHealthOutput,
} from '@/ai/flows/mental-health-companion';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Heart, Brain, Lightbulb, Activity, AlertTriangle, Phone } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  moodData: z.string().min(10, 'Please describe your current mood'),
  stressLevel: z.number().min(1).max(10),
  lifeEvents: z.string(),
  sleepQuality: z.string().min(1, 'Please select sleep quality'),
  socialSupport: z.string(),
});

export function MentalHealthForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MentalHealthOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moodData: '',
      stressLevel: 5,
      lifeEvents: '',
      sleepQuality: '',
      socialSupport: '',
    },
  });

  const stressLevel = form.watch('stressLevel');

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
          moodData: `${values.moodData}\n\nHEALTH CONTEXT:\n${aiContext}`,
        };
      }
      
      const analysis = await mentalHealthAnalysis(enhancedValues);
      setResult(analysis);
      toast({
        title: 'Analysis Complete',
        description: 'Your mental health support plan is ready.',
      });
    } catch (error) {
      console.error('Error analyzing mental health:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis failed',
        description: 'Unable to generate support plan. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    if (level <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Alert className="mb-8 border-purple-200 bg-purple-50">
        <Heart className="h-4 w-4" />
        <AlertDescription className="text-purple-800">
          This AI companion provides supportive guidance but is not a substitute for professional mental health care. If you're experiencing crisis, please contact emergency services or a mental health professional immediately.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg mb-8">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="moodData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">How are you feeling today?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your current mood, emotions, and what's on your mind..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stressLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Current Stress Level: <span className={getStressColor(stressLevel)}>{stressLevel}/10</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Low Stress</span>
                      <span>High Stress</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sleepQuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sleep Quality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How well are you sleeping?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent (7-9 hours, restful)</SelectItem>
                          <SelectItem value="good">Good (6-8 hours, mostly restful)</SelectItem>
                          <SelectItem value="fair">Fair (5-7 hours, some issues)</SelectItem>
                          <SelectItem value="poor">Poor (less than 5 hours, restless)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialSupport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Support</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Family, friends, support system..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="lifeEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Life Events or Stressors</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any recent changes, challenges, or events affecting your mental health..."
                        className="min-h-[80px]"
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
                    Creating Your Support Plan...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Get Mental Health Support
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(loading || result) && (
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            result && (
              <>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Brain className="h-6 w-6" />
                      Mood Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-blue-800">{result.moodAssessment}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <Lightbulb className="h-6 w-6" />
                      Coping Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-green-800">{result.copingStrategies}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Heart className="h-6 w-6" />
                      Mindfulness Exercises
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-purple-800">{result.mindfulnessExercises}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-900">
                      <Activity className="h-6 w-6" />
                      Lifestyle Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-teal-800">{result.lifestyleRecommendations}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <AlertTriangle className="h-6 w-6" />
                      Warning Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-orange-800">{result.warningSignsToWatch}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-900">
                      <Phone className="h-6 w-6" />
                      Resources & Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-indigo-800">{result.resourcesAndSupport}</p>
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