import { SymptomCheckerForm } from '@/components/pages/symptom-checker-form';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function SymptomCheckerPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          AI Symptom Checker
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Get preliminary insights about your symptoms. Remember, this is not a substitute for professional medical advice.
        </p>
      </div>
      <SymptomCheckerForm />
      </div>
    </AuthGuard>
  );
}