import { AlertTriangle } from 'lucide-react';
import MedicalDepartment from '@/components/pages/medical-department';

export default function EmergencyPage() {
  return (
    <MedicalDepartment 
      department="Emergency"
      specialization="Urgent Care & Critical Medicine"
      icon={<AlertTriangle className="h-8 w-8 text-white" />}
      color="bg-red-600"
    />
  );
}