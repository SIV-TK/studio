'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';
import ICUMonitoringForm from '@/components/pages/icu-monitoring-form';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Monitor, 
  Brain,
  Stethoscope,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Bell,
  Settings,
  Eye,
  Cpu,
  Shield
} from 'lucide-react';

interface ICUPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  bedNumber: string;
  condition: string;
  admissionDate: string;
  vitals: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    respiratoryRate: number;
    oxygenSaturation: number;
    temperature: number;
    pain: number;
    centralVenousPressure: number;
    intracranialPressure?: number;
    cardiacOutput: number;
    lactate: number;
    ph: number;
    pco2: number;
    po2: number;
    glucose: number;
  };
  equipment: {
    ventilator?: {
      mode: string;
      fiO2: number;
      peep: number;
      tidalVolume: number;
      respiratoryRate: number;
      peakPressure: number;
      compliance: number;
    };
    dialysis?: {
      type: string;
      flowRate: number;
      ultrafiltrationRate: number;
      duration: number;
      access: string;
    };
    vasopressors?: Array<{
      medication: string;
      dose: number;
      unit: string;
    }>;
    iabp?: {
      ratio: string;
      augmentation: number;
    };
  };
  alerts: Array<{
    type: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: string;
    source: string;
    priority: number;
  }>;
  status: 'stable' | 'critical' | 'improving' | 'deteriorating';
  aiScore: number;
  aiAnalysis: {
    riskFactors: string[];
    recommendations: Array<{
      category: 'medication' | 'ventilation' | 'environment' | 'monitoring' | 'intervention';
      priority: 'high' | 'medium' | 'low';
      action: string;
      rationale: string;
      expectedOutcome: string;
    }>;
    predictedOutcome: string;
    confidence: number;
    trendsAnalysis: string;
  };
  medications: Array<{
    name: string;
    dose: string;
    route: string;
    frequency: string;
    indication: string;
  }>;
  connectedSystems: string[];
}

interface ConnectedSystem {
  id: string;
  name: string;
  type: 'monitor' | 'ventilator' | 'dialysis' | 'infusion_pump' | 'laboratory' | 'imaging';
  status: 'online' | 'offline' | 'error';
  lastUpdate: string;
  dataPoints: any;
}

