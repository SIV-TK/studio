import DieticianForm from '@/components/pages/dietician-form';

export default function DieticianPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          AI-Powered Dietician
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Get personalized food recommendations based on your health data,
          dietary requirements, and preferences.
        </p>
      </div>
      <DieticianForm />
    </div>
  );
}
