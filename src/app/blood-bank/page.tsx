'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  Search,
  Plus,
  Edit,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Droplets,
  Brain
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';

// Mock blood bank data
const bloodInventory = [
  {
    bloodType: 'O+',
    units: 45,
    critical: false,
    expiryDates: ['2025-02-15', '2025-02-18', '2025-02-20'],
    lastDonation: '2025-01-30',
    demandLevel: 'high'
  },
  {
    bloodType: 'O-',
    units: 12,
    critical: true,
    expiryDates: ['2025-02-10', '2025-02-12'],
    lastDonation: '2025-01-28',
    demandLevel: 'critical'
  },
  {
    bloodType: 'A+',
    units: 32,
    critical: false,
    expiryDates: ['2025-02-16', '2025-02-19', '2025-02-22'],
    lastDonation: '2025-01-31',
    demandLevel: 'moderate'
  },
  {
    bloodType: 'A-',
    units: 8,
    critical: true,
    expiryDates: ['2025-02-11', '2025-02-14'],
    lastDonation: '2025-01-29',
    demandLevel: 'high'
  },
  {
    bloodType: 'B+',
    units: 28,
    critical: false,
    expiryDates: ['2025-02-17', '2025-02-20', '2025-02-23'],
    lastDonation: '2025-01-30',
    demandLevel: 'moderate'
  },
  {
    bloodType: 'B-',
    units: 6,
    critical: true,
    expiryDates: ['2025-02-09', '2025-02-13'],
    lastDonation: '2025-01-27',
    demandLevel: 'high'
  },
  {
    bloodType: 'AB+',
    units: 15,
    critical: false,
    expiryDates: ['2025-02-18', '2025-02-21'],
    lastDonation: '2025-01-31',
    demandLevel: 'low'
  },
  {
    bloodType: 'AB-',
    units: 4,
    critical: true,
    expiryDates: ['2025-02-08'],
    lastDonation: '2025-01-26',
    demandLevel: 'moderate'
  }
];

const recentTransfusions = [
  {
    id: 'T001',
    patientId: 'P12345',
    patientName: 'John Smith',
    bloodType: 'O+',
    unitsUsed: 2,
    date: '2025-01-31',
    department: 'Emergency',
    doctor: 'Dr. Johnson',
    indication: 'Trauma - blood loss'
  },
  {
    id: 'T002',
    patientId: 'P12346',
    patientName: 'Maria Garcia',
    bloodType: 'A-',
    unitsUsed: 1,
    date: '2025-01-30',
    department: 'Surgery',
    doctor: 'Dr. Martinez',
    indication: 'Surgical procedure'
  },
  {
    id: 'T003',
    patientId: 'P12347',
    patientName: 'Robert Chen',
    bloodType: 'B+',
    unitsUsed: 3,
    date: '2025-01-29',
    department: 'ICU',
    doctor: 'Dr. Williams',
    indication: 'Severe anemia'
  }
];

const upcomingDonations = [
  {
    id: 'D001',
    donorName: 'Sarah Johnson',
    bloodType: 'O-',
    scheduledDate: '2025-02-01',
    contactNumber: '(555) 123-4567',
    lastDonation: '2024-12-01',
    status: 'confirmed'
  },
  {
    id: 'D002',
    donorName: 'Michael Brown',
    bloodType: 'A+',
    scheduledDate: '2025-02-02',
    contactNumber: '(555) 234-5678',
    lastDonation: '2024-11-15',
    status: 'pending'
  },
  {
    id: 'D003',
    donorName: 'Emily Davis',
    bloodType: 'B-',
    scheduledDate: '2025-02-03',
    contactNumber: '(555) 345-6789',
    lastDonation: '2024-10-20',
    status: 'confirmed'
  }
];