export default function ICUPage() {
  const { session } = useSession();
  const [activeView, setActiveView] = useState<'overview' | 'patient' | 'analytics' | 'form'>('overview');
  const [selectedPatient, setSelectedPatient] = useState<ICUPatient | null>(null);
  const [icuPatients, setIcuPatients] = useState<ICUPatient[]>([]);
  const [connectedSystems, setConnectedSystems] = useState<ConnectedSystem[]>([]);
  const [realTimeData, setRealTimeData] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);

  // Simulate connected ICU systems
  useEffect(() => {
    const mockSystems: ConnectedSystem[] = [
      {
        id: 'philips_mx800',
        name: 'Philips MX800 Patient Monitor',
        type: 'monitor',
        status: 'online',
        lastUpdate: new Date().toISOString(),
        dataPoints: {
          heartRate: true,
          bloodPressure: true,
          respiratoryRate: true,
          oxygenSaturation: true,
          temperature: true,
          centralVenousPressure: true
        }
      },
      {
        id: 'drager_evita',
        name: 'Dräger Evita V500 Ventilator',
        type: 'ventilator',
        status: 'online',
        lastUpdate: new Date().toISOString(),
        dataPoints: {
          fiO2: true,
          peep: true,
          tidalVolume: true,
          peakPressure: true,
          compliance: true
        }
      },
      {
        id: 'fresenius_crrt',
        name: 'Fresenius MultiFilterPRO',
        type: 'dialysis',
        status: 'online',
        lastUpdate: new Date().toISOString(),
        dataPoints: {
          flowRate: true,
          ultrafiltrationRate: true,
          access: true
        }
      },
      {
        id: 'abbott_i_stat',
        name: 'Abbott i-STAT Blood Analyzer',
        type: 'laboratory',
        status: 'online',
        lastUpdate: new Date().toISOString(),
        dataPoints: {
          ph: true,
          pco2: true,
          po2: true,
          lactate: true,
          glucose: true
        }
      }
    ];
    
    setConnectedSystems(mockSystems);
  }, []);

  // Enhanced mock ICU patients data with connected systems data
  useEffect(() => {
    const mockPatients: ICUPatient[] = [
      {
        id: 'icu_001',
        name: 'John Martinez',
        age: 58,
        gender: 'Male',
        room: 'ICU-A',
        bedNumber: '101',
        condition: 'Septic Shock',
        admissionDate: '2025-07-29',
        vitals: {
          heartRate: 125,
          bloodPressure: { systolic: 95, diastolic: 55 },
          respiratoryRate: 28,
          oxygenSaturation: 89,
          temperature: 39.2,
          pain: 6,
          centralVenousPressure: 18,
          intracranialPressure: 12,
          cardiacOutput: 3.2,
          lactate: 4.8,
          ph: 7.28,
          pco2: 45,
          po2: 65,
          glucose: 180
        },
        equipment: {
          ventilator: {
            mode: 'SIMV + PS',
            fiO2: 70,
            peep: 12,
            tidalVolume: 450,
            respiratoryRate: 22,
            peakPressure: 35,
            compliance: 28
          },
          vasopressors: [
            { medication: 'Norepinephrine', dose: 15, unit: 'mcg/min' },
            { medication: 'Vasopressin', dose: 2.4, unit: 'units/hr' }
          ]
        },
        alerts: [
          { 
            type: 'critical', 
            message: 'Severe hypotension - MAP < 65 mmHg', 
            timestamp: '2025-07-31T10:15:00Z',
            source: 'Philips MX800',
            priority: 1
          },
          { 
            type: 'warning', 
            message: 'Elevated lactate (4.8 mmol/L) - tissue hypoperfusion', 
            timestamp: '2025-07-31T09:45:00Z',
            source: 'Abbott i-STAT',
            priority: 2
          },
          {
            type: 'critical',
            message: 'High PEEP requirement - consider lung recruitment',
            timestamp: '2025-07-31T10:30:00Z',
            source: 'Dräger Evita V500',
            priority: 1
          }
        ],
        status: 'critical',
        aiScore: 15,
        aiAnalysis: {
          riskFactors: [
            'Refractory septic shock with high vasopressor requirements',
            'Acute respiratory distress syndrome (ARDS)',
            'Metabolic acidosis with elevated lactate',
            'Multi-organ dysfunction syndrome'
          ],
          recommendations: [
            {
              category: 'medication',
              priority: 'high',
              action: 'Increase norepinephrine to 20 mcg/min, add epinephrine 5 mcg/min',
              rationale: 'Current MAP 58 mmHg below target of 65-70 mmHg',
              expectedOutcome: 'Improve organ perfusion and reduce lactate by 20%'
            },
            {
              category: 'ventilation',
              priority: 'high',
              action: 'Implement lung recruitment maneuver, increase PEEP to 14 cmH2O',
              rationale: 'P/F ratio 127 indicates severe ARDS, current PEEP suboptimal',
              expectedOutcome: 'Improve oxygenation by 15-20%'
            },
            {
              category: 'monitoring',
              priority: 'medium',
              action: 'Place pulmonary artery catheter for cardiac output monitoring',
              rationale: 'Mixed shock picture requires differentiation of cardiogenic component',
              expectedOutcome: 'Guide fluid and vasopressor therapy'
            },
            {
              category: 'intervention',
              priority: 'high',
              action: 'Consider prone positioning for 16 hours',
              rationale: 'Severe ARDS with P/F ratio < 150',
              expectedOutcome: 'Improve oxygenation and reduce mortality risk'
            }
          ],
          predictedOutcome: '48-hour mortality risk: 35%. Recommend aggressive organ support and frequent reassessment.',
          confidence: 87,
          trendsAnalysis: 'Worsening over past 6 hours. Lactate trending up from 3.2 to 4.8. Blood pressure declining despite increased vasopressors.'
        },
        medications: [
          { name: 'Norepinephrine', dose: '15 mcg/min', route: 'IV', frequency: 'Continuous', indication: 'Septic shock' },
          { name: 'Vancomycin', dose: '1000 mg', route: 'IV', frequency: 'q12h', indication: 'Sepsis coverage' },
          { name: 'Propofol', dose: '20 mcg/kg/min', route: 'IV', frequency: 'Continuous', indication: 'Sedation' },
          { name: 'Fentanyl', dose: '100 mcg/hr', route: 'IV', frequency: 'Continuous', indication: 'Analgesia' }
        ],
        connectedSystems: ['philips_mx800', 'drager_evita', 'abbott_i_stat']
      },
      {
        id: 'icu_002',
        name: 'Sarah Thompson',
        age: 45,
        gender: 'Female',
        room: 'ICU-B',
        bedNumber: '102',
        condition: 'Post-Surgical Monitoring',
        admissionDate: '2025-07-30',
        vitals: {
          heartRate: 78,
          bloodPressure: { systolic: 118, diastolic: 72 },
          respiratoryRate: 16,
          oxygenSaturation: 97,
          temperature: 37.1,
          pain: 3,
          centralVenousPressure: 8,
          cardiacOutput: 5.2,
          lactate: 1.2,
          ph: 7.42,
          pco2: 38,
          po2: 95,
          glucose: 120
        },
        equipment: {},
        alerts: [
          { 
            type: 'info', 
            message: 'Patient stable - consider step-down to ward in 6 hours', 
            timestamp: '2025-07-31T08:30:00Z',
            source: 'AI Clinical Decision Support',
            priority: 3
          }
        ],
        status: 'improving',
        aiScore: 85,
        aiAnalysis: {
          riskFactors: [
            'Post-operative day 1 - monitoring for complications',
            'History of cardiac disease - watch for perioperative cardiac events'
          ],
          recommendations: [
            {
              category: 'monitoring',
              priority: 'low',
              action: 'Continue current monitoring, reduce frequency to q2h',
              rationale: 'Stable vitals for 12 hours, low risk profile',
              expectedOutcome: 'Safe step-down in 6-8 hours'
            },
            {
              category: 'medication',
              priority: 'medium',
              action: 'Transition to oral pain medication',
              rationale: 'Pain well controlled, patient awake and cooperative',
              expectedOutcome: 'Facilitate early mobilization'
            }
          ],
          predictedOutcome: 'Excellent prognosis. Expected discharge from ICU within 12 hours.',
          confidence: 92,
          trendsAnalysis: 'Steady improvement over past 18 hours. All parameters trending toward normal.'
        },
        medications: [
          { name: 'Morphine PCA', dose: '1-2 mg', route: 'IV', frequency: 'PRN', indication: 'Post-op pain' },
          { name: 'Cefazolin', dose: '1 g', route: 'IV', frequency: 'q8h', indication: 'Surgical prophylaxis' },
          { name: 'Heparin', dose: '5000 units', route: 'SC', frequency: 'q12h', indication: 'DVT prophylaxis' }
        ],
        connectedSystems: ['philips_mx800']
      },
      {
        id: 'icu_003',
        name: 'Robert Chen',
        age: 72,
        gender: 'Male',
        room: 'ICU-C',
        bedNumber: '103',
        condition: 'Acute Respiratory Failure',
        admissionDate: '2025-07-28',
        vitals: {
          heartRate: 110,
          bloodPressure: { systolic: 140, diastolic: 85 },
          respiratoryRate: 32,
          oxygenSaturation: 92,
          temperature: 38.5,
          pain: 4,
          centralVenousPressure: 15,
          cardiacOutput: 4.1,
          lactate: 2.8,
          ph: 7.31,
          pco2: 52,
          po2: 72,
          glucose: 160
        },
        equipment: {
          ventilator: {
            mode: 'AC/VC',
            fiO2: 60,
            peep: 10,
            tidalVolume: 420,
            respiratoryRate: 20,
            peakPressure: 32,
            compliance: 32
          },
          dialysis: {
            type: 'CRRT',
            flowRate: 150,
            ultrafiltrationRate: 200,
            duration: 18,
            access: 'Right femoral'
          }
        },
        alerts: [
          { 
            type: 'warning', 
            message: 'Increasing ventilator requirements - FiO2 up from 50% to 60%', 
            timestamp: '2025-07-31T11:00:00Z',
            source: 'Dräger Evita V500',
            priority: 2
          },
          { 
            type: 'critical', 
            message: 'PaO2/FiO2 ratio declining - now 120 (severe ARDS)', 
            timestamp: '2025-07-31T10:45:00Z',
            source: 'Abbott i-STAT',
            priority: 1
          }
        ],
        status: 'deteriorating',
        aiScore: 35,
        aiAnalysis: {
          riskFactors: [
            'Acute respiratory distress syndrome (ARDS) - severe',
            'Acute kidney injury requiring CRRT',
            'Advanced age with limited physiologic reserve',
            'Worsening P/F ratio over 24 hours'
          ],
          recommendations: [
            {
              category: 'ventilation',
              priority: 'high',
              action: 'Initiate prone positioning protocol for 16 hours',
              rationale: 'P/F ratio 120 indicates severe ARDS, prone positioning shown to reduce mortality',
              expectedOutcome: 'Improve oxygenation by 20-30%'
            },
            {
              category: 'medication',
              priority: 'medium',
              action: 'Consider methylprednisolone 1mg/kg/day for 7 days',
              rationale: 'Steroid therapy may reduce lung inflammation in ARDS',
              expectedOutcome: 'Potential reduction in ventilator days'
            },
            {
              category: 'monitoring',
              priority: 'high',
              action: 'Increase ABG frequency to q4h, add continuous EtCO2',
              rationale: 'Rapidly changing respiratory status requires close monitoring',
              expectedOutcome: 'Early detection of further deterioration'
            }
          ],
          predictedOutcome: '7-day mortality risk: 28%. Aggressive lung protective strategy recommended.',
          confidence: 83,
          trendsAnalysis: 'Deteriorating over 48 hours. P/F ratio down from 200 to 120. PEEP requirements increasing.'
        },
        medications: [
          { name: 'Midazolam', dose: '2 mg/hr', route: 'IV', frequency: 'Continuous', indication: 'Sedation' },
          { name: 'Rocuronium', dose: '10 mg/hr', route: 'IV', frequency: 'Continuous', indication: 'Paralysis for ARDS' },
          { name: 'Methylprednisolone', dose: '80 mg', route: 'IV', frequency: 'Daily', indication: 'ARDS treatment' },
          { name: 'Furosemide', dose: '20 mg', route: 'IV', frequency: 'q12h', indication: 'Fluid management' }
        ],
        connectedSystems: ['philips_mx800', 'drager_evita', 'fresenius_crrt', 'abbott_i_stat']
      }
    ];
    
    setIcuPatients(mockPatients);
  }, []);

  // Simulate real-time data updates from connected systems
  useEffect(() => {
    if (!realTimeData) return;
    
    const interval = setInterval(async () => {
      // Simulate fetching data from connected systems
      const updatedPatients = icuPatients.map(patient => {
        const updatedVitals = { ...patient.vitals };
        
        // Simulate realistic vital sign changes based on patient condition
        if (patient.status === 'critical') {
          updatedVitals.heartRate += (Math.random() * 10 - 5);
          updatedVitals.oxygenSaturation = Math.max(85, updatedVitals.oxygenSaturation + (Math.random() * 4 - 2));
          updatedVitals.lactate = Math.max(1, updatedVitals.lactate + (Math.random() * 0.4 - 0.2));
        } else if (patient.status === 'improving') {
          updatedVitals.heartRate += (Math.random() * 4 - 2);
          updatedVitals.oxygenSaturation = Math.min(100, updatedVitals.oxygenSaturation + (Math.random() * 2 - 0.5));
        }
        
        // AI re-analysis based on new data
        const updatedAiScore = calculateAIRiskScore(updatedVitals, patient.equipment, patient.condition);
        
        return {
          ...patient,
          vitals: updatedVitals,
          aiScore: updatedAiScore
        };
      });
      
      setIcuPatients(updatedPatients);
      
      // Generate system alerts
      generateSystemAlerts(updatedPatients);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [realTimeData, icuPatients]);

  // AI Risk Score Calculation
  const calculateAIRiskScore = (vitals: any, equipment: any, condition: string) => {
    let score = 100;
    
    // Vital signs scoring
    if (vitals.heartRate > 120 || vitals.heartRate < 60) score -= 15;
    if (vitals.bloodPressure.systolic < 90) score -= 20;
    if (vitals.oxygenSaturation < 90) score -= 25;
    if (vitals.lactate > 4) score -= 20;
    if (vitals.ph < 7.30) score -= 15;
    
    // Equipment dependency
    if (equipment.ventilator) score -= 10;
    if (equipment.dialysis) score -= 15;
    if (equipment.vasopressors?.length > 0) score -= 20;
    
    // Condition severity
    if (condition.includes('Septic')) score -= 25;
    if (condition.includes('Respiratory Failure')) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  };

  // Generate AI-powered system alerts
  const generateSystemAlerts = (patients: ICUPatient[]) => {
    const alerts: any[] = [];
    
    patients.forEach(patient => {
      // Critical vital sign alerts
      if (patient.vitals.oxygenSaturation < 88) {
        alerts.push({
          patientId: patient.id,
          type: 'critical',
          message: `${patient.name}: Severe hypoxemia (SpO2 ${Math.round(patient.vitals.oxygenSaturation)}%)`,
          recommendation: 'Increase FiO2, consider recruitment maneuver',
          timestamp: new Date().toISOString()
        });
      }
      
      if (patient.vitals.lactate > 4.0) {
        alerts.push({
          patientId: patient.id,
          type: 'critical',
          message: `${patient.name}: Severe hyperlactatemia (${patient.vitals.lactate} mmol/L)`,
          recommendation: 'Increase vasopressor support, consider inotropes',
          timestamp: new Date().toISOString()
        });
      }
      
      // Equipment alerts
      if (patient.equipment.ventilator && patient.equipment.ventilator.peakPressure > 35) {
        alerts.push({
          patientId: patient.id,
          type: 'warning',
          message: `${patient.name}: High peak airway pressure (${patient.equipment.ventilator.peakPressure} cmH2O)`,
          recommendation: 'Check for patient-ventilator dyssynchrony, consider paralysis',
          timestamp: new Date().toISOString()
        });
      }
    });
    
    setSystemAlerts(alerts.slice(0, 5)); // Keep only latest 5 alerts
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'deteriorating': return 'text-orange-600 bg-orange-100';
      case 'stable': return 'text-blue-600 bg-blue-100';
      case 'improving': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Real-time System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Critical System Alerts</h3>
          </div>
          <div className="mt-3 space-y-2">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="text-red-700 font-medium">{alert.message}</p>
                  <p className="text-red-600 text-sm">AI Recommendation: {alert.recommendation}</p>
                </div>
                <span className="text-red-500 text-xs">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Systems Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Connected ICU Systems
          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
            {connectedSystems.filter(s => s.status === 'online').length} Online
          </span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {connectedSystems.map((system) => (
            <div key={system.id} className="p-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  system.status === 'online' ? 'bg-green-500' : 
                  system.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  system.status === 'online' ? 'bg-green-100 text-green-800' : 
                  system.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {system.status}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">{system.name}</h4>
              <p className="text-xs text-gray-600">{system.type}</p>
              <p className="text-xs text-gray-500 mt-1">
                Last update: {new Date(system.lastUpdate).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-900">{icuPatients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-semibold text-gray-900">
                {icuPatients.filter(p => p.status === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Improving</p>
              <p className="text-2xl font-semibold text-gray-900">
                {icuPatients.filter(p => p.status === 'improving').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Monitored</p>
              <p className="text-2xl font-semibold text-gray-900">{icuPatients.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid gap-6">
        {icuPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {patient.room} - Bed {patient.bedNumber}
                  </span>
                </div>
                <p className="text-gray-600">{patient.condition} • {patient.age}y {patient.gender}</p>
                <p className="text-sm text-gray-500">Admitted: {patient.admissionDate}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">AI Risk Score</p>
                  <p className={`text-2xl font-bold ${
                    patient.aiScore < 30 ? 'text-red-600' : 
                    patient.aiScore < 70 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {patient.aiScore}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setActiveView('patient');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Monitor
                </button>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">HR</p>
                <p className="font-semibold">{Math.round(patient.vitals.heartRate)}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <Activity className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">BP</p>
                <p className="font-semibold text-xs">
                  {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <Stethoscope className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">RR</p>
                <p className="font-semibold">{patient.vitals.respiratoryRate}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <Zap className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">SpO2</p>
                <p className="font-semibold">{Math.round(patient.vitals.oxygenSaturation)}%</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <Thermometer className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Temp</p>
                <p className="font-semibold">{patient.vitals.temperature}°C</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <Brain className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Pain</p>
                <p className="font-semibold">{patient.vitals.pain}/10</p>
              </div>
            </div>

            {/* Alerts */}
            {patient.alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Active Alerts
                </h4>
                {patient.alerts.slice(0, 2).map((alert, index) => (
                  <div key={index} className={`p-3 rounded-md border ${getAlertColor(alert.type)}`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <span className="text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Equipment Status */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Ventilator:</span>
                {patient.equipment.ventilator ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Dialysis:</span>
                {patient.equipment.dialysis ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Vasopressors:</span>
                {patient.equipment.vasopressors && patient.equipment.vasopressors.length > 0 ? (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {patient.equipment.vasopressors.length} active
                  </span>
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPatientDetail = () => {
    if (!selectedPatient) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{selectedPatient.name}</h2>
            <p className="text-gray-600">{selectedPatient.condition} • {selectedPatient.room} - Bed {selectedPatient.bedNumber}</p>
          </div>
          <button
            onClick={() => setActiveView('overview')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to Overview
          </button>
        </div>

        {/* Real-time Vitals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Real-time Vital Signs
            {realTimeData && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Heart Rate', value: Math.round(selectedPatient.vitals.heartRate), unit: 'bpm', icon: Heart, color: 'text-red-500', normal: selectedPatient.vitals.heartRate >= 60 && selectedPatient.vitals.heartRate <= 100 },
              { label: 'Blood Pressure', value: `${selectedPatient.vitals.bloodPressure.systolic}/${selectedPatient.vitals.bloodPressure.diastolic}`, unit: 'mmHg', icon: Activity, color: 'text-purple-500', normal: selectedPatient.vitals.bloodPressure.systolic >= 90 },
              { label: 'Respiratory Rate', value: selectedPatient.vitals.respiratoryRate, unit: '/min', icon: Stethoscope, color: 'text-blue-500', normal: selectedPatient.vitals.respiratoryRate >= 12 && selectedPatient.vitals.respiratoryRate <= 20 },
              { label: 'Oxygen Saturation', value: Math.round(selectedPatient.vitals.oxygenSaturation), unit: '%', icon: Zap, color: 'text-green-500', normal: selectedPatient.vitals.oxygenSaturation >= 95 }
            ].map((vital, index) => (
              <div key={index} className={`text-center p-4 rounded-lg ${vital.normal ? 'bg-gray-50' : 'bg-red-50 border-2 border-red-200'}`}>
                <vital.icon className={`h-8 w-8 ${vital.color} mx-auto mb-2`} />
                <p className="text-sm text-gray-600 mb-1">{vital.label}</p>
                <p className={`text-2xl font-bold ${vital.normal ? 'text-gray-900' : 'text-red-600'}`}>{vital.value}</p>
                <p className="text-xs text-gray-500">{vital.unit}</p>
                {!vital.normal && <p className="text-xs text-red-600 mt-1">ABNORMAL</p>}
              </div>
            ))}
          </div>

          {/* Extended Vitals */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Extended Monitoring</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Temperature', value: selectedPatient.vitals.temperature, unit: '°C', icon: Thermometer, color: 'text-orange-500', normal: selectedPatient.vitals.temperature >= 36.0 && selectedPatient.vitals.temperature <= 37.5 },
                { label: 'CVP', value: selectedPatient.vitals.centralVenousPressure, unit: 'mmHg', icon: Activity, color: 'text-indigo-500', normal: selectedPatient.vitals.centralVenousPressure >= 2 && selectedPatient.vitals.centralVenousPressure <= 8 },
                { label: 'Cardiac Output', value: selectedPatient.vitals.cardiacOutput, unit: 'L/min', icon: Heart, color: 'text-pink-500', normal: selectedPatient.vitals.cardiacOutput >= 4.0 && selectedPatient.vitals.cardiacOutput <= 8.0 },
                { label: 'Lactate', value: selectedPatient.vitals.lactate, unit: 'mmol/L', icon: Zap, color: 'text-yellow-500', normal: selectedPatient.vitals.lactate <= 2.0 },
                { label: 'pH', value: selectedPatient.vitals.ph, unit: '', icon: Brain, color: 'text-green-500', normal: selectedPatient.vitals.ph >= 7.35 && selectedPatient.vitals.ph <= 7.45 },
                { label: 'PCO2', value: selectedPatient.vitals.pco2, unit: 'mmHg', icon: Stethoscope, color: 'text-blue-500', normal: selectedPatient.vitals.pco2 >= 35 && selectedPatient.vitals.pco2 <= 45 },
                { label: 'PO2', value: selectedPatient.vitals.po2, unit: 'mmHg', icon: Zap, color: 'text-teal-500', normal: selectedPatient.vitals.po2 >= 80 },
                { label: 'Glucose', value: selectedPatient.vitals.glucose, unit: 'mg/dL', icon: Thermometer, color: 'text-purple-500', normal: selectedPatient.vitals.glucose >= 70 && selectedPatient.vitals.glucose <= 180 }
              ].map((vital, index) => (
                <div key={index} className={`text-center p-3 rounded-md ${vital.normal ? 'bg-gray-50' : 'bg-red-50 border border-red-200'}`}>
                  <vital.icon className={`h-6 w-6 ${vital.color} mx-auto mb-1`} />
                  <p className="text-xs text-gray-600 mb-1">{vital.label}</p>
                  <p className={`text-lg font-bold ${vital.normal ? 'text-gray-900' : 'text-red-600'}`}>{vital.value}</p>
                  <p className="text-xs text-gray-500">{vital.unit}</p>
                  {!vital.normal && <p className="text-xs text-red-600 mt-1">!</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            AI Clinical Assessment
            <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
              Live Analysis • {selectedPatient.aiAnalysis.confidence}% Confidence
            </span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Overall Risk Score</span>
                  <span className={`font-bold text-xl ${
                    selectedPatient.aiScore < 30 ? 'text-red-600' : 
                    selectedPatient.aiScore < 70 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {selectedPatient.aiScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedPatient.aiScore < 30 ? 'bg-red-600' : 
                      selectedPatient.aiScore < 70 ? 'bg-orange-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${selectedPatient.aiScore}%` }}
                  ></div>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-3 mt-6">Risk Factors</h4>
              <ul className="space-y-2 text-sm">
                {selectedPatient.aiAnalysis.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-3 bg-blue-50 rounded-md">
                <h5 className="font-medium text-blue-900 mb-2">Predicted Outcome</h5>
                <p className="text-blue-800 text-sm">{selectedPatient.aiAnalysis.predictedOutcome}</p>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <h5 className="font-medium text-yellow-900 mb-2">Trends Analysis</h5>
                <p className="text-yellow-800 text-sm">{selectedPatient.aiAnalysis.trendsAnalysis}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">AI Treatment Recommendations</h4>
              <div className="space-y-3 text-sm">
                {selectedPatient.aiAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-md border ${
                    rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                    rec.priority === 'medium' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {rec.category}
                      </span>
                    </div>
                    <p className={`font-medium mb-2 ${
                      rec.priority === 'high' ? 'text-red-900' :
                      rec.priority === 'medium' ? 'text-orange-900' :
                      'text-blue-900'
                    }`}>
                      {rec.action}
                    </p>
                    <p className={`mb-2 ${
                      rec.priority === 'high' ? 'text-red-800' :
                      rec.priority === 'medium' ? 'text-orange-800' :
                      'text-blue-800'
                    }`}>
                      <strong>Rationale:</strong> {rec.rationale}
                    </p>
                    <p className={`${
                      rec.priority === 'high' ? 'text-red-700' :
                      rec.priority === 'medium' ? 'text-orange-700' :
                      'text-blue-700'
                    }`}>
                      <strong>Expected:</strong> {rec.expectedOutcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Monitoring */}
        {(selectedPatient.equipment.ventilator || selectedPatient.equipment.dialysis || selectedPatient.equipment.vasopressors) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Monitor className="h-6 w-6 text-green-600" />
              Real-time Equipment Monitoring
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {selectedPatient.equipment.ventilator && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Mechanical Ventilation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mode:</span>
                      <span className="font-medium">{selectedPatient.equipment.ventilator.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FiO2:</span>
                      <span className="font-medium">{selectedPatient.equipment.ventilator.fiO2}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PEEP:</span>
                      <span className="font-medium">{selectedPatient.equipment.ventilator.peep} cmH2O</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tidal Volume:</span>
                      <span className="font-medium">{selectedPatient.equipment.ventilator.tidalVolume} mL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Pressure:</span>
                      <span className={`font-medium ${selectedPatient.equipment.ventilator.peakPressure > 35 ? 'text-red-600' : ''}`}>
                        {selectedPatient.equipment.ventilator.peakPressure} cmH2O
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance:</span>
                      <span className="font-medium">{selectedPatient.equipment.ventilator.compliance} mL/cmH2O</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPatient.equipment.dialysis && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Continuous Renal Replacement
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{selectedPatient.equipment.dialysis.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flow Rate:</span>
                      <span className="font-medium">{selectedPatient.equipment.dialysis.flowRate} mL/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UF Rate:</span>
                      <span className="font-medium">{selectedPatient.equipment.dialysis.ultrafiltrationRate} mL/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{selectedPatient.equipment.dialysis.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Access:</span>
                      <span className="font-medium">{selectedPatient.equipment.dialysis.access}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPatient.equipment.vasopressors && selectedPatient.equipment.vasopressors.length > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Vasopressor Support
                  </h4>
                  <div className="space-y-3 text-sm">
                    {selectedPatient.equipment.vasopressors.map((vaso, index) => (
                      <div key={index} className="p-2 bg-white rounded border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{vaso.medication}</span>
                          <span className="text-orange-600 font-bold">
                            {vaso.dose} {vaso.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Medications</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedPatient.medications.map((med, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-900">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dose} • {med.route} • {med.frequency}</p>
                <p className="text-xs text-gray-500">{med.indication}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                AI ICU Monitoring System
              </h1>
              <p className="text-xl text-gray-600">
                Real-time AI-powered intensive care monitoring with critical alerts and treatment optimization
              </p>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="flex space-x-1 bg-gray-100 p-1">
                {[
                  { id: 'overview' as const, label: 'Patient Overview', icon: Users },
                  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
                  { id: 'form' as const, label: 'AI Assessment', icon: Cpu }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center gap-2 flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeView === tab.id
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeView === 'overview' && renderOverview()}
                {activeView === 'patient' && renderPatientDetail()}
                {activeView === 'analytics' && (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600">Advanced ICU analytics and trends coming soon...</p>
                  </div>
                )}
                {activeView === 'form' && (
                  <ICUMonitoringForm />
                )}
              </div>
            </div>

            {/* Real-time Status */}
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${realTimeData ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>Real-time Monitoring: {realTimeData ? 'Active' : 'Paused'}</span>
              </div>
              <button
                onClick={() => setRealTimeData(!realTimeData)}
                className="text-blue-600 hover:text-blue-800"
              >
                {realTimeData ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      </AuthGuard>
    </MainLayout>
  );
}