'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Heart, Target, TrendingUp, Shield, Brain, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/layout/main-layout';

const personalizedHealthSchema = z.object({
  age: z.coerce.number().min(1).max(120),
  gender: z.string().min(1, 'Please select gender'),
  weight: z.coerce.number().min(1),
  height: z.coerce.number().min(1),
  activityLevel: z.string().min(1, 'Please select activity level'),
  healthGoals: z.string().min(1, 'Please describe your health goals'),
  currentConditions: z.string(),
  familyHistory: z.string(),
  lifestyle: z.string().min(1, 'Please describe your lifestyle'),
  dietaryPreferences: z.string(),
  sleepPattern: z.string(),
  stressLevel: z.string().min(1, 'Please select stress level'),
  symptoms: z.string(),
});

export default function PersonalizedHealthPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof personalizedHealthSchema>>({
    resolver: zodResolver(personalizedHealthSchema),
    defaultValues: {
      age: 0,
      gender: '',
      weight: 0,
      height: 0,
      activityLevel: '',
      healthGoals: '',
      currentConditions: '',
      familyHistory: '',
      lifestyle: '',
      dietaryPreferences: '',
      sleepPattern: '',
      stressLevel: '',
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof personalizedHealthSchema>) {
    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const bmi = values.weight / ((values.height / 100) ** 2);
      const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
      
      const mockResults = {
        personalizedPlan: `Based on your profile (${values.age} years, ${values.gender}, ${values.activityLevel} activity level), here's your comprehensive health plan:

🎯 PRIMARY HEALTH GOALS:
${values.healthGoals}

💪 FITNESS RECOMMENDATIONS:
- Target 150 minutes of moderate exercise weekly
- Include strength training 2-3 times per week
- Focus on ${values.activityLevel === 'sedentary' ? 'gradual activity increase' : 'maintaining current activity levels'}

🥗 NUTRITION GUIDANCE:
- Daily caloric intake: ${Math.round(values.gender === 'male' ? 2200 + (values.age < 30 ? 300 : values.age > 50 ? -300 : 0) : 1800 + (values.age < 30 ? 200 : values.age > 50 ? -200 : 0))} calories
- Focus on whole foods, lean proteins, and complex carbohydrates
- Hydration goal: 8-10 glasses of water daily
${values.dietaryPreferences ? `- Accommodating your dietary preferences: ${values.dietaryPreferences}` : ''}

😴 SLEEP OPTIMIZATION:
- Target 7-9 hours of quality sleep nightly
- Maintain consistent sleep schedule
${values.sleepPattern ? `- Address current sleep patterns: ${values.sleepPattern}` : ''}

🧘 STRESS MANAGEMENT:
- Current stress level: ${values.stressLevel}
- Recommended: Daily meditation (10-15 minutes)
- Regular relaxation techniques
- Consider stress-reduction activities`,

        riskAssessment: `HEALTH RISK ANALYSIS:

📊 BMI Assessment: ${bmi.toFixed(1)} (${bmiCategory})
${bmiCategory !== 'Normal' ? `⚠️ Consider weight management strategies` : '✅ Healthy weight range'}

🧬 FAMILY HISTORY CONSIDERATIONS:
${values.familyHistory || 'No significant family history reported'}

🔍 CURRENT CONDITIONS:
${values.currentConditions || 'No current medical conditions reported'}

⚡ SYMPTOMS MONITORING:
${values.symptoms || 'No specific symptoms reported'}

🚨 RISK FACTORS TO MONITOR:
- Age-related: Regular screenings appropriate for ${values.age} years
- Lifestyle factors: ${values.lifestyle}
- Activity level impact: ${values.activityLevel}`,

        nutritionPlan: `PERSONALIZED NUTRITION PLAN:

🍽️ DAILY MEAL STRUCTURE:
- Breakfast: High-protein, complex carbs (400-500 calories)
- Mid-morning snack: Fruit and nuts (150-200 calories)
- Lunch: Balanced meal with vegetables (500-600 calories)
- Afternoon snack: Greek yogurt or vegetables (100-150 calories)
- Dinner: Lean protein and vegetables (500-600 calories)

🥦 RECOMMENDED FOODS:
- Proteins: Lean meats, fish, legumes, eggs
- Carbohydrates: Quinoa, brown rice, oats, sweet potatoes
- Fats: Avocados, nuts, olive oil, fatty fish
- Vegetables: Dark leafy greens, colorful vegetables
- Fruits: Berries, citrus fruits, apples

⚠️ FOODS TO LIMIT:
- Processed foods and sugary snacks
- Excessive refined carbohydrates
- High-sodium foods
- Sugary beverages

💊 SUPPLEMENT CONSIDERATIONS:
- Vitamin D (if limited sun exposure)
- Omega-3 fatty acids
- Multivitamin for nutritional insurance
*Consult healthcare provider before starting supplements`,

        fitnessProgram: `PERSONALIZED FITNESS PROGRAM:

🏃 WEEKLY EXERCISE SCHEDULE:
Current Activity Level: ${values.activityLevel}

WEEK 1-2 (Foundation):
- Monday: 30-min walk + 15-min stretching
- Tuesday: Basic strength training (20 minutes)
- Wednesday: 30-min walk or light cardio
- Thursday: Rest or gentle yoga
- Friday: 30-min walk + strength training
- Saturday: Fun activity (dancing, sports, hiking)
- Sunday: Rest or gentle stretching

WEEK 3-4 (Building):
- Increase cardio to 35-40 minutes
- Add more strength training exercises
- Include flexibility work

🎯 FITNESS GOALS:
- Improve cardiovascular health
- Build lean muscle mass
- Enhance flexibility and balance
- Increase daily energy levels

📈 PROGRESS TRACKING:
- Weekly weigh-ins (same day, same time)
- Track workout completion
- Monitor energy levels
- Take body measurements monthly`,

        wellnessRecommendations: `COMPREHENSIVE WELLNESS PLAN:

🧘 MENTAL HEALTH:
- Daily mindfulness practice (5-10 minutes)
- Stress management techniques
- Regular social connections
- Hobby engagement for joy and relaxation

💧 HYDRATION STRATEGY:
- Start day with 16oz water
- Water before each meal
- Herbal teas for variety
- Monitor urine color for hydration status

🌿 LIFESTYLE MODIFICATIONS:
- Limit screen time before bed
- Create morning and evening routines
- Spend time in nature daily
- Practice gratitude journaling

📅 PREVENTIVE CARE SCHEDULE:
Age ${values.age} Recommendations:
- Annual physical examination
- Blood pressure monitoring
- Cholesterol screening
- ${values.age > 40 ? 'Annual mammogram (women) / PSA (men)' : 'Baseline health metrics'}
- ${values.age > 50 ? 'Colonoscopy screening' : 'Future screening planning'}

🎯 MONTHLY GOALS:
- Week 1: Establish routines
- Week 2: Increase activity gradually
- Week 3: Focus on nutrition quality
- Week 4: Evaluate and adjust plan`,

        followUpPlan: `FOLLOW-UP AND MONITORING PLAN:

📊 WEEKLY CHECK-INS:
- Weight and measurements
- Activity level assessment
- Nutrition quality review
- Sleep pattern evaluation

📈 MONTHLY ASSESSMENTS:
- Progress toward health goals
- Fitness improvements
- Energy level changes
- Overall wellbeing assessment

🔄 3-MONTH COMPREHENSIVE REVIEW:
- Full health metrics reassessment
- Plan adjustments based on progress
- New goal setting
- Professional consultation if needed

⚠️ WHEN TO SEEK PROFESSIONAL HELP:
- Persistent symptoms or new health concerns
- Difficulty achieving goals despite consistent effort
- Need for specialized guidance
- Medication or supplement questions

📞 EMERGENCY INDICATORS:
- Chest pain or breathing difficulties
- Severe headaches or vision changes
- Unexplained weight loss or gain
- Persistent fatigue or mood changes

Remember: This is a general wellness plan. Always consult healthcare professionals for medical concerns or before making significant lifestyle changes.`
      };

      setResults(mockResults);
      toast({
        title: 'Personalized Health Plan Generated',
        description: 'Your comprehensive health recommendations are ready!',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Unable to generate personalized plan. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personalized Health & Wellness</h1>
          <p className="text-xl text-gray-600">AI-Powered Personal Health Optimization</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assessment Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                Health Assessment
              </CardTitle>
              <CardDescription>
                Complete health profile for personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Demographics */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} />
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

                  {/* Physical Measurements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="70" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="175" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Activity and Stress */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary (office job, little exercise)</SelectItem>
                              <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                              <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                              <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                              <SelectItem value="extremely_active">Extremely Active (very hard exercise, physical job)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stressLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stress Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select stress level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low - Minimal daily stress</SelectItem>
                              <SelectItem value="moderate">Moderate - Some daily pressures</SelectItem>
                              <SelectItem value="high">High - Significant daily stress</SelectItem>
                              <SelectItem value="very_high">Very High - Overwhelming stress</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Health Goals */}
                  <FormField
                    control={form.control}
                    name="healthGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Goals</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your health and wellness goals (e.g., lose weight, improve fitness, better sleep, manage stress...)"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lifestyle */}
                  <FormField
                    control={form.control}
                    name="lifestyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lifestyle Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your daily routine, work schedule, hobbies, social activities..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Optional Fields */}
                  <FormField
                    control={form.control}
                    name="currentConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Health Conditions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any current medical conditions, medications, or health concerns..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="familyHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Family Health History (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Family history of diabetes, heart disease, cancer, etc..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dietaryPreferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dietary Preferences (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Vegetarian, vegan, keto, allergies, food restrictions..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sleepPattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sleep Pattern (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Typical sleep hours, sleep quality, sleep issues..."
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
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Symptoms (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any symptoms you'd like addressed (fatigue, headaches, digestive issues...)"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Your Personalized Plan...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Generate Personalized Health Plan
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Personalized Health Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-800 whitespace-pre-wrap">{results.personalizedPlan}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-orange-700 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800 whitespace-pre-wrap">{results.riskAssessment}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Nutrition Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 whitespace-pre-wrap">{results.nutritionPlan}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Fitness Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 whitespace-pre-wrap">{results.fitnessProgram}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Wellness Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-purple-800 whitespace-pre-wrap">{results.wellnessRecommendations}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-indigo-700 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Follow-up Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-indigo-800 whitespace-pre-wrap">{results.followUpPlan}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
