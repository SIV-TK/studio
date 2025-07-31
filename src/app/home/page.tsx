import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  LogIn, 
  UserPlus, 
  Heart, 
  Shield, 
  Zap, 
  Brain,
  Stethoscope,
  TestTube,
  Pill,
  Scan,
  Activity,
  Calendar,
  Phone,
  Users,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Clock,
  Globe,
  Database,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Target
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="bg-gradient-to-br from-blue-50 via-white to-green-50">
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
            Complete AI-Powered Digital Hospital - Emergency Care, Surgery Planning, Pharmacy, Radiology, and comprehensive medical services with real-time AI assistance.
          </p>
          
          {/* System Highlights */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">24/7 AI Assistant</Badge>
            <Badge className="bg-green-100 text-green-800 px-3 py-1">Real-time Analysis</Badge>
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1">Web Scraping Intelligence</Badge>
            <Badge className="bg-orange-100 text-orange-800 px-3 py-1">Complete Workflow</Badge>
          </div>
          
          {/* Login/Signup Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <LogIn className="mr-2 h-5 w-5" />
                Access Your Dashboard
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 px-2 sm:px-0">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl">AI-Powered Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                Advanced AI analyzes medical data, scrapes latest research, and provides evidence-based recommendations in real-time.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time medical research scraping
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Evidence-based diagnosis assistance
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Automated treatment recommendations
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Complete Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                End-to-end healthcare workflow from patient consultation to medication delivery with automated integrations.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Patient → Doctor → AI → Lab → Pharmacy
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Automated lab test ordering
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Direct pharmacy integration
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Comprehensive Care</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                15+ specialized medical departments with emergency care, surgery planning, and 24/7 monitoring capabilities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  15+ medical specializations
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Emergency & ICU monitoring
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  24/7 healthcare access
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Services Section */}
        <div id="services" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Complete Healthcare Ecosystem
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-2">
              15+ AI-Powered Medical Services & Departments
            </p>
            <p className="text-sm text-gray-500">
              Integrated workflow from consultation to treatment delivery
            </p>
          </div>

          {/* Doctor & AI Services */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🩺 Doctor & AI Consultation Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                    <Badge className="bg-purple-100 text-purple-800">AI-Enhanced</Badge>
                  </div>
                  <CardTitle className="text-lg">Doctor Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">Complete patient consultation workflow with real-time AI assistance</p>
                  <ul className="text-sm space-y-1">
                    <li>• Patient selection & medical history</li>
                    <li>• Vital signs capture & analysis</li>
                    <li>• AI diagnosis recommendations</li>
                    <li>• Automated lab & prescription orders</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <Badge className="bg-green-100 text-green-800">Real-time</Badge>
                  </div>
                  <CardTitle className="text-lg">AI Diagnosis Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">Intelligent medical diagnosis with web scraping & research integration</p>
                  <ul className="text-sm space-y-1">
                    <li>• Real-time medical research scraping</li>
                    <li>• Evidence-based recommendations</li>
                    <li>• Drug interaction checking</li>
                    <li>• Clinical decision support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Activity className="h-8 w-8 text-green-600" />
                    <Badge className="bg-blue-100 text-blue-800">Advanced</Badge>
                  </div>
                  <CardTitle className="text-lg">Symptom Checker</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">AI-powered symptom analysis with triage recommendations</p>
                  <ul className="text-sm space-y-1">
                    <li>• Intelligent symptom assessment</li>
                    <li>• Risk stratification</li>
                    <li>• Triage recommendations</li>
                    <li>• Emergency alerts</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Laboratory & Diagnostic Services */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔬 Laboratory & Diagnostic Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <TestTube className="h-8 w-8 text-red-600" />
                    <Badge className="bg-orange-100 text-orange-800">Automated</Badge>
                  </div>
                  <CardTitle className="text-lg">Lab Results Analyzer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">AI-powered lab results analysis with automated reporting</p>
                  <ul className="text-sm space-y-1">
                    <li>• Automated lab test processing</li>
                    <li>• AI interpretation & insights</li>
                    <li>• Doctor notification system</li>
                    <li>• Trend analysis & alerts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Scan className="h-8 w-8 text-blue-600" />
                    <Badge className="bg-purple-100 text-purple-800">Imaging</Badge>
                  </div>
                  <CardTitle className="text-lg">Radiology Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">Advanced imaging services with AI-assisted interpretation</p>
                  <ul className="text-sm space-y-1">
                    <li>• X-ray, CT, MRI imaging</li>
                    <li>• AI image analysis</li>
                    <li>• Radiologist reporting</li>
                    <li>• Priority scheduling</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <Badge className="bg-green-100 text-green-800">Tracking</Badge>
                  </div>
                  <CardTitle className="text-lg">Health Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">Comprehensive health monitoring with personalized insights</p>
                  <ul className="text-sm space-y-1">
                    <li>• Vital signs monitoring</li>
                    <li>• Medication adherence</li>
                    <li>• Progress tracking</li>
                    <li>• Health goal management</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Treatment & Pharmacy Services */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">💊 Treatment & Pharmacy Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Pill className="h-8 w-8 text-green-600" />
                    <Badge className="bg-blue-100 text-blue-800">Integrated</Badge>
                  </div>
                  <CardTitle className="text-lg">Pharmacy Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">Complete pharmacy integration with automated prescription processing</p>
                  <ul className="text-sm space-y-1">
                    <li>• Automated prescription processing</li>
                    <li>• Drug interaction checking</li>
                    <li>• Inventory management</li>
                    <li>• Patient medication portal</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Heart className="h-8 w-8 text-pink-600" />
                    <Badge className="bg-pink-100 text-pink-800">Mental Health</Badge>
                  </div>
                  <CardTitle className="text-lg">Mental Health Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">AI-powered mental health assessment and support services</p>
                  <ul className="text-sm space-y-1">
                    <li>• Mental health screening</li>
                    <li>• Mood tracking & analysis</li>
                    <li>• Therapeutic recommendations</li>
                    <li>• Crisis intervention alerts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Target className="h-8 w-8 text-orange-600" />
                    <Badge className="bg-orange-100 text-orange-800">Nutrition</Badge>
                  </div>
                  <CardTitle className="text-lg">Dietician Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">Personalized nutrition plans with AI-powered recommendations</p>
                  <ul className="text-sm space-y-1">
                    <li>• Personalized meal planning</li>
                    <li>• Nutritional analysis</li>
                    <li>• Diet tracking & monitoring</li>
                    <li>• Health goal integration</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Specialized Departments */}
          <div id="departments" className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏥 Specialized Medical Departments</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Emergency Care', icon: AlertTriangle, color: 'text-red-600' },
                { name: 'ICU Monitoring', icon: Activity, color: 'text-blue-600' },
                { name: 'Surgery Planning', icon: UserCheck, color: 'text-purple-600' },
                { name: 'Cardiology', icon: Heart, color: 'text-red-500' },
                { name: 'Pediatrics', icon: Users, color: 'text-green-600' },
                { name: 'Geriatrics', icon: Clock, color: 'text-orange-600' },
                { name: 'Oncology', icon: Shield, color: 'text-indigo-600' },
                { name: 'General Medicine', icon: Stethoscope, color: 'text-gray-600' },
                { name: 'Telehealth', icon: Phone, color: 'text-blue-500' },
                { name: 'Patient Management', icon: Users, color: 'text-teal-600' },
                { name: 'Booking System', icon: Calendar, color: 'text-purple-500' },
                { name: 'Patient Portal', icon: Globe, color: 'text-cyan-600' }
              ].map((dept) => (
                <Card key={dept.name} className="hover:shadow-md transition-shadow p-3">
                  <div className="text-center">
                    <dept.icon className={`h-8 w-8 ${dept.color} mx-auto mb-2`} />
                    <p className="text-sm font-medium text-gray-700">{dept.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* System Integration */}
          <div id="ai-features" className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">⚡ System Integration & Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Database className="h-8 w-8 text-blue-600" />
                    <Badge className="bg-blue-100 text-blue-800">Real-time</Badge>
                  </div>
                  <CardTitle className="text-lg">Web Scraping Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">Real-time medical research and data aggregation from trusted sources</p>
                  <ul className="text-sm space-y-1">
                    <li>• PubMed & medical journal scraping</li>
                    <li>• FDA drug database integration</li>
                    <li>• Clinical guidelines updates</li>
                    <li>• Research trend analysis</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Zap className="h-8 w-8 text-yellow-600" />
                    <Badge className="bg-yellow-100 text-yellow-800">Automated</Badge>
                  </div>
                  <CardTitle className="text-lg">Workflow Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">End-to-end healthcare workflow automation with smart integrations</p>
                  <ul className="text-sm space-y-1">
                    <li>• Doctor-Lab-Pharmacy integration</li>
                    <li>• Automated order processing</li>
                    <li>• Real-time status updates</li>
                    <li>• Smart notification system</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">About MediAssist AI</h3>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-6">
                MediAssist AI represents the future of healthcare technology, combining artificial intelligence, 
                real-time medical research integration, and comprehensive workflow automation to deliver 
                unprecedented healthcare experiences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
                  <p className="text-gray-600 text-sm">Advanced machine learning algorithms provide real-time medical insights and recommendations.</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
                  <p className="text-gray-600 text-sm">Serving healthcare professionals and patients worldwide with 24/7 accessibility.</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure & Compliant</h4>
                  <p className="text-gray-600 text-sm">HIPAA-compliant platform with enterprise-grade security and privacy protection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Experience the Future of Healthcare?</h3>
              <p className="text-lg sm:text-xl mb-6 opacity-90">
                Join thousands of healthcare professionals and patients using our AI-powered comprehensive medical platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <div className="flex items-center justify-center text-lg">
                  <Star className="h-5 w-5 mr-2" />
                  <span>15+ Medical Specializations</span>
                </div>
                <div className="flex items-center justify-center text-lg">
                  <Award className="h-5 w-5 mr-2" />
                  <span>AI-Powered Intelligence</span>
                </div>
                <div className="flex items-center justify-center text-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Complete Workflow</span>
                </div>
              </div>
              <Link href="/login">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold">
                  Start Your Healthcare Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}