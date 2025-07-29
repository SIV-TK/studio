import { LabResultsForm } from '@/components/pages/lab-results-form';

export default function LabResultsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Lab Results Analyzer
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Upload your laboratory results for comprehensive AI analysis and personalized health recommendations across nutrition, lifestyle, and wellness.
        </p>
      </div>
      <LabResultsForm />
    </div>
  );
}