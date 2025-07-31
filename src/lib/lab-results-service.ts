import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface LabTest {
  id?: string;
  testName: string;
  testCode: string;
  category: 'blood' | 'urine' | 'biochemistry' | 'microbiology' | 'pathology' | 'radiology' | 'genetics';
  normalRange: {
    min?: number;
    max?: number;
    unit: string;
    description: string;
  };
  description: string;
  preparationInstructions: string[];
  sampleType: string;
  processingTime: string;
  cost: number;
}

export interface LabOrder {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  orderedTests: LabTest[];
  clinicalHistory: string;
  urgency: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'sample_collected' | 'processing' | 'completed' | 'reported';
  orderDate: string;
  collectionDate?: string;
  completionDate?: string;
  specialInstructions?: string;
  aiRecommendations?: AILabRecommendations;
}

export interface LabResult {
  id?: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  testCode: string;
  value: number | string;
  unit: string;
  normalRange: {
    min?: number;
    max?: number;
    unit: string;
  };
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  flag: 'high' | 'low' | 'normal' | 'critical';
  resultDate: string;
  technicianId: string;
  technicianName: string;
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  aiAnalysis?: AILabAnalysis;
}

export interface AILabRecommendations {
  recommendedTests: string[];
  priorityLevel: 'high' | 'medium' | 'low';
  clinicalCorrelation: string;
  additionalConsiderations: string[];
  followUpRecommendations: string[];
  confidence: number;
}

export interface AILabAnalysis {
  interpretation: string;
  clinicalSignificance: string;
  possibleCauses: string[];
  recommendations: string[];
  followUpTests: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  patientEducation: string[];
  lifestyleRecommendations: string[];
  accuracy: number;
  confidence: number;
  correlatedFindings: string[];
}

export interface PatientLabPortal {
  patientId: string;
  labResults: PatientLabResult[];
  labHistory: LabResultHistory[];
  aiInsights: AIPatientInsights;
  upcomingTests: UpcomingLabTest[];
}

export interface PatientLabResult {
  id: string;
  testName: string;
  value: string;
  status: 'normal' | 'abnormal' | 'critical';
  resultDate: string;
  aiExplanation: string;
  patientFriendlyInterpretation: string;
  actionRequired: boolean;
  recommendations: string[];
}

