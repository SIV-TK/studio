import { SignupForm } from '@/components/pages/signup-form';

export default function SignupPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-blue-600">
          Create Your Account
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Join MediAssist AI to access personalized healthcare services. Your health profile will be automatically created upon registration.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}