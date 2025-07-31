'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/main-layout';
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor,
  CheckCircle,
  Heart,
  Brain,
  Activity,
  TrendingUp
} from 'lucide-react';

export default function ResponsiveTestPage() {
  const breakpoints = [
    { name: 'Mobile (XS)', size: '< 475px', icon: Smartphone, color: 'bg-red-50 border-red-200 text-red-800' },
    { name: 'Mobile (SM)', size: '475px - 639px', icon: Smartphone, color: 'bg-orange-50 border-orange-200 text-orange-800' },
    { name: 'Tablet', size: '640px - 767px', icon: Tablet, color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    { name: 'Tablet (MD)', size: '768px - 1023px', icon: Tablet, color: 'bg-green-50 border-green-200 text-green-800' },
    { name: 'Laptop', size: '1024px - 1279px', icon: Laptop, color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { name: 'Desktop', size: '1280px - 1535px', icon: Monitor, color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { name: 'Large Desktop', size: '≥ 1536px', icon: Monitor, color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  ];

  const responsiveFeatures = [
    { name: 'Typography Scaling', status: 'optimized' },
    { name: 'Touch-Friendly Navigation', status: 'optimized' },
    { name: 'Flexible Grid Layouts', status: 'optimized' },
    { name: 'Progressive Image Loading', status: 'optimized' },
    { name: 'Adaptive Content Hierarchy', status: 'optimized' },
    { name: 'Mobile-First Design', status: 'optimized' },
    { name: 'Cross-Device Consistency', status: 'optimized' },
    { name: 'Performance Optimization', status: 'optimized' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 xs:mb-10 sm:mb-12">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6">
              Responsive Design Test
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 xs:mb-7 sm:mb-8">
              MediAssist AI is optimized for all devices - from mobile phones to large desktop screens
            </p>
            <Badge className="bg-green-100 text-green-800 text-xs xs:text-sm">
              ✓ Fully Responsive Healthcare Platform
            </Badge>
          </div>

          {/* Current Breakpoint Indicator */}
          <Card className="mb-8 xs:mb-10 sm:mb-12 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl">
                <Activity className="h-5 w-5 xs:h-6 xs:w-6 text-blue-600" />
                Current Device Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 xs:gap-4">
                {breakpoints.map((bp) => (
                  <div key={bp.name} className={`p-3 xs:p-4 rounded-lg border-2 ${bp.color} transition-all`}>
                    <bp.icon className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 mx-auto mb-2 xs:mb-3" />
                    <h3 className="font-medium text-xs xs:text-sm text-center mb-1">{bp.name}</h3>
                    <p className="text-xs text-center opacity-75">{bp.size}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Responsive Grid Demo */}
          <div className="mb-8 xs:mb-10 sm:mb-12">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6">
              Responsive Grid System
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 xs:gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <Card key={num} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4 xs:p-5 sm:p-6 text-center">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-2 xs:mb-3">
                      {num}
                    </div>
                    <p className="text-xs xs:text-sm font-medium">Grid Item</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Typography Scales */}
          <Card className="mb-8 xs:mb-10 sm:mb-12 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl">
                <TrendingUp className="h-5 w-5 xs:h-6 xs:w-6 text-green-600" />
                Responsive Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div>
                <h1 className="text-responsive-3xl font-bold text-gray-900 mb-2">Heading 1 - Responsive</h1>
                <p className="text-xs xs:text-sm text-gray-600">Scales from 3xl to 5xl across devices</p>
              </div>
              <div>
                <h2 className="text-responsive-2xl font-bold text-gray-900 mb-2">Heading 2 - Responsive</h2>
                <p className="text-xs xs:text-sm text-gray-600">Scales from 2xl to 3xl across devices</p>
              </div>
              <div>
                <p className="text-responsive-base text-gray-700 mb-2">Body text that scales appropriately</p>
                <p className="text-xs xs:text-sm text-gray-600">Scales from base to lg across devices</p>
              </div>
              <div>
                <p className="text-responsive-sm text-gray-600">Small text with responsive scaling</p>
                <p className="text-xs text-gray-500">Scales from sm to base across devices</p>
              </div>
            </CardContent>
          </Card>

          {/* Feature Status */}
          <Card className="mb-8 xs:mb-10 sm:mb-12 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl">
                <CheckCircle className="h-5 w-5 xs:h-6 xs:w-6 text-green-600" />
                Responsive Features Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4">
                {responsiveFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-2 xs:gap-3 p-3 xs:p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-4 w-4 xs:h-5 xs:w-5 text-green-600 flex-shrink-0" />
                    <span className="text-xs xs:text-sm font-medium text-green-800">{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements Demo */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl">
                <Heart className="h-5 w-5 xs:h-6 xs:w-6 text-red-600" />
                Interactive Elements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                {/* Buttons */}
                <div>
                  <h3 className="font-medium text-sm xs:text-base mb-3 xs:mb-4">Touch-Optimized Buttons</h3>
                  <div className="flex flex-wrap gap-2 xs:gap-3">
                    <Button size="sm" className="h-auto py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base">
                      Small Button
                    </Button>
                    <Button className="h-auto py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base">
                      Medium Button
                    </Button>
                    <Button size="lg" className="h-auto py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg">
                      Large Button
                    </Button>
                  </div>
                </div>

                {/* Cards */}
                <div>
                  <h3 className="font-medium text-sm xs:text-base mb-3 xs:mb-4">Responsive Cards</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 xs:p-5 sm:p-6">
                        <Brain className="h-8 w-8 xs:h-10 xs:w-10 text-purple-600 mb-3 xs:mb-4" />
                        <h4 className="font-medium text-sm xs:text-base sm:text-lg mb-2">AI Analysis</h4>
                        <p className="text-xs xs:text-sm text-gray-600">Smart health insights</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 xs:p-5 sm:p-6">
                        <Heart className="h-8 w-8 xs:h-10 xs:w-10 text-red-600 mb-3 xs:mb-4" />
                        <h4 className="font-medium text-sm xs:text-base sm:text-lg mb-2">Health Monitor</h4>
                        <p className="text-xs xs:text-sm text-gray-600">Real-time tracking</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                      <CardContent className="p-4 xs:p-5 sm:p-6">
                        <Activity className="h-8 w-8 xs:h-10 xs:w-10 text-blue-600 mb-3 xs:mb-4" />
                        <h4 className="font-medium text-sm xs:text-base sm:text-lg mb-2">Diagnostics</h4>
                        <p className="text-xs xs:text-sm text-gray-600">Advanced testing</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