export interface LabResultHistory {
  testName: string;
  results: {
    date: string;
    value: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
  trend: 'improving' | 'stable' | 'concerning' | 'critical';
}

export interface AIPatientInsights {
  overallHealthStatus: string;
  keyFindings: string[];
  riskFactors: string[];
  recommendations: string[];
  followUpNeeded: boolean;
  urgentAttentionRequired: boolean;
}

export interface UpcomingLabTest {
  testName: string;
  scheduledDate: string;
  preparationInstructions: string[];
  reason: string;
}

export interface HospitalLabQueue {
  pendingSamples: LabOrder[];
  processingSamples: LabOrder[];
  completedSamples: LabOrder[];
  criticalResults: LabResult[];
  dailyStats: {
    totalOrders: number;
    completed: number;
    pending: number;
    criticalResults: number;
  };
}

class LabResultsService {
  // Default lab tests available in the system
  private defaultLabTests: LabTest[] = [
    // Blood Tests
    {
      testName: 'Complete Blood Count (CBC)',
      testCode: 'CBC',
      category: 'blood',
      normalRange: { unit: 'cells/μL', description: 'White Blood Cell Count: 4,000-11,000' },
      description: 'Measures different components of blood including red blood cells, white blood cells, and platelets',
      preparationInstructions: ['No special preparation required'],
      sampleType: 'Whole blood',
      processingTime: '2-4 hours',
      cost: 25.00
    },
    {
      testName: 'Basic Metabolic Panel (BMP)',
      testCode: 'BMP',
      category: 'biochemistry',
      normalRange: { unit: 'mg/dL', description: 'Glucose: 70-100 mg/dL (fasting)' },
      description: 'Tests kidney function, blood sugar level, and electrolyte balance',
      preparationInstructions: ['Fast for 8-12 hours before test'],
      sampleType: 'Serum',
      processingTime: '1-2 hours',
      cost: 35.00
    },
    {
      testName: 'Lipid Panel',
      testCode: 'LIPID',
      category: 'biochemistry',
      normalRange: { unit: 'mg/dL', description: 'Total Cholesterol: <200 mg/dL' },
      description: 'Measures cholesterol and triglyceride levels',
      preparationInstructions: ['Fast for 9-12 hours before test', 'No alcohol 24 hours before test'],
      sampleType: 'Serum',
      processingTime: '2-3 hours',
      cost: 40.00
    },
    {
      testName: 'Thyroid Function Panel',
      testCode: 'TFT',
      category: 'biochemistry',
      normalRange: { unit: 'mIU/L', description: 'TSH: 0.4-4.0 mIU/L' },
      description: 'Evaluates thyroid gland function',
      preparationInstructions: ['No special preparation required'],
      sampleType: 'Serum',
      processingTime: '3-4 hours',
      cost: 55.00
    },
    {
      testName: 'Hemoglobin A1C',
      testCode: 'HBA1C',
      category: 'biochemistry',
      normalRange: { unit: '%', description: 'Normal: <5.7%, Prediabetic: 5.7-6.4%, Diabetic: ≥6.5%' },
      description: 'Measures average blood sugar levels over 2-3 months',
      preparationInstructions: ['No fasting required'],
      sampleType: 'Whole blood',
      processingTime: '1-2 hours',
      cost: 30.00
    },
    {
      testName: 'Liver Function Tests (LFT)',
      testCode: 'LFT',
      category: 'biochemistry',
      normalRange: { unit: 'U/L', description: 'ALT: 7-56 U/L, AST: 10-40 U/L' },
      description: 'Evaluates liver health and function',
      preparationInstructions: ['No alcohol 24 hours before test'],
      sampleType: 'Serum',
      processingTime: '2-3 hours',
      cost: 45.00
    },
    {
      testName: 'Urinalysis',
      testCode: 'UA',
      category: 'urine',
      normalRange: { unit: 'various', description: 'Protein: negative, Glucose: negative' },
      description: 'Analyzes urine for signs of kidney disease, diabetes, and infections',
      preparationInstructions: ['Clean catch midstream urine', 'First morning urine preferred'],
      sampleType: 'Urine',
      processingTime: '1 hour',
      cost: 20.00
    },
    {
      testName: 'C-Reactive Protein (CRP)',
      testCode: 'CRP',
      category: 'biochemistry',
      normalRange: { unit: 'mg/L', description: 'Normal: <3.0 mg/L' },
      description: 'Measures inflammation in the body',
      preparationInstructions: ['No special preparation required'],
      sampleType: 'Serum',
      processingTime: '2 hours',
      cost: 25.00
    },
    {
      testName: 'Vitamin D (25-OH)',
      testCode: 'VITD',
      category: 'biochemistry',
      normalRange: { unit: 'ng/mL', description: 'Sufficient: 30-100 ng/mL' },
      description: 'Measures vitamin D levels in blood',
      preparationInstructions: ['No special preparation required'],
      sampleType: 'Serum',
      processingTime: '3-4 hours',
      cost: 50.00
    },
    {
      testName: 'Prostate Specific Antigen (PSA)',
      testCode: 'PSA',
      category: 'biochemistry',
      normalRange: { unit: 'ng/mL', description: 'Normal: <4.0 ng/mL (age dependent)' },
      description: 'Screening test for prostate health',
      preparationInstructions: ['No ejaculation 48 hours before test', 'No vigorous exercise 48 hours before'],
      sampleType: 'Serum',
      processingTime: '2-3 hours',
      cost: 40.00
    }
  ];

  // Submit lab order from doctor
  async submitLabOrder(order: Omit<LabOrder, 'id' | 'orderDate' | 'status'>): Promise<string> {
    try {
      const orderData = {
        ...order,
        orderDate: new Date().toISOString(),
        status: 'ordered' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'labOrders'), orderData);
      
      // Generate AI recommendations for the lab order
      await this.generateAILabRecommendations(docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting lab order:', error);
      throw error;
    }
  }

  // Generate AI recommendations for lab tests
  private async generateAILabRecommendations(orderId: string): Promise<void> {
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiRecommendations: AILabRecommendations = {
        recommendedTests: [
          'Consider CBC with differential for comprehensive blood analysis',
          'BMP recommended to assess kidney function',
          'Inflammatory markers (CRP, ESR) may provide additional insights'
        ],
        priorityLevel: 'medium',
        clinicalCorrelation: 'Results should be interpreted in context of patient symptoms and clinical presentation',
        additionalConsiderations: [
          'Patient medication history may affect certain test results',
          'Consider fasting status for glucose and lipid measurements',
          'Age and gender-specific reference ranges apply'
        ],
        followUpRecommendations: [
          'Repeat abnormal results in 1-2 weeks if clinically indicated',
          'Consider trending results over time for chronic conditions'
        ],
        confidence: 87
      };

      await updateDoc(doc(db, 'labOrders', orderId), {
        aiRecommendations,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    }
  }

  // Process lab results and generate AI analysis
  async processLabResult(result: Omit<LabResult, 'id' | 'resultDate' | 'aiAnalysis'>): Promise<string> {
    try {
      const resultData = {
        ...result,
        resultDate: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'labResults'), resultData);
      
      // Generate AI analysis for the result
      await this.generateAILabAnalysis(docRef.id, result);
      
      // Update lab order status
      await this.updateLabOrderStatus(result.orderId, 'completed');
      
      return docRef.id;
    } catch (error) {
      console.error('Error processing lab result:', error);
      throw error;
    }
  }

