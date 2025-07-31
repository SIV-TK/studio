'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart,
  Droplets,
  Calendar,
  MapPin,
  Trophy,
  Brain,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Award,
  TrendingUp,
  Plus,
  Eye,
  Download,
  Share2,
  Bell,
  Target,
  Zap,
  Gift,
  Utensils,
  Moon,
  Dumbbell,
  Shield,
  Phone,
  Mail,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';

// Mock data for user's blood activities
const mockUserProfile = {
  id: 'user_001',
  name: 'John Smith',
  bloodType: 'O+',
  age: 32,
  weight: 75,
  eligibilityStatus: 'eligible',
  totalDonations: 8,
  totalTransfusions: 2,
  totalPoints: 1200,
  nextEligibleDate: '2025-03-15',
  medicalNotes: 'Healthy donor, no restrictions',
  emergencyContact: {
    name: 'Jane Smith',
    phone: '+1-555-0123'
  },
  healthMetrics: {
    lastHemoglobin: '14.2 g/dL',
    lastBloodPressure: '120/80',
    lastWeight: '75 kg',
    lastCheckup: '2025-01-20'
  },
  preferences: {
    donationLocation: 'Main Hospital Blood Bank',
    reminderFrequency: 'weekly',
    aiGuidanceEnabled: true
  }
};

const mockDonationHistory = [
  {
    id: 'D001',
    date: '2024-12-15',
    type: 'Whole Blood',
    location: 'City Hospital Blood Center',
    volume: '450ml',
    status: 'completed',
    pointsEarned: 150,
    bloodUsed: true,
    recipientInfo: 'Used for emergency surgery',
    testResults: {
      hemoglobin: '14.2 g/dL',
      bloodPressure: '120/80',
      temperature: '98.6°F',
      status: 'normal'
    }
  },
  {
    id: 'D002',
    date: '2024-09-10',
    type: 'Platelets',
    location: 'Community Blood Drive',
    volume: '250ml',
    status: 'completed',
    pointsEarned: 200,
    bloodUsed: true,
    recipientInfo: 'Used for cancer patient treatment',
    testResults: {
      hemoglobin: '13.8 g/dL',
      bloodPressure: '118/78',
      temperature: '98.4°F',
      status: 'normal'
    }
  },
  {
    id: 'D003',
    date: '2024-06-05',
    type: 'Whole Blood',
    location: 'Regional Medical Center',
    volume: '450ml',
    status: 'completed',
    pointsEarned: 150,
    bloodUsed: true,
    recipientInfo: 'Used for trauma patient',
    testResults: {
      hemoglobin: '14.0 g/dL',
      bloodPressure: '122/82',
      temperature: '98.7°F',
      status: 'normal'
    }
  }
];

const mockTransfusionHistory = [
  {
    id: 'T001',
    date: '2023-08-20',
    bloodType: 'O+',
    unitsReceived: 2,
    reason: 'Surgery - appendectomy',
    hospital: 'City General Hospital',
    doctor: 'Dr. Martinez',
    complications: 'None',
    recoveryNotes: 'Excellent recovery, no adverse reactions'
  }
];

const mockUpcomingDrives = [
  {
    id: 'BD001',
    name: 'Community Health Fair Blood Drive',
    date: '2025-02-15',
    time: '9:00 AM - 4:00 PM',
    location: 'City Community Center',
    address: '123 Main St, Downtown',
    organizer: 'Red Cross',
    slotsAvailable: 25,
    urgentNeed: ['O-', 'B-', 'AB-'],
    bonusPoints: 50
  },
  {
    id: 'BD002',
    name: 'Hospital Emergency Blood Drive',
    date: '2025-02-20',
    time: '10:00 AM - 6:00 PM',
    location: 'City Hospital',
    address: '456 Health Ave, Medical District',
    organizer: 'City Hospital',
    slotsAvailable: 40,
    urgentNeed: ['O+', 'A-'],
    bonusPoints: 75
  }
];

