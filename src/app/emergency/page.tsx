import { EmergencyTriageForm } from '@/components/pages/emergency-triage-form';

export default function EmergencyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-red-600">
          AI Emergency Department
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          24/7 AI-powered emergency triage and immediate care guidance. For life-threatening emergencies, call 911 immediately.
        </p>
      </div>
      <EmergencyTriageForm />
    </div>
  );
}