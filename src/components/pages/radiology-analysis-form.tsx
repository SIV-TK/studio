'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { radiologyAnalysis } from '@/ai/flows/ai-hospital-services';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Zap, Eye, Lightbulb, Calendar } from 'lucide-react';

const formSchema = z.object({
  imageType: z.string().min(1, 'Please select image type'),
  patientHistory: z.string().min(10, 'Please provide patient history'),
  clinicalQuestion: z.string().min(10, 'Please specify clinical question'),
});

export function RadiologyAnalysisForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageType: '', patientHistory: '', clinicalQuestion: '' },
  });

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
          patientHistory: `${values.patientHistory}\n\nSTORED PATIENT DATA:\n${aiContext}`,
        };
      }
      
      const analysis = await radiologyAnalysis(enhancedValues);
      setResult(analysis);
    } catch (error) {
      console.error('Radiology analysis error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg mb-8">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="imageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Imaging Study Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select imaging type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chest-xray">Chest X-Ray</SelectItem>
                        <SelectItem value="ct-scan">CT Scan</SelectItem>
                        <SelectItem value="mri">MRI</SelectItem>
                        <SelectItem value="ultrasound">Ultrasound</SelectItem>
                        <SelectItem value="mammography">Mammography</SelectItem>
                        <SelectItem value="bone-scan">Bone Scan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Age, gender, relevant medical history, current symptoms..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicalQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinical Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What specific question should this imaging study answer?" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Images...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Analyze Imaging Study
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Eye className="h-6 w-6" />
                Imaging Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">{result.findings}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Lightbulb className="h-6 w-6" />
                Clinical Impression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">{result.impression}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Lightbulb className="h-6 w-6" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800">{result.recommendations}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Calendar className="h-6 w-6" />
                Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800">{result.followUp}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}