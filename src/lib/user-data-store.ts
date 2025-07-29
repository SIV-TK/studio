'use server';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  healthProfile: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: string;
  createdAt: string;
  updatedAt: string;
}

interface LabResult {
  id: string;
  userId: string;
  testType: string;
  results: string;
  date: string;
  doctorId?: string;
  status: 'normal' | 'abnormal' | 'critical';
}

interface DoctorConsultation {
  id: string;
  userId: string;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  recommendations: string;
  prescriptions: string;
  followUp: string;
  date: string;
}

interface MedicationHistory {
  id: string;
  userId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
}

interface HealthMetrics {
  id: string;
  userId: string;
  heartRate: number;
  bloodPressure: string;
  weight: number;
  height: number;
  temperature: number;
  date: string;
}

// Mock database storage
const userProfiles = new Map<string, UserProfile>();
const labResults = new Map<string, LabResult[]>();
const consultations = new Map<string, DoctorConsultation[]>();
const medications = new Map<string, MedicationHistory[]>();
const healthMetrics = new Map<string, HealthMetrics[]>();

class UserDataStore {
  // User Profile Management
  static async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const userProfile: UserProfile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    userProfiles.set(id, userProfile);
    return id;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    return userProfiles.get(userId) || null;
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const existing = userProfiles.get(userId);
    if (existing) {
      userProfiles.set(userId, {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Lab Results Management
  static async addLabResult(labResult: Omit<LabResult, 'id'>): Promise<string> {
    const id = `lab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result: LabResult = { ...labResult, id };
    
    const userLabs = labResults.get(labResult.userId) || [];
    userLabs.push(result);
    labResults.set(labResult.userId, userLabs);
    
    return id;
  }

  static async getUserLabResults(userId: string): Promise<LabResult[]> {
    return labResults.get(userId) || [];
  }

  static async getLatestLabResults(userId: string, limit: number = 5): Promise<LabResult[]> {
    const userLabs = labResults.get(userId) || [];
    return userLabs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  }

  // Doctor Consultations Management
  static async addConsultation(consultation: Omit<DoctorConsultation, 'id'>): Promise<string> {
    const id = `consult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const consult: DoctorConsultation = { ...consultation, id };
    
    const userConsults = consultations.get(consultation.userId) || [];
    userConsults.push(consult);
    consultations.set(consultation.userId, userConsults);
    
    return id;
  }

  static async getUserConsultations(userId: string): Promise<DoctorConsultation[]> {
    return consultations.get(userId) || [];
  }

  static async getLatestConsultation(userId: string): Promise<DoctorConsultation | null> {
    const userConsults = consultations.get(userId) || [];
    return userConsults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
  }

  // Medication History Management
  static async addMedication(medication: Omit<MedicationHistory, 'id'>): Promise<string> {
    const id = `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const med: MedicationHistory = { ...medication, id };
    
    const userMeds = medications.get(medication.userId) || [];
    userMeds.push(med);
    medications.set(medication.userId, userMeds);
    
    return id;
  }

  static async getUserMedications(userId: string): Promise<MedicationHistory[]> {
    return medications.get(userId) || [];
  }

  static async getActiveMedications(userId: string): Promise<MedicationHistory[]> {
    const userMeds = medications.get(userId) || [];
    return userMeds.filter(med => med.status === 'active');
  }

  // Health Metrics Management
  static async addHealthMetrics(metrics: Omit<HealthMetrics, 'id'>): Promise<string> {
    const id = `metrics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metric: HealthMetrics = { ...metrics, id };
    
    const userMetrics = healthMetrics.get(metrics.userId) || [];
    userMetrics.push(metric);
    healthMetrics.set(metrics.userId, userMetrics);
    
    return id;
  }

  static async getUserHealthMetrics(userId: string): Promise<HealthMetrics[]> {
    return healthMetrics.get(userId) || [];
  }

  // Comprehensive User Data Retrieval
  static async getComprehensiveUserData(userId: string): Promise<{
    profile: UserProfile | null;
    labResults: LabResult[];
    consultations: DoctorConsultation[];
    medications: MedicationHistory[];
    healthMetrics: HealthMetrics[];
  }> {
    return {
      profile: await this.getUserProfile(userId),
      labResults: await this.getUserLabResults(userId),
      consultations: await this.getUserConsultations(userId),
      medications: await this.getUserMedications(userId),
      healthMetrics: await this.getUserHealthMetrics(userId),
    };
  }

  // AI Context Data Preparation
  static async prepareAIContext(userId: string): Promise<string> {
    const data = await this.getComprehensiveUserData(userId);
    
    if (!data.profile) return 'No user profile found';

    const latestLabs = data.labResults.slice(-3);
    const latestConsult = data.consultations.slice(-1)[0];
    const activeMeds = data.medications.filter(m => m.status === 'active');
    const recentMetrics = data.healthMetrics.slice(-5);

    return `
PATIENT PROFILE:
Name: ${data.profile.name}
Age: ${data.profile.age}, Gender: ${data.profile.gender}
Health Profile: ${data.profile.healthProfile}
Allergies: ${data.profile.allergies.join(', ')}
Conditions: ${data.profile.conditions.join(', ')}

RECENT LAB RESULTS:
${latestLabs.map(lab => `${lab.testType} (${lab.date}): ${lab.results} [${lab.status}]`).join('\n')}

LATEST DOCTOR CONSULTATION:
${latestConsult ? `Dr. ${latestConsult.doctorName} (${latestConsult.specialty}) - ${latestConsult.date}
Diagnosis: ${latestConsult.diagnosis}
Recommendations: ${latestConsult.recommendations}
Prescriptions: ${latestConsult.prescriptions}` : 'No recent consultations'}

ACTIVE MEDICATIONS:
${activeMeds.map(med => `${med.medication} ${med.dosage} ${med.frequency} (prescribed by ${med.prescribedBy})`).join('\n')}

RECENT HEALTH METRICS:
${recentMetrics.map(m => `${m.date}: HR ${m.heartRate}, BP ${m.bloodPressure}, Weight ${m.weight}kg`).join('\n')}
    `.trim();
  }
}

export { UserDataStore };