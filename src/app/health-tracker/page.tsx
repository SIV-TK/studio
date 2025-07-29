import { HealthTrackerForm } from '@/components/pages/health-tracker-form';

export default function HealthTrackerPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Personalized Health Insights
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Connect your health data to receive AI-driven advice and
          recommendations tailored just for you.
        </p>
      </div>
      <HealthTrackerForm />
    </div>
  );
}