  // Generate comprehensive AI analysis for lab results
  private async generateAILabAnalysis(resultId: string, result: Omit<LabResult, 'id' | 'resultDate' | 'aiAnalysis'>): Promise<void> {
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      let analysis: AILabAnalysis;

      // Generate different analysis based on test type and results
      if (result.testCode === 'CBC') {
        analysis = {
          interpretation: `White blood cell count is ${result.flag === 'normal' ? 'within normal limits' : result.flag}`,
          clinicalSignificance: result.flag === 'normal' ? 
            'Normal CBC suggests healthy blood cell production and immune function' :
            'Abnormal CBC may indicate infection, anemia, or blood disorders',
          possibleCauses: result.flag === 'high' ? 
            ['Bacterial infection', 'Stress response', 'Medication effects'] :
            result.flag === 'low' ? 
            ['Viral infection', 'Bone marrow disorders', 'Autoimmune conditions'] :
            ['Normal physiological variation'],
          recommendations: [
            'Correlate with clinical symptoms and physical examination',
            'Consider repeat testing if clinically indicated',
            'Monitor trends over time'
          ],
          followUpTests: result.flag !== 'normal' ? 
            ['Blood smear examination', 'Inflammatory markers', 'Comprehensive metabolic panel'] : [],
          riskLevel: result.flag === 'critical' ? 'critical' : (result.flag === 'high' || result.flag === 'low') ? 'moderate' : 'low',
          patientEducation: [
            'CBC measures the number and types of cells in your blood',
            'Results help assess overall health and detect various disorders',
            'Normal results suggest healthy blood cell production'
          ],
          lifestyleRecommendations: [
            'Maintain a balanced diet rich in iron and vitamins',
            'Stay hydrated and get adequate rest',
            'Follow up with healthcare provider as recommended'
          ],
          accuracy: 96,
          confidence: 92,
          correlatedFindings: ['No significant correlations identified in current dataset']
        };
      } else if (result.testCode === 'BMP') {
        analysis = {
          interpretation: `Glucose level is ${result.value} ${result.unit}, which is ${result.flag}`,
          clinicalSignificance: result.flag === 'normal' ? 
            'Normal glucose levels indicate good metabolic control' :
            'Abnormal glucose levels may suggest diabetes or metabolic disorders',
          possibleCauses: result.flag === 'high' ? 
            ['Type 2 diabetes', 'Prediabetes', 'Stress hyperglycemia', 'Medication effects'] :
            result.flag === 'low' ? 
            ['Excessive insulin', 'Prolonged fasting', 'Liver disease'] :
            ['Normal metabolic function'],
          recommendations: [
            'Consider HbA1c for long-term glucose assessment',
            'Evaluate kidney function markers',
            'Assess electrolyte balance'
          ],
          followUpTests: result.flag !== 'normal' ? 
            ['HbA1c', 'Insulin levels', 'C-peptide'] : [],
          riskLevel: result.flag === 'critical' ? 'critical' : (result.flag === 'high' || result.flag === 'low') ? 'moderate' : 'low',
          patientEducation: [
            'Glucose is your blood sugar level',
            'Normal levels indicate good metabolic health',
            'Diet and exercise significantly impact glucose levels'
          ],
          lifestyleRecommendations: [
            'Follow a balanced, low-sugar diet',
            'Exercise regularly as recommended by your doctor',
            'Monitor blood sugar if diabetic'
          ],
          accuracy: 94,
          confidence: 89,
          correlatedFindings: ['Correlate with BMI and family history of diabetes']
        };
      } else {
        // Generic analysis for other tests
        analysis = {
          interpretation: `${result.testName} result is ${result.flag}`,
          clinicalSignificance: 'Results should be interpreted by healthcare provider in clinical context',
          possibleCauses: ['Various factors may influence test results'],
          recommendations: ['Discuss results with healthcare provider'],
          followUpTests: [],
          riskLevel: result.flag === 'critical' ? 'critical' : (result.flag === 'high' || result.flag === 'low') ? 'moderate' : 'low',
          patientEducation: ['Test results provide important health information'],
          lifestyleRecommendations: ['Follow healthcare provider recommendations'],
          accuracy: 90,
          confidence: 85,
          correlatedFindings: ['Additional context needed for complete analysis']
        };
      }

      await updateDoc(doc(db, 'labResults', resultId), {
        aiAnalysis: analysis,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error generating AI analysis:', error);
    }
  }

  // Update lab order status
  async updateLabOrderStatus(orderId: string, status: LabOrder['status']): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'sample_collected') {
        updateData.collectionDate = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completionDate = new Date().toISOString();
      }

