import { MentalHealthForm } from '@/components/pages/mental-health-form';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';

export default function MentalHealthPage() {
  return (
    <MainLayout>
      <AuthGuard>
        <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            AI Mental Health Companion
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            Get personalized mental health support, coping strategies, and mindfulness guidance. Remember, this complements but doesn't replace professional care.
          </p>
        </div>
        <MentalHealthForm />
        </div>
      </AuthGuard>
    </MainLayout>
  );
}