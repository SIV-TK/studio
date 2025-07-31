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
import { Loader2, Users2, Brain, AlertTriangle, CheckCircle, TrendingUp, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/layout/main-layout';

const geriatricsSchema = z.object({
  age: z.coerce.number().min(65).max(120),
  gender: z.string().min(1, 'Please select gender'),
  livingArrangement: z.string().min(1, 'Please select living arrangement'),
  functionalStatus: z.string().min(1, 'Please describe functional status'),
  cognitiveStatus: z.string().min(1, 'Please describe cognitive status'),
  symptoms: z.string().min(1, 'Please describe current symptoms'),
  chronicConditions: z.string(),
  currentMedications: z.string(),
  fallHistory: z.string().min(1, 'Please provide fall history'),
  socialSupport: z.string(),
  nutritionalStatus: z.string(),
  moodAssessment: z.string(),
  painAssessment: z.string(),
  vitalSigns: z.string(),
  mobilityAids: z.string(),
  sensoryImpairments: z.string(),
  advanceDirectives: z.string(),
});

export default function GeriatricsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof geriatricsSchema>>({
    resolver: zodResolver(geriatricsSchema),
    defaultValues: {
      age: 75,
      gender: '',
      livingArrangement: '',
      functionalStatus: '',
      cognitiveStatus: '',
      symptoms: '',
      chronicConditions: '',
      currentMedications: '',
      fallHistory: '',
      socialSupport: '',
      nutritionalStatus: '',
      moodAssessment: '',
      painAssessment: '',
      vitalSigns: '',
      mobilityAids: '',
      sensoryImpairments: '',
      advanceDirectives: '',
    },
  });

  async function onSubmit(values: z.infer<typeof geriatricsSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'geriatrics',
          data: {
            patientInfo: {
              age: values.age,
              gender: values.gender,
              livingArrangement: values.livingArrangement,
            },
            functionalStatus: values.functionalStatus,
            cognitiveStatus: values.cognitiveStatus,
            symptoms: values.symptoms,
            chronicConditions: values.chronicConditions || '',
            currentMedications: values.currentMedications || '',
            fallHistory: values.fallHistory,
            socialSupport: values.socialSupport || '',
            nutritionalStatus: values.nutritionalStatus || '',
            moodAssessment: values.moodAssessment || '',
            painAssessment: values.painAssessment || '',
            vitalSigns: values.vitalSigns || '',
            mobilityAids: values.mobilityAids || '',
            sensoryImpairments: values.sensoryImpairments || '',
            advanceDirectives: values.advanceDirectives || '',
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get assessment');
      }

      const assessment = await response.json();

      setResults(assessment);
      toast({
        title: 'Geriatric Assessment Complete',
        description: 'Comprehensive elder care evaluation generated successfully.',
      });
    } catch (error) {
      console.error('Geriatrics assessment error:', error);
      toast({
        variant: 'destructive',
        title: 'Assessment Failed',
        description: 'Unable to generate geriatric assessment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const getFrailtyColor = (frailty: string) => {
    if (frailty.toLowerCase().includes('robust') || frailty.toLowerCase().includes('fit')) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (frailty.toLowerCase().includes('frail') || frailty.toLowerCase().includes('severe')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Users2 className="h-16 w-16 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Geriatrics Department</h1>
          <p className="text-xl text-gray-600">Comprehensive Care for Older Adults</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assessment Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-teal-600" />
                Comprehensive Geriatric Assessment
              </CardTitle>
              <CardDescription>
                Holistic evaluation for older adult patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Patient Demographics */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="75" {...field} />
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

                  {/* Living Arrangement */}
                  <FormField
                    control={form.control}
                    name="livingArrangement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Living Arrangement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select living arrangement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alone">Lives alone</SelectItem>
                            <SelectItem value="family">Lives with family</SelectItem>
                            <SelectItem value="spouse">Lives with spouse/partner</SelectItem>
                            <SelectItem value="assisted-living">Assisted living facility</SelectItem>
                            <SelectItem value="nursing-home">Nursing home</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Functional and Cognitive Status */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="functionalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Functional Status (ADLs)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Independent, needs help with bathing, dressing, toileting, transfers, feeding..."
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
                      name="cognitiveStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cognitive Status</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Normal cognition, mild cognitive impairment, dementia, confusion..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Current Symptoms */}
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Symptoms and Concerns</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Primary symptoms, functional decline, pain, weakness..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fall History */}
                  <FormField
                    control={form.control}
                    name="fallHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fall History</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Number of falls in past year, circumstances, injuries..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Chronic Conditions and Medications */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="chronicConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chronic Conditions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Diabetes, hypertension, heart disease, arthritis, COPD..."
                              {...field} 
                            />
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
                          <FormLabel>Current Medications (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List all medications, dosages, frequency..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Social and Nutritional */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="socialSupport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Support (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Family involvement, caregivers, social isolation..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nutritionalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nutritional Status (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Weight loss, appetite, dietary habits, swallowing issues..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Mood and Pain Assessment */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="moodAssessment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mood Assessment (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Depression, anxiety, mood changes, sleep patterns..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="painAssessment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pain Assessment (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Pain location, severity (0-10), character, triggers..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Physical Status */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mobilityAids"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobility Aids (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Walker, cane, wheelchair, none needed..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sensoryImpairments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sensory Impairments (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Vision loss, hearing loss, glasses, hearing aids..."
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
                    name="vitalSigns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vital Signs (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Blood pressure, heart rate, temperature, weight, BMI..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="advanceDirectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advance Directives (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Living will, healthcare proxy, code status, preferences..."
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
                        Analyzing Geriatric Profile...
                      </>
                    ) : (
                      <>
                        <Users2 className="mr-2 h-4 w-4" />
                        Generate Geriatric Assessment
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-700">Comprehensive Geriatric Assessment Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Frailty Assessment */}
                <div className={`p-4 rounded-lg border ${getFrailtyColor(results.frailtyAssessment)}`}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Frailty Assessment
                  </h3>
                  <p className="whitespace-pre-wrap">{results.frailtyAssessment}</p>
                </div>

                {/* Cognitive Evaluation */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-teal-600" />
                    Cognitive Evaluation
                  </h3>
                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-teal-800 whitespace-pre-wrap">{results.cognitiveEvaluation}</p>
                  </div>
                </div>

                {/* Functional Assessment */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Functional Assessment</h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 whitespace-pre-wrap">{results.functionalAssessment}</p>
                  </div>
                </div>

                {/* Medication Review */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Medication Review</h3>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-purple-800 whitespace-pre-wrap">{results.medicationReview}</p>
                  </div>
                </div>

                {/* Fall Risk Assessment */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Fall Risk Assessment</h3>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800 whitespace-pre-wrap">{results.fallRiskAssessment}</p>
                  </div>
                </div>

                {/* Care Recommendations */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Care Recommendations</h3>
                  <div className="space-y-2">
                    {results.careRecommendations?.map((recommendation: string, index: number) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-green-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quality of Life Assessment */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Quality of Life Assessment</h3>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-indigo-800 whitespace-pre-wrap">{results.qualityOfLifeAssessment}</p>
                  </div>
                </div>

                {/* Safety Considerations */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Safety Considerations
                  </h3>
                  <p className="text-red-800 whitespace-pre-wrap">{results.safetyConsiderations}</p>
                </div>

                {/* Long-term Care Planning */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-teal-600" />
                    Long-term Care Planning
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{results.longTermCarePlanning}</p>
                  </div>
                </div>

                {/* Follow-up Recommendations */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Follow-up Recommendations</h3>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 whitespace-pre-wrap">{results.followUpRecommendations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
