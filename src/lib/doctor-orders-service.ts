'use server';

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  orderDate: string;
  tests: Array<{
    testName: string;
    indication: string;
    urgency: 'stat' | 'urgent' | 'routine';
  }>;
  status: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled';
  expectedCompletionTime?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  prescriptionDate: string;
  medications: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    quantity: number;
    refills: number;
  }>;
  status: 'prescribed' | 'sent_to_pharmacy' | 'dispensed' | 'completed';
  pharmacyId?: string;
  notes?: string;
}

// Mock storage for lab orders and prescriptions
let labOrders: LabOrder[] = [];
let prescriptions: Prescription[] = [];

export const submitLabOrder = async (order: Omit<LabOrder, 'id' | 'orderDate' | 'status'>): Promise<LabOrder> => {
  const newOrder: LabOrder = {
    ...order,
    id: `lab_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderDate: new Date().toISOString(),
    status: 'ordered',
    expectedCompletionTime: calculateExpectedCompletionTime(order.tests)
  };

  labOrders.push(newOrder);
  
  // Simulate sending notification to lab department
  console.log(`Lab order ${newOrder.id} sent to laboratory department for patient ${newOrder.patientName}`);
  
  return newOrder;
};

export const submitPrescription = async (prescription: Omit<Prescription, 'id' | 'prescriptionDate' | 'status'>): Promise<Prescription> => {
  const newPrescription: Prescription = {
    ...prescription,
    id: `rx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    prescriptionDate: new Date().toISOString(),
    status: 'prescribed'
  };

  prescriptions.push(newPrescription);
  
  // Simulate processing prescription
  setTimeout(() => {
    // Update status to sent to pharmacy
    const index = prescriptions.findIndex(p => p.id === newPrescription.id);
    if (index !== -1) {
      prescriptions[index].status = 'sent_to_pharmacy';
      console.log(`Prescription ${newPrescription.id} sent to pharmacy for patient ${newPrescription.patientName}`);
    }
  }, 2000);
  
  return newPrescription;
};

export const getLabOrdersByPatient = async (patientId: string): Promise<LabOrder[]> => {
  return labOrders.filter(order => order.patientId === patientId);
};

export const getPrescriptionsByPatient = async (patientId: string): Promise<Prescription[]> => {
  return prescriptions.filter(prescription => prescription.patientId === patientId);
};

export const getAllLabOrders = async (): Promise<LabOrder[]> => {
  return labOrders;
};

export const getAllPrescriptions = async (): Promise<Prescription[]> => {
  return prescriptions;
};

export const updateLabOrderStatus = async (orderId: string, status: LabOrder['status'], notes?: string): Promise<LabOrder | null> => {
  const index = labOrders.findIndex(order => order.id === orderId);
  if (index !== -1) {
    labOrders[index].status = status;
    if (notes) {
      labOrders[index].notes = notes;
    }
    return labOrders[index];
  }
  return null;
};

export const updatePrescriptionStatus = async (prescriptionId: string, status: Prescription['status'], pharmacyId?: string): Promise<Prescription | null> => {
  const index = prescriptions.findIndex(prescription => prescription.id === prescriptionId);
  if (index !== -1) {
    prescriptions[index].status = status;
    if (pharmacyId) {
      prescriptions[index].pharmacyId = pharmacyId;
    }
    return prescriptions[index];
  }
  return null;
};

const calculateExpectedCompletionTime = (tests: Array<{ testName: string; urgency: string }>): string => {
  // Calculate completion time based on test urgency
  const maxUrgency = tests.reduce((max, test) => {
    if (test.urgency === 'stat') return 'stat';
    if (test.urgency === 'urgent' && max !== 'stat') return 'urgent';
    return max;
  }, 'routine');

  const now = new Date();
  let completionTime: Date;

  switch (maxUrgency) {
    case 'stat':
      completionTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
      break;
    case 'urgent':
      completionTime = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours
      break;
    default:
      completionTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      break;
  }

  return completionTime.toISOString();
};

// Mock data for initial lab orders
const mockLabOrders: LabOrder[] = [
  {
    id: 'lab_001',
    patientId: 'p001',
    patientName: 'Sarah Johnson',
    doctorId: 'dr_001',
    doctorName: 'Dr. Smith',
    orderDate: '2025-07-31T10:00:00Z',
    tests: [
      { testName: 'Complete Blood Count (CBC)', indication: 'Routine checkup', urgency: 'routine' },
      { testName: 'Basic Metabolic Panel', indication: 'Monitor electrolytes', urgency: 'routine' }
    ],
    status: 'processing',
    expectedCompletionTime: '2025-08-01T10:00:00Z'
  },
  {
    id: 'lab_002',
    patientId: 'p002',
    patientName: 'Michael Chen',
    doctorId: 'dr_002',
    doctorName: 'Dr. Johnson',
    orderDate: '2025-07-31T14:30:00Z',
    tests: [
      { testName: 'HbA1c', indication: 'Diabetes monitoring', urgency: 'routine' },
      { testName: 'Lipid Panel', indication: 'Monitor cholesterol', urgency: 'routine' }
    ],
    status: 'completed',
    expectedCompletionTime: '2025-08-01T14:30:00Z'
  }
];

const mockPrescriptions: Prescription[] = [
  {
    id: 'rx_001',
    patientId: 'p001',
    patientName: 'Sarah Johnson',
    doctorId: 'dr_001',
    doctorName: 'Dr. Smith',
    prescriptionDate: '2025-07-31T10:30:00Z',
    medications: [
      {
        medication: 'Acetaminophen 650mg',
        dosage: '650mg',
        frequency: 'Every 6 hours as needed',
        duration: '7 days',
        instructions: 'Take with food if stomach upset occurs',
        quantity: 28,
        refills: 0
      }
    ],
    status: 'dispensed',
    pharmacyId: 'pharmacy_001'
  }
];

// Initialize with mock data
labOrders.push(...mockLabOrders);
prescriptions.push(...mockPrescriptions);

export const getLabOrderStats = async () => {
  const total = labOrders.length;
  const pending = labOrders.filter(order => order.status === 'ordered' || order.status === 'collected').length;
  const processing = labOrders.filter(order => order.status === 'processing').length;
  const completed = labOrders.filter(order => order.status === 'completed').length;

  return {
    total,
    pending,
    processing,
    completed
  };
};

export const getPrescriptionStats = async () => {
  const total = prescriptions.length;
  const prescribed = prescriptions.filter(rx => rx.status === 'prescribed').length;
  const sentToPharmacy = prescriptions.filter(rx => rx.status === 'sent_to_pharmacy').length;
  const dispensed = prescriptions.filter(rx => rx.status === 'dispensed').length;

  return {
    total,
    prescribed,
    sentToPharmacy,
    dispensed
  };
};
