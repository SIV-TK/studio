
import { LoginForm } from '@/components/pages/login-form';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-2xl z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-2xl z-0" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-blue-700 drop-shadow-sm text-center">
            Welcome Back
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}