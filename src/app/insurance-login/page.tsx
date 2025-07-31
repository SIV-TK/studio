import InsuranceLoginForm from '@/components/pages/insurance-login-form';

export default function InsuranceLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-200 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-2xl z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-2xl z-0" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-indigo-700 drop-shadow-sm text-center">
            Insurance Portal
          </h1>
          <p className="text-gray-600 text-center mt-2 max-w-md">
            Access patient health data and AI-powered risk analysis for insurance underwriting
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          <InsuranceLoginForm />
        </div>
      </div>
    </div>
  );
}
