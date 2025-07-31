import { Shield } from 'lucide-react';
import MedicalDepartment from '@/components/pages/medical-department';

export default function OncologyPage() {
  return (
    <MedicalDepartment 
      department="Oncology"
      specialization="Cancer Care & Treatment"
      icon={<Shield className="h-8 w-8 text-white" />}
      color="bg-purple-600"
    />
  );
}
