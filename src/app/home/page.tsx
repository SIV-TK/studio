import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, Heart, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-blue-600 mr-4" />
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900">
              MediAssist AI
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
            Complete AI-Powered Digital Hospital - Emergency Care, Surgery Planning, Pharmacy, Radiology, and comprehensive medical services online.
          </p>
          
          {/* Login/Signup Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <LogIn className="mr-2 h-5 w-5" />
                Login to Your Account
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Create New Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Your health data is encrypted and secure. Complete privacy protection with advanced security measures.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Advanced AI analyzes your health data using the latest medical research and verified databases.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Complete Care</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                From emergency triage to surgery planning - comprehensive healthcare services in one platform.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services Preview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            12 AI-Powered Medical Services
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Access all services after logging in to your secure account
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto px-2">
            {[
              'Emergency Care', 'Symptom Checker', 'Lab Analysis', 'Pharmacy',
              'Radiology', 'Surgery Planning', 'Mental Health', 'Dietician',
              'Health Tracker', 'Telehealth', 'Booking', 'ICU Monitoring'
            ].map((service) => (
              <div key={service} className="bg-white/60 rounded-lg p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700 text-center">
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of users who trust MediAssist AI for their healthcare needs
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold">
                Access Your Health Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}