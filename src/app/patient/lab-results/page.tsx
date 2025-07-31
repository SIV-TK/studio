'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PatientLabResults } from '@/components/pages/patient-lab-results';
import { useSession } from '@/hooks/use-session';

export default function PatientLabResultsPage() {
  const { session } = useSession();

  return (
    <MainLayout>
      <AuthGuard>
        <div className="container mx-auto py-8 px-4 md:px-6">
          <PatientLabResults patientId={session?.userId || 'patient_001'} />
        </div>
      </AuthGuard>
    </MainLayout>
  );
}
