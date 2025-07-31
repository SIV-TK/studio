'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InsuranceAuthService } from '@/lib/insurance-auth-service';

export default function InsuranceLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const session = await InsuranceAuthService.login({ email, password });
      
      if (session) {
        router.push('/insurance-dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials for testing
  const demoCredentials = [
    { email: 'sarah.johnson@healthfirst.com', company: 'HealthFirst Insurance', role: 'Risk Analyst' },
    { email: 'michael.chen@lifecare.com', company: 'LifeCare Global Insurance', role: 'Senior Underwriter' },
    { email: 'emily.davis@wellness.com', company: 'Wellness Shield Insurance', role: 'Claims Specialist' },
    { email: 'robert.martinez@premier.com', company: 'Premier Health Insurance', role: 'AI Analytics Manager' }
  ];

  const fillDemoCredentials = (email: string) => {
    setEmail(email);
    setPassword('insurance123');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Insurance Company Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@insurancecompany.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12"
            disabled={isLoading}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In to Insurance Portal'}
        </Button>
      </form>

      {/* Demo Credentials Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Insurance Accounts</h3>
        <div className="space-y-2">
          {demoCredentials.map((cred, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
              <div>
                <div className="font-medium text-gray-900">{cred.company}</div>
                <div className="text-gray-600">{cred.role} - {cred.email}</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials(cred.email)}
                disabled={isLoading}
              >
                Use Account
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Password for all demo accounts: <code className="bg-gray-200 px-1 rounded">insurance123</code>
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Access patient health data for insurance risk assessment and policy recommendations
        </p>
      </div>
    </div>
  );
}
