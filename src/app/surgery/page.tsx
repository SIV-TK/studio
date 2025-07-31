import { Scissors } from 'lucide-react';
import MedicalDepartment from '@/components/pages/medical-department';

export default function SurgeryPage() {
  return (
    <MedicalDepartment 
      department="Surgery"
      specialization="Surgical Procedures & Operations"
      icon={<Scissors className="h-8 w-8 text-white" />}
      color="bg-green-600"
    />
  );
}
