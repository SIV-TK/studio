import { LoginForm } from '@/components/pages/login-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-blue-600">
          Welcome Back
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Login to access your personalized AI-powered healthcare services. Your health profile will be automatically loaded from your account.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}