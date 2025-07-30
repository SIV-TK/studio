import { PharmacyConsultationForm } from '@/components/pages/pharmacy-consultation-form';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function PharmacyPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-green-600">
          AI Pharmacy Services
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Personalized AI pharmacy services with medicine recommendations based on lab results, doctor consultations, and specialized health profiles including pregnancy, cancer, HIV, and chronic conditions.
        </p>
      </div>
      <PharmacyConsultationForm />
      </div>
    </AuthGuard>
  );
}