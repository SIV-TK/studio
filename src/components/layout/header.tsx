'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-1 sm:py-2 px-2 sm:px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">24/7 Emergency: +1-800-MEDIAI</span>
              <span className="sm:hidden">Emergency: +1-800-MEDIAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>support@mediassist.ai</span>
            </div>
            <div className="hidden lg:flex items-center space-x-1 sm:space-x-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>24/7 Healthcare Services</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">Serving Healthcare Globally</span>
            <span className="lg:hidden">Global Service</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">MediAssist AI</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Complete Healthcare Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <div className="flex items-center space-x-4 xl:space-x-6">
              <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors text-sm xl:text-base">
                Services
              </Link>
              <Link href="#departments" className="text-gray-600 hover:text-blue-600 transition-colors text-sm xl:text-base">
                Departments
              </Link>
              <Link href="#ai-features" className="text-gray-600 hover:text-blue-600 transition-colors text-sm xl:text-base">
                AI Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm xl:text-base">
                About
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 xl:space-x-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs xl:text-sm">
                  <LogIn className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs xl:text-sm">
                  <UserPlus className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 sm:mt-4 pb-3 sm:pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 sm:space-y-4 pt-3 sm:pt-4">
              <Link 
                href="#services" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="#departments" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Departments
              </Link>
              <Link 
                href="#ai-features" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Features
              </Link>
              <Link 
                href="#about" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="flex flex-col space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm sm:text-base py-2 sm:py-3">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Account
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-3">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
