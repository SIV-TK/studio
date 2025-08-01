import { Heart } from 'lucide-react';
import MedicalDepartment from '@/components/pages/medical-department';

export default function CardiologyPage() {
  return (
    <MedicalDepartment 
      department="Cardiology"
      specialization="Heart & Cardiovascular Care"
      icon={<Heart className="h-8 w-8 text-white" />}
      color="bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 shadow-lg"
    />
  );
}