export default function BloodDonationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const { session } = useSession();

    const generateAIRecommendations = (activityType: 'donation' | 'transfusion', bloodType: string, date: string) => {
    const daysSince = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));
    
    const donationRecommendations = {
      foods: [
        '🥩 Iron-rich foods: Red meat, chicken, fish, tofu, lentils, spinach, quinoa',
        '🍊 Vitamin C enhancers: Citrus fruits, tomatoes, bell peppers, strawberries',
        '💧 Hydration: Drink 16-24 oz of water/juice in the next 4 hours',
        '🥛 Protein sources: Greek yogurt, eggs, nuts, cheese for tissue repair',
        '🍌 Potassium-rich: Bananas, potatoes, avocados to maintain electrolyte balance',
        '🥣 Complex carbs: Whole grains, oatmeal for sustained energy',
        '🐟 Omega-3s: Salmon, walnuts, chia seeds for anti-inflammatory benefits'
      ],
      lifestyle: [
        '😴 Get 7-9 hours of quality sleep tonight to aid recovery',
        '🚫 Avoid alcohol for 24 hours to prevent dehydration',
        '🏋️ No heavy lifting or strenuous exercise for 12 hours',
        '🧘 Practice relaxation techniques if feeling lightheaded',
        '🌡️ Monitor body temperature - slight elevation is normal',
        '🚗 Have someone drive you home if feeling dizzy',
        '⏰ Eat regular meals to maintain blood sugar levels'
      ],
      supplements: [
        '💊 Iron supplement (18mg) daily for 2 weeks if recommended by doctor',
        '🟡 Vitamin C (500mg) with iron to enhance absorption',
        '🔴 B-Complex vitamins to support red blood cell production',
        '💚 Folic acid (400mcg) for DNA synthesis and cell division',
        '🟠 Vitamin B12 for healthy nerve function and blood formation'
      ],
      warning_signs: [
        'Excessive bleeding from needle site that will not stop',
        'Severe dizziness or fainting spells',
        'Persistent nausea or vomiting',
        'Fever above 100.4°F (38°C)',
        'Severe arm pain or swelling at donation site',
        'Irregular heartbeat or chest pain',
        'Contact medical team immediately if any occur'
      ],
      timeline: [
        '0-2 hours: Rest and hydrate, light snack recommended',
        '2-4 hours: Normal activities okay, avoid heavy lifting',
        '4-8 hours: Full fluid replacement, regular meals',
        '24 hours: Exercise restrictions lifted, continue hydration',
        '48 hours: Iron-rich diet focus, monitor energy levels',
        '1 week: Schedule follow-up if any concerns persist'
      ]
    };

    const transfusionRecommendations = {
      foods: [
        '🥗 Light, easily digestible meals for the first 24 hours',
        '🍗 Lean proteins: Chicken, fish, eggs to support recovery',
        '🥬 Fresh vegetables rich in vitamins and minerals',
        '🍎 Antioxidant-rich fruits: Berries, apples, oranges',
        '🥛 Low-fat dairy for calcium and protein',
        '🍚 Complex carbohydrates for energy: Brown rice, quinoa',
        '🌿 Anti-inflammatory foods: Turmeric, ginger, leafy greens'
      ],
      lifestyle: [
        '🛌 Extended rest for 24-48 hours as recommended',
        '💧 Follow fluid intake guidelines from medical team',
        '🏥 Take all prescribed medications exactly as directed',
        '🌡️ Monitor temperature regularly for signs of reaction',
        '📱 Keep emergency contacts readily available',
        '🚭 Avoid smoking to optimize oxygen delivery',
        '☀️ Gentle activities only - walking is encouraged'
      ],
      monitoring: [
        '🌡️ Temperature every 4 hours for first 24 hours',
        '💓 Heart rate and blood pressure if equipment available',
        '🩸 Watch injection site for swelling, redness, or pain',
        '😮‍💨 Monitor breathing - report any difficulty immediately',
        '🟡 Urine color changes could indicate kidney function',
        '🤒 Any flu-like symptoms should be reported',
        '📞 Call healthcare team with ANY concerns'
      ],
      followup: [
        '📅 Schedule 48-hour follow-up appointment',
        '🩸 Blood work in 1 week to check levels',
        '💊 Complete any prescribed antibiotic courses',
        '📝 Keep detailed symptom diary for first week',
        '🏥 Know when to return to hospital immediately',
        '📞 Emergency contact numbers programmed in phone'
      ],
      emergency_signs: [
        '🆘 Difficulty breathing or shortness of breath',
        '🔥 Fever above 101°F (38.3°C)',
        '🤮 Severe nausea, vomiting, or diarrhea',
        '💓 Rapid or irregular heartbeat',
        '🩸 Dark urine or decreased urination',
        '😵 Severe weakness or confusion',
        '🚨 Call 911 or go to ER immediately if any occur'
      ]
    };

    return activityType === 'donation' ? donationRecommendations : transfusionRecommendations;
  };

  const handleAIGuidance = (activityType: 'donation' | 'transfusion', activity: any) => {
    const recommendations = generateAIRecommendations(
      activityType, 
      activityType === 'donation' ? mockUserProfile.bloodType : activity.bloodType,
      activity.date
    );
    setAiRecommendations({ type: activityType, activity, recommendations });
    setShowAiModal(true);
  };

  const getPointsBadgeColor = (points: number) => {
    if (points >= 1000) return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    if (points >= 500) return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    if (points >= 200) return 'bg-gradient-to-r from-green-500 to-teal-500 text-white';
    return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  };

  const getNextReward = (points: number) => {
    if (points < 200) return { reward: 'Bronze Donor', needed: 200 - points };
    if (points < 500) return { reward: 'Silver Donor', needed: 500 - points };
    if (points < 1000) return { reward: 'Gold Donor', needed: 1000 - points };
    return { reward: 'Platinum Donor', needed: 0 };
  };

  return (
    <MainLayout>
      <AuthGuard>
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Blood Donation Hub
              </h1>
              <p className="text-xl text-gray-600">
                Track donations, transfusions, and earn rewards for saving lives
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full font-bold text-sm ${getPointsBadgeColor(mockUserProfile.totalPoints)}`}>
                <Trophy className="h-4 w-4 inline mr-2" />
                {mockUserProfile.totalPoints} Points
              </div>
              <Badge variant="outline" className="text-blue-600">
                <Droplets className="h-4 w-4 mr-1" />
                {mockUserProfile.bloodType}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donations</p>
                    <p className="text-3xl font-bold text-red-600">{mockUserProfile.totalDonations}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Lives saved</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-red-50">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reward Points</p>
                    <p className="text-3xl font-bold text-purple-600">{mockUserProfile.totalPoints}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Trophy className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-600">{getNextReward(mockUserProfile.totalPoints).needed > 0 ? `${getNextReward(mockUserProfile.totalPoints).needed} to ${getNextReward(mockUserProfile.totalPoints).reward}` : 'Max Level'}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Eligible</p>
                    <p className="text-lg font-bold text-blue-600">{mockUserProfile.nextEligibleDate}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Can donate again</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Health Status</p>
                    <p className="text-lg font-bold text-green-600 capitalize">{mockUserProfile.eligibilityStatus}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Ready to donate</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule Donation</TabsTrigger>
              <TabsTrigger value="donations">My Donations</TabsTrigger>
              <TabsTrigger value="transfusions">My Transfusions</TabsTrigger>
              <TabsTrigger value="upcoming">Blood Drives</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDonationHistory.slice(0, 3).map((donation) => (
                        <div key={donation.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{donation.type} Donation</div>
                            <div className="text-xs text-gray-600">{donation.date} • {donation.location}</div>
                            <div className="text-xs text-green-600 mt-1">+{donation.pointsEarned} points earned</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">Completed</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAIGuidance('donation', donation)}
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              AI Guide
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUpcomingDrives.slice(0, 2).map((drive) => (
                        <div key={drive.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm">{drive.name}</div>
                            <Badge variant="secondary" className="text-xs">
                              +{drive.bonusPoints} bonus
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {drive.date} • {drive.time}
                          </div>
                          <div className="text-xs text-gray-700 mb-3">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {drive.location}
                          </div>
                          <Button size="sm" className="w-full">
                            Register Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Schedule Donation Tab */}
            <TabsContent value="schedule" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Donation Booking Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Schedule Your Next Donation
                    </CardTitle>
                    <CardDescription>
                      Book an appointment to donate blood and save lives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockUserProfile.eligibilityStatus === 'eligible' ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Preferred Date</label>
                            <Input
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Preferred Time</label>
                            <select className="w-full p-2 border rounded-md">
                              <option value="">Select time</option>
                              <option value="09:00">9:00 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="13:00">1:00 PM</option>
                              <option value="14:00">2:00 PM</option>
                              <option value="15:00">3:00 PM</option>
                              <option value="16:00">4:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Location</label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="">Select location</option>
                            <option value="main-hospital">Main Hospital Blood Bank</option>
                            <option value="north-clinic">North Side Clinic</option>
                            <option value="community-center">Community Health Center</option>
                            <option value="mobile-unit">Mobile Blood Drive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Donation Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <div className="flex items-center gap-2">
                                <input type="radio" name="donationType" value="whole-blood" />
                                <div>
                                  <div className="font-medium">Whole Blood</div>
                                  <div className="text-xs text-gray-600">Standard donation - 450ml</div>
                                  <div className="text-xs text-green-600">+100 points</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <div className="flex items-center gap-2">
                                <input type="radio" name="donationType" value="platelets" />
                                <div>
                                  <div className="font-medium">Platelets</div>
                                  <div className="text-xs text-gray-600">Apheresis - 2 hours</div>
                                  <div className="text-xs text-green-600">+200 points</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Special Requirements (Optional)</label>
                          <Textarea
                            placeholder="Any special needs, accessibility requirements, or notes..."
                            rows={3}
                          />
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            AI Pre-Donation Tips
                          </h4>
                          <div className="space-y-1 text-sm text-blue-800">
                            <div>• Drink 16oz of water 2 hours before appointment</div>
                            <div>• Eat iron-rich meal 3-4 hours before donation</div>
                            <div>• Get 7-9 hours of sleep the night before</div>
                            <div>• Bring valid ID and list of medications</div>
                          </div>
                        </div>

                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <AlertCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Currently Not Eligible</h3>
                        <p className="text-gray-600 mb-4">
                          Next eligible date: {mockUserProfile.nextEligibleDate}
                        </p>
                        <Button variant="outline">
                          <Bell className="h-4 w-4 mr-2" />
                          Notify Me When Eligible
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Donation Information & Benefits */}
                <div className="space-y-6">
                  {/* Eligibility Check */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Eligibility Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Blood Type</span>
                          <Badge variant="outline">{mockUserProfile.bloodType}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Age</span>
                          <span className="text-sm font-medium">{mockUserProfile.age} years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weight</span>
                          <span className="text-sm font-medium">{mockUserProfile.weight} kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Last Donation</span>
                          <span className="text-sm font-medium">Jan 15, 2025</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Status</span>
                          <Badge variant={mockUserProfile.eligibilityStatus === 'eligible' ? 'default' : 'secondary'}>
                            {mockUserProfile.eligibilityStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Points Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-purple-600" />
                        Earn Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Whole Blood Donation</div>
                              <div className="text-sm text-gray-600">Standard 450ml donation</div>
                            </div>
                            <div className="text-green-600 font-bold">+100 pts</div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Platelet Donation</div>
                              <div className="text-sm text-gray-600">Apheresis process</div>
                            </div>
                            <div className="text-blue-600 font-bold">+200 pts</div>
                          </div>
                        </div>

                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">First-Time Bonus</div>
                              <div className="text-sm text-gray-600">New donor incentive</div>
                            </div>
                            <div className="text-purple-600 font-bold">+50 pts</div>
                          </div>
                        </div>

                        <div className="text-center pt-2">
                          <div className="text-sm text-gray-600">Your current points:</div>
                          <div className="text-2xl font-bold text-purple-600">{mockUserProfile.totalPoints}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pre-Donation Guide */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Preparation Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-green-600" />
                          <span>Eat iron-rich foods 24 hours before</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-600" />
                          <span>Stay well hydrated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-purple-600" />
                          <span>Get good sleep (7-9 hours)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-orange-600" />
                          <span>Avoid heavy exercise day before</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => handleAIGuidance('donation', { type: 'pre-donation', date: new Date().toISOString() })}
                      >
                        <Brain className="h-3 w-3 mr-2" />
                        Get AI Preparation Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    My Donation History
                  </CardTitle>
                  <CardDescription>
                    Complete history of your blood donations and their impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDonationHistory.map((donation) => (
                      <Card key={donation.id} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{donation.type} Donation</h4>
                              <p className="text-sm text-gray-600">{donation.date} • {donation.location}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="default" className="mb-2">Completed</Badge>
                              <div className="text-sm font-medium text-green-600">+{donation.pointsEarned} points</div>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h5 className="font-medium text-sm mb-1">Volume Donated</h5>
                              <p className="text-sm text-gray-700">{donation.volume}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm mb-1">Blood Usage</h5>
                              <p className="text-sm text-gray-700">
                                {donation.bloodUsed ? 'Used ✓' : 'In Storage'}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm mb-1">Impact</h5>
                              <p className="text-sm text-gray-700">{donation.recipientInfo}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h5 className="font-medium text-sm mb-2">Pre-Donation Test Results</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div className="p-2 bg-gray-50 rounded">
                                <div className="font-medium">Hemoglobin</div>
                                <div>{donation.testResults.hemoglobin}</div>
                              </div>
                              <div className="p-2 bg-gray-50 rounded">
                                <div className="font-medium">Blood Pressure</div>
                                <div>{donation.testResults.bloodPressure}</div>
                              </div>
                              <div className="p-2 bg-gray-50 rounded">
                                <div className="font-medium">Temperature</div>
                                <div>{donation.testResults.temperature}</div>
                              </div>
                              <div className="p-2 bg-gray-50 rounded">
                                <div className="font-medium">Status</div>
                                <div className="text-green-600 capitalize">{donation.testResults.status}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAIGuidance('donation', donation)}
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              AI Recovery Guide
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download Certificate
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-3 w-3 mr-1" />
                              Share Impact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transfusions Tab */}
            <TabsContent value="transfusions" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    My Transfusion History
                  </CardTitle>
                  <CardDescription>
                    Record of blood transfusions you have received
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransfusionHistory.map((transfusion) => (
                      <Card key={transfusion.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">Blood Transfusion</h4>
                              <p className="text-sm text-gray-600">{transfusion.date} • {transfusion.hospital}</p>
                            </div>
                            <Badge variant="secondary">Completed</Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h5 className="font-medium text-sm mb-1">Blood Type</h5>
                              <p className="text-sm text-gray-700">{transfusion.bloodType}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm mb-1">Units Received</h5>
                              <p className="text-sm text-gray-700">{transfusion.unitsReceived} units</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm mb-1">Attending Doctor</h5>
                              <p className="text-sm text-gray-700">{transfusion.doctor}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h5 className="font-medium text-sm mb-1">Medical Reason</h5>
                            <p className="text-sm text-gray-700">{transfusion.reason}</p>
                          </div>

                          <div className="mb-4">
                            <h5 className="font-medium text-sm mb-1">Recovery Notes</h5>
                            <p className="text-sm text-gray-700">{transfusion.recoveryNotes}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAIGuidance('transfusion', transfusion)}
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              AI Recovery Guide
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Medical Record
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upcoming Blood Drives Tab */}
            <TabsContent value="upcoming" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Upcoming Blood Drives
                  </CardTitle>
                  <CardDescription>
                    Find and register for blood donation drives in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {mockUpcomingDrives.map((drive) => (
                      <Card key={drive.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold">{drive.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              +{drive.bonusPoints} bonus points
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{drive.date} • {drive.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{drive.location}</span>
                            </div>
                            <div className="text-xs text-gray-600">{drive.address}</div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span>{drive.slotsAvailable} slots available</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h5 className="font-medium text-sm mb-2">Urgent Need:</h5>
                            <div className="flex gap-2">
                              {drive.urgentNeed.map((bloodType) => (
                                <Badge key={bloodType} variant="destructive" className="text-xs">
                                  {bloodType}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1">Register Now</Button>
                            <Button variant="outline" size="sm">
                              <Bell className="h-3 w-3 mr-1" />
                              Remind Me
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Your Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Award className="h-8 w-8 text-yellow-600" />
                          <div>
                            <div className="font-semibold">Gold Donor</div>
                            <div className="text-sm text-gray-600">8+ donations completed</div>
                          </div>
                        </div>
                        <Badge variant="secondary">Achieved</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Heart className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="font-semibold">Life Saver</div>
                            <div className="text-sm text-gray-600">Saved 24+ lives</div>
                          </div>
                        </div>
                        <Badge variant="secondary">Achieved</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg opacity-60">
                        <div className="flex items-center gap-3">
                          <Star className="h-8 w-8 text-purple-600" />
                          <div>
                            <div className="font-semibold">Platinum Donor</div>
                            <div className="text-sm text-gray-600">15+ donations needed</div>
                          </div>
                        </div>
                        <Badge variant="outline">7 more</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Points & Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">{mockUserProfile.totalPoints}</div>
                        <div className="text-sm text-gray-600">Total Points Earned</div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-semibold">Available Rewards:</h5>
                        
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Free Health Checkup</div>
                              <div className="text-sm text-gray-600">300 points</div>
                            </div>
                            <Button size="sm" disabled={mockUserProfile.totalPoints < 300}>
                              Redeem
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Hospital Cafe Voucher</div>
                              <div className="text-sm text-gray-600">150 points</div>
                            </div>
                            <Button size="sm">
                              Redeem
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Blood Donor T-Shirt</div>
                              <div className="text-sm text-gray-600">200 points</div>
                            </div>
                            <Button size="sm">
                              Redeem
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* AI Recommendations Modal */}
          {showAiModal && aiRecommendations && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-purple-600" />
                      AI {aiRecommendations.type === 'donation' ? 'Post-Donation' : 'Post-Transfusion'} Recovery Guide
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAiModal(false)}
                    >
                      ×
                    </Button>
                  </div>
                  <CardDescription>
                    Personalized recommendations for optimal recovery and health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Nutrition Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">🥗 Nutrition Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {aiRecommendations.recommendations.foods.map((food: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{food}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lifestyle Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">🏃 Lifestyle Guidelines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {aiRecommendations.recommendations.lifestyle.map((lifestyle: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{lifestyle}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional recommendations based on type */}
                    {aiRecommendations.type === 'donation' && (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">💊 Supplement Suggestions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {aiRecommendations.recommendations.supplements.map((supplement: string, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{supplement}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">⚠️ Warning Signs to Watch</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {aiRecommendations.recommendations.warning_signs.map((sign: string, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{sign}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {aiRecommendations.type === 'transfusion' && (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">🔍 Monitoring Guidelines</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {aiRecommendations.recommendations.monitoring.map((monitor: string, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Eye className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{monitor}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">📅 Follow-up Care</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {aiRecommendations.recommendations.followup.map((followup: string, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{followup}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowAiModal(false)}>
                        Close
                      </Button>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download Guide
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AuthGuard>
    </MainLayout>
  );
}