export default function BloodBankPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedTab, setSelectedTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const { session } = useSession();

  const generateMockPatients = (bloodType: string, matchType: 'exact' | 'compatible') => {
    const names = ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Brown', 'David Lee', 'Lisa Garcia', 'Tom Anderson', 'Maria Rodriguez'];
    const conditions = ['Surgery prep', 'Trauma', 'Anemia treatment', 'Cancer treatment', 'Emergency care', 'Chronic condition', 'Pre-operative', 'Post-operative'];
    const urgencyLevels = ['Critical', 'High', 'Medium', 'Low'];
    
    const patientCount = Math.floor(Math.random() * 6) + 2; // 2-7 patients
    const patients = [];
    
    for (let i = 0; i < patientCount; i++) {
      const isExactMatch = matchType === 'exact' || Math.random() > 0.6;
      let patientBloodType = bloodType;
      
      if (!isExactMatch) {
        // Generate compatible blood types based on transfusion compatibility
        const compatibleTypes = {
          'A+': ['A+', 'A-', 'O+', 'O-'],
          'A-': ['A-', 'O-'],
          'B+': ['B+', 'B-', 'O+', 'O-'],
          'B-': ['B-', 'O-'],
          'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
          'AB-': ['AB-', 'A-', 'B-', 'O-'],
          'O+': ['O+', 'O-'],
          'O-': ['O-']
        };
        
        const compatible = compatibleTypes[bloodType as keyof typeof compatibleTypes] || [bloodType];
        patientBloodType = compatible[Math.floor(Math.random() * compatible.length)];
      }
      
      patients.push({
        id: `P${String(i + 1).padStart(3, '0')}`,
        name: names[Math.floor(Math.random() * names.length)],
        bloodType: patientBloodType,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
        compatibility: `${Math.floor(Math.random() * 20) + 80}%`
      });
    }
    
    return patients;
  };

  const handleAIAnalysis = (bloodType: string, currentStock: number) => {
    // Mock AI analysis with patient matching
    const mockAnalysis = {
      bloodType,
      currentStock,
      matchingPatients: generateMockPatients(bloodType, 'exact'),
      compatiblePatients: generateMockPatients(bloodType, 'compatible'),
      urgentCases: Math.floor(Math.random() * 5) + 1,
      recommendations: [
        `${bloodType} blood is currently ${currentStock < 10 ? 'critically low' : currentStock < 20 ? 'low' : 'adequately stocked'}`,
        `${Math.floor(Math.random() * 3) + 1} patients require immediate transfusion`,
        `Recommend scheduling ${Math.floor(Math.random() * 2) + 1} additional donation drives`,
        `Cross-matching with O- universal donors shows ${Math.floor(Math.random() * 5) + 3} compatible units`,
        `Priority allocation suggested for critical care patients`
      ]
    };

    setAiAnalysisResult(mockAnalysis);
    setShowAiModal(true);
  };  const getDemandColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getTotalUnits = () => bloodInventory.reduce((total, item) => total + item.units, 0);
  const getCriticalTypes = () => bloodInventory.filter(item => item.critical).length;

  return (
    <MainLayout>
      <AuthGuard>
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Droplets className="h-10 w-10 text-red-600" />
                Blood Bank Management
              </h1>
              <p className="text-xl text-gray-600">
                AI-Powered Blood Inventory & Transfusion Management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-red-600">
                <Activity className="h-4 w-4 mr-1" />
                {session?.name || 'Blood Bank Staff'}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Units</p>
                    <p className="text-3xl font-bold text-gray-900">{getTotalUnits()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">In inventory</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Types</p>
                    <p className="text-3xl font-bold text-gray-900">{getCriticalTypes()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Low stock</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-red-50">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transfusions Today</p>
                    <p className="text-3xl font-bold text-gray-900">{recentTransfusions.length}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Donations Scheduled</p>
                    <p className="text-3xl font-bold text-gray-900">{upcomingDonations.length}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-600">This week</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inventory">Blood Inventory</TabsTrigger>
              <TabsTrigger value="transfusions">Transfusions</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Blood Inventory Tab */}
            <TabsContent value="inventory" className="mt-8">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-red-600" />
                      Blood Type Inventory
                    </CardTitle>
                    <CardDescription>Current blood stock levels by type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {bloodInventory.map((blood) => (
                        <Card key={blood.bloodType} className={`${blood.critical ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 mb-2">
                                {blood.bloodType}
                              </div>
                              <div className="text-3xl font-bold text-red-600 mb-2">
                                {blood.units}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">units available</div>
                              <Badge 
                                className={`text-xs ${getDemandColor(blood.demandLevel)}`}
                                variant="outline"
                              >
                                {blood.demandLevel} demand
                              </Badge>
                              {blood.critical && (
                                <div className="mt-2">
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Critical Low
                                  </Badge>
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-2">
                                Last donation: {blood.lastDonation}
                              </div>
                              <div className="mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="w-full text-xs border-blue-600 text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleAIAnalysis(blood.bloodType, blood.units)}
                                >
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI Analysis
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Expiry Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      Expiry Monitoring
                    </CardTitle>
                    <CardDescription>Blood units approaching expiry dates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bloodInventory.map((blood) => (
                        <div key={blood.bloodType} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-red-600">{blood.bloodType}</div>
                            <div className="text-sm text-gray-600">
                              {blood.units} units • Next expiry: {blood.expiryDates[0]}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.ceil((new Date(blood.expiryDates[0]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                            </Badge>
                            {Math.ceil((new Date(blood.expiryDates[0]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7 && (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transfusions Tab */}
            <TabsContent value="transfusions" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Recent Transfusions
                      </CardTitle>
                      <CardDescription>Blood transfusion records and patient information</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search transfusions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransfusions.map((transfusion) => (
                      <div key={transfusion.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{transfusion.patientName}</h3>
                            <p className="text-sm text-gray-600">ID: {transfusion.patientId}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {transfusion.bloodType}
                            </Badge>
                            <div className="text-sm text-gray-600">{transfusion.date}</div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Units Used:</span> {transfusion.unitsUsed}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {transfusion.department}
                          </div>
                          <div>
                            <span className="font-medium">Doctor:</span> {transfusion.doctor}
                          </div>
                          <div>
                            <span className="font-medium">Indication:</span> {transfusion.indication}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        Upcoming Donations
                      </CardTitle>
                      <CardDescription>Scheduled blood donation appointments</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Donation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDonations.map((donation) => (
                      <div key={donation.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{donation.donorName}</h3>
                            <p className="text-sm text-gray-600">{donation.contactNumber}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusColor(donation.status)} className="mb-1">
                              {donation.status}
                            </Badge>
                            <div className="text-sm text-gray-600">{donation.scheduledDate}</div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Blood Type:</span> {donation.bloodType}
                          </div>
                          <div>
                            <span className="font-medium">Last Donation:</span> {donation.lastDonation}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Donor
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Usage Trends
                    </CardTitle>
                    <CardDescription>Blood usage patterns and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['O+', 'O-', 'A+', 'A-'].map((type) => {
                        const usage = Math.floor(Math.random() * 30) + 10;
                        return (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-red-600"
                                  style={{ width: `${(usage / 40) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{usage} units/week</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      System Status
                    </CardTitle>
                    <CardDescription>Blood bank operational metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Inventory Status</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Adequate</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Critical Alerts</span>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">{getCriticalTypes()} types</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Waste Rate</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">2.1%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Donor Response Rate</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">87%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>AI-powered insights for blood bank management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Critical Stock Alert</h4>
                        <p className="text-sm text-red-600 mb-3">
                          O- and AB- blood types are critically low. Immediate donor recruitment recommended.
                        </p>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-600">
                          Launch Donor Campaign
                        </Button>
                      </div>
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 className="font-medium text-orange-800 mb-2">Expiry Warning</h4>
                        <p className="text-sm text-orange-600 mb-3">
                          6 units of various types will expire within 7 days. Consider priority usage.
                        </p>
                        <Button size="sm" variant="outline" className="border-orange-600 text-orange-600">
                          View Expiring Units
                        </Button>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Demand Forecast</h4>
                        <p className="text-sm text-blue-600 mb-3">
                          Predicted 25% increase in O+ demand next week based on surgical schedule.
                        </p>
                        <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">
                          Prepare Stock
                        </Button>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Efficiency Tip</h4>
                        <p className="text-sm text-green-600 mb-3">
                          Current waste rate is below average. Continue current inventory management practices.
                        </p>
                        <Button size="sm" variant="outline" className="border-green-600 text-green-600">
                          View Best Practices
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* AI Analysis Modal */}
          {showAiModal && aiAnalysisResult && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-purple-600" />
                      AI Blood Analysis - {aiAnalysisResult.bloodType}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAiModal(false)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    AI-powered patient matching and transfusion recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{aiAnalysisResult.currentStock}</div>
                        <div className="text-sm text-blue-800">Units Available</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{aiAnalysisResult.matchingPatients.length}</div>
                        <div className="text-sm text-green-800">Exact Matches</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">{aiAnalysisResult.urgentCases}</div>
                        <div className="text-sm text-red-800">Urgent Cases</div>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">AI Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {aiAnalysisResult.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Compatible Patients */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Compatible Patients in System</CardTitle>
                        <CardDescription>Patients who can receive {aiAnalysisResult.bloodType} blood</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {aiAnalysisResult.compatiblePatients.map((patient: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="text-lg font-bold text-red-600">{patient.bloodType}</div>
                                <div>
                                  <div className="font-medium">{patient.name}</div>
                                  <div className="text-sm text-gray-600">ID: {patient.id} • {patient.condition}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={patient.urgency === 'Critical' ? 'destructive' : 
                                          patient.urgency === 'High' ? 'destructive' : 
                                          patient.urgency === 'Medium' ? 'secondary' : 'default'}
                                  className="text-xs"
                                >
                                  {patient.urgency}
                                </Badge>
                                <div className="text-sm font-medium text-green-600">
                                  {patient.compatibility} match
                                </div>
                                <Button size="sm" variant="outline">
                                  Schedule Transfusion
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowAiModal(false)}>
                        Close Analysis
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Generate Report
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Contact Patients
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
