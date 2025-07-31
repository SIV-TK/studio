import Link from 'next/link';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Shield,
  Brain,
  Stethoscope,
  TestTube,
  Pill,
  Activity,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold">MediAssist AI</h3>
                <p className="text-xs sm:text-sm text-gray-400">Complete Healthcare Platform</p>
              </div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Revolutionary AI-powered healthcare platform providing comprehensive medical services, 
              real-time diagnosis assistance, and complete workflow automation for healthcare professionals and patients.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Core Services</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/doctor/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Doctor Consultation</span>
                </Link>
              </li>
              <li>
                <Link href="/symptom-checker" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">AI Diagnosis Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/lab-results" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <TestTube className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Lab Results Analyzer</span>
                </Link>
              </li>
              <li>
                <Link href="/pharmacy" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Pill className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Pharmacy Services</span>
                </Link>
              </li>
              <li>
                <Link href="/health-tracker" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Health Monitoring</span>
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Emergency Care</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Departments</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/cardiology" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link href="/pediatrics" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Pediatrics
                </Link>
              </li>
              <li>
                <Link href="/geriatrics" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Geriatrics
                </Link>
              </li>
              <li>
                <Link href="/oncology" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Oncology
                </Link>
              </li>
              <li>
                <Link href="/radiology" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Radiology
                </Link>
              </li>
              <li>
                <Link href="/surgery" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Surgery Planning
                </Link>
              </li>
              <li>
                <Link href="/mental-health" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Mental Health
                </Link>
              </li>
              <li>
                <Link href="/icu" className="text-gray-300 hover:text-blue-400 transition-colors">
                  ICU Monitoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact & Support</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-white font-medium">24/7 Emergency</p>
                  <p className="text-gray-300">+1-800-MEDIAI</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-white font-medium">Direct Contact</p>
                  <p className="text-gray-300">0718845849</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Support Email</p>
                  <p className="text-gray-300">support@mediassist.ai</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-white font-medium">Direct Email</p>
                  <p className="text-gray-300">jamexkarix583@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Global Service</p>
                  <p className="text-gray-300">Worldwide Healthcare</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Availability</p>
                  <p className="text-gray-300">24/7 AI-Powered Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2025 MediAssist AI. All rights reserved. Revolutionary healthcare technology.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                AI-powered medical platform with real-time research integration and automated workflows.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/security" className="text-gray-400 hover:text-blue-400 transition-colors">
                Security
              </Link>
              <Link href="/compliance" className="text-gray-400 hover:text-blue-400 transition-colors">
                HIPAA Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
