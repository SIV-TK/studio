import { RadiologyAnalysisForm } from '@/components/pages/radiology-analysis-form';

export default function RadiologyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-yellow-600">
          AI Radiology Department
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          AI-powered medical imaging analysis for X-rays, CT scans, MRIs, and other diagnostic imaging studies.
        </p>
      </div>
      <RadiologyAnalysisForm />
    </div>
  );
}