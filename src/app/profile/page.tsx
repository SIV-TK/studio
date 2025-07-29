import { UserProfileForm } from '@/components/pages/user-profile-form';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-blue-600">
          Your Health Profile
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Create your comprehensive health profile to enable personalized AI recommendations across all medical services. Your data is securely stored and used to enhance all consultations.
        </p>
      </div>
      <UserProfileForm />
    </div>
  );
}