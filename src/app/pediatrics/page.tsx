import { MainLayout } from '@/components/layout/main-layout';
import MedicalDepartment from '@/components/pages/medical-department';
import { Baby } from 'lucide-react';

export default function PediatricsPage() {
  return (
    <MedicalDepartment
      department="Pediatrics"
      specialization="Child Healthcare"
      icon={<Baby className="h-8 w-8" />}
      color="from-pink-50 to-rose-50 border-pink-200"
    />
  );
}
