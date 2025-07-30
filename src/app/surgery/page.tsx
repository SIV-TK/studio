import { SurgeryPlanningForm } from '@/components/pages/surgery-planning-form';

export default function SurgeryPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-blue-600">
          AI Surgery Planning
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          AI-powered surgical planning with pre-operative assessment, risk analysis, and post-operative care recommendations.
        </p>
      </div>
      <SurgeryPlanningForm />
    </div>
  );
}