import { ICUMonitoringForm } from '@/components/pages/icu-monitoring-form';

export default function ICUPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-red-600">
          AI ICU Monitoring
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Real-time AI-powered intensive care monitoring with critical alerts, treatment adjustments, and prognosis assessment.
        </p>
      </div>
      <ICUMonitoringForm />
    </div>
  );
}