      await updateDoc(doc(db, 'labOrders', orderId), updateData);
    } catch (error) {
      console.error('Error updating lab order status:', error);
      throw error;
    }
  }

  // Get patient lab portal data
  async getPatientLabPortal(patientId: string): Promise<PatientLabPortal | null> {
    try {
      // Get patient's lab results
      const resultsQuery = query(
        collection(db, 'labResults'),
        where('patientId', '==', patientId),
        orderBy('resultDate', 'desc')
      );
      
      const resultsSnapshot = await getDocs(resultsQuery);
      const labResults: PatientLabResult[] = resultsSnapshot.docs.map(doc => {
        const data = doc.data() as LabResult;
        return {
          id: doc.id,
          testName: data.testName,
          value: `${data.value} ${data.unit}`,
          status: data.status === 'pending' ? 'normal' : data.status as 'normal' | 'abnormal' | 'critical',
          resultDate: data.resultDate,
          aiExplanation: data.aiAnalysis?.interpretation || 'Analysis pending',
          patientFriendlyInterpretation: data.aiAnalysis?.patientEducation?.[0] || 'Results available - consult your doctor',
          actionRequired: data.status === 'critical' || data.status === 'abnormal',
          recommendations: data.aiAnalysis?.lifestyleRecommendations || []
        };
      });

      // Generate AI insights
      const aiInsights = this.generatePatientAIInsights(labResults);

      return {
        patientId,
        labResults,
        labHistory: [], // TODO: Implement history tracking
        aiInsights,
        upcomingTests: [] // TODO: Implement upcoming tests
      };
    } catch (error) {
      console.error('Error fetching patient lab portal:', error);
      return null;
    }
  }

  // Generate AI insights for patient
  private generatePatientAIInsights(results: PatientLabResult[]): AIPatientInsights {
    const abnormalResults = results.filter(r => r.status === 'abnormal' || r.status === 'critical');
    const criticalResults = results.filter(r => r.status === 'critical');

    return {
      overallHealthStatus: criticalResults.length > 0 ? 'Requires immediate attention' :
                          abnormalResults.length > 0 ? 'Some concerns identified' : 
                          'Generally healthy',
      keyFindings: abnormalResults.map(r => `${r.testName}: ${r.status}`),
      riskFactors: abnormalResults.length > 0 ? 
        ['Abnormal lab values detected', 'Follow-up recommended'] : [],
      recommendations: [
        'Continue regular health monitoring',
        'Follow healthcare provider recommendations',
        'Maintain healthy lifestyle habits'
      ],
      followUpNeeded: abnormalResults.length > 0,
      urgentAttentionRequired: criticalResults.length > 0
    };
  }

  // Get hospital lab queue
  async getHospitalLabQueue(): Promise<HospitalLabQueue> {
    try {
      const ordersQuery = query(collection(db, 'labOrders'), orderBy('orderDate', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LabOrder));

      const resultsQuery = query(
        collection(db, 'labResults'),
        where('status', '==', 'critical'),
        orderBy('resultDate', 'desc')
      );
      const resultsSnapshot = await getDocs(resultsQuery);
      const criticalResults = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LabResult));

      return {
        pendingSamples: allOrders.filter(o => o.status === 'ordered' || o.status === 'sample_collected'),
        processingSamples: allOrders.filter(o => o.status === 'processing'),
        completedSamples: allOrders.filter(o => o.status === 'completed'),
        criticalResults,
        dailyStats: {
          totalOrders: allOrders.length,
          completed: allOrders.filter(o => o.status === 'completed').length,
          pending: allOrders.filter(o => o.status !== 'completed').length,
          criticalResults: criticalResults.length
        }
      };
    } catch (error) {
      console.error('Error fetching hospital lab queue:', error);
      throw error;
    }
  }

  // Get all available lab tests
  getAvailableLabTests(): LabTest[] {
    return this.defaultLabTests;
  }

  // Search lab tests
  searchLabTests(searchTerm: string): LabTest[] {
    const term = searchTerm.toLowerCase();
    return this.defaultLabTests.filter(test => 
      test.testName.toLowerCase().includes(term) ||
      test.testCode.toLowerCase().includes(term) ||
      test.description.toLowerCase().includes(term) ||
      test.category.toLowerCase().includes(term)
    );
  }

  // Get lab tests by category
  getLabTestsByCategory(category: LabTest['category']): LabTest[] {
    return this.defaultLabTests.filter(test => test.category === category);
  }
}

export const labResultsService = new LabResultsService();
