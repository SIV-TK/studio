export interface VitalMachine {
  id: string;
  name: string;
  type: 'blood_pressure' | 'temperature' | 'glucose' | 'heart_rate' | 'oxygen_saturation';
  status: 'connected' | 'disconnected' | 'error';
  lastReading: string;
  batteryLevel?: number;
  location: string;
}

export interface VitalReading {
  machineId: string;
  type: string;
  value: string | number;
  unit: string;
  timestamp: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

// Mock connected vital machines
const mockVitalMachines: VitalMachine[] = [
  {
    id: 'BP001',
    name: 'Omron BP Monitor',
    type: 'blood_pressure',
    status: 'connected',
    lastReading: '2 min ago',
    batteryLevel: 85,
    location: 'Station A'
  },
  {
    id: 'TEMP001',
    name: 'Digital Thermometer',
    type: 'temperature',
    status: 'connected',
    lastReading: '1 min ago',
    batteryLevel: 92,
    location: 'Station A'
  },
  {
    id: 'GLU001',
    name: 'Glucose Meter Pro',
    type: 'glucose',
    status: 'disconnected',
    lastReading: '15 min ago',
    batteryLevel: 23,
    location: 'Station B'
  },
  {
    id: 'HR001',
    name: 'Pulse Oximeter',
    type: 'heart_rate',
    status: 'connected',
    lastReading: '30 sec ago',
    batteryLevel: 78,
    location: 'Station A'
  },
  {
    id: 'OX001',
    name: 'SpO2 Monitor',
    type: 'oxygen_saturation',
    status: 'connected',
    lastReading: '45 sec ago',
    batteryLevel: 67,
    location: 'Station A'
  }
];

export const getConnectedMachines = (): VitalMachine[] => {
  return mockVitalMachines;
};

export const fetchVitalReading = async (machineId: string): Promise<VitalReading | null> => {
  const machine = mockVitalMachines.find(m => m.id === machineId);
  if (!machine || machine.status !== 'connected') return null;

  // Simulate fetching data from machine
  await new Promise(resolve => setTimeout(resolve, 1500));

  const readings: Record<string, VitalReading> = {
    'BP001': {
      machineId,
      type: 'blood_pressure',
      value: `${120 + Math.floor(Math.random() * 40)}/${80 + Math.floor(Math.random() * 20)}`,
      unit: 'mmHg',
      timestamp: new Date().toISOString(),
      quality: 'excellent'
    },
    'TEMP001': {
      machineId,
      type: 'temperature',
      value: 36.5 + Math.random() * 2,
      unit: '°C',
      timestamp: new Date().toISOString(),
      quality: 'good'
    },
    'GLU001': {
      machineId,
      type: 'glucose',
      value: 90 + Math.floor(Math.random() * 50),
      unit: 'mg/dL',
      timestamp: new Date().toISOString(),
      quality: 'fair'
    },
    'HR001': {
      machineId,
      type: 'heart_rate',
      value: 70 + Math.floor(Math.random() * 30),
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      quality: 'excellent'
    },
    'OX001': {
      machineId,
      type: 'oxygen_saturation',
      value: 95 + Math.floor(Math.random() * 5),
      unit: '%',
      timestamp: new Date().toISOString(),
      quality: 'good'
    }
  };

  return readings[machineId] || null;
};