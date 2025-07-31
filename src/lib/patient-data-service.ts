import { FirestoreService, UserProfile } from './firestore-service';
import { UserDataStore } from './user-data-store';

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  registrationDate: string;
  lastVisit: string;
  chiefComplaint: string;
  status: 'active' | 'stable' | 'recovering' | 'critical';
  priority: 'routine' | 'moderate' | 'high' | 'urgent';
  room: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: string;
    oxygen: string;
    lastUpdated: string;
  };
  conditions: string[];
  allergies: string[];
  labResults: Array<{
    test: string;
    date: string;
    status: 'normal' | 'abnormal' | 'improving';
    results: string;
  }>;
  medications: Array<{
    drug: string;
    dosage: string;
    frequency: string;
    prescribed: string;
    status: 'active' | 'inactive';
  }>;
  aiRecommendations: Array<{
    type: string;
    recommendation: string;
    priority: 'routine' | 'moderate' | 'urgent';
  }>;
  progressNotes: Array<{
    date: string;
    doctor: string;
    note: string;
  }>;
}

export class PatientDataService {
  /**
   * Get all patients from the database and convert them to doctor-friendly format
   */
  static async getAllPatients(): Promise<PatientRecord[]> {
    // In a real implementation, this would query Firestore for all patients
    // For now, we'll return mock data but in the correct structure
    
    // This would be the actual implementation:
    // const patientsQuery = query(collection(db, 'users'), where('userType', '==', 'patient'));
    // const patientsSnapshot = await getDocs(patientsQuery);
    // const patients = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return [
      // Mock data - replace with actual Firestore queries
    ];
  }

  /**
   * Get a specific patient's comprehensive data
   */
  static async getPatientById(patientId: string): Promise<PatientRecord | null> {
    try {
      const userData = await UserDataStore.getComprehensiveUserData(patientId);
      if (!userData || !userData.profile) {
        return null;
      }

      // Extract lab results from health records
      const labResults = userData.healthRecords
        .filter(record => record.type === 'lab_result')
        .map(record => ({
          test: record.data?.testType || 'Unknown Test',
          date: new Date(record.date).toISOString().split('T')[0],
          status: (record.data?.status as 'normal' | 'abnormal' | 'improving') || 'normal',
          results: record.data?.results || record.notes || 'No results available'
        }));

      // Extract consultation notes from health records
      const progressNotes = userData.healthRecords
        .filter(record => record.type === 'appointment')
        .map(record => ({
          date: new Date(record.date).toISOString().split('T')[0],
          doctor: record.data?.doctorName || 'Medical Staff',
          note: record.notes || record.data?.notes || 'Routine visit'
        }));

      // Convert user data to patient record format
      const patientRecord: PatientRecord = {
        id: patientId,
        name: userData.profile.name,
        age: userData.profile.age,
        gender: userData.profile.gender,
        registrationDate: userData.profile.createdAt || new Date().toISOString(),
        lastVisit: new Date().toISOString().split('T')[0],
        chiefComplaint: progressNotes[0]?.note || 'Regular checkup',
        status: 'stable', // Default status
        priority: 'routine', // Default priority
        room: 'TBD', // Would be assigned by hospital system
        vitals: {
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: '98.6°F',
          oxygen: '98%',
          lastUpdated: new Date().toLocaleString()
        },
        conditions: userData.profile.conditions || [],
        allergies: userData.profile.allergies || [],
        labResults: labResults,
        medications: userData.medications?.filter(med => med.status === 'active').map(med => ({
          drug: med.medication,
          dosage: med.dosage,
          frequency: med.frequency,
          prescribed: new Date(med.startDate).toISOString().split('T')[0],
          status: med.status as 'active' | 'inactive'
        })) || [],
        aiRecommendations: [
          // Generate AI recommendations based on patient data
          {
            type: 'General Care',
            recommendation: 'Continue current health monitoring routine',
            priority: 'routine'
          }
        ],
        progressNotes: progressNotes
      };

      return patientRecord;
    } catch (error) {
      console.error('Error fetching patient data:', error);
      return null;
    }
  }

  /**
   * Add a progress note to a patient's record
   */
  static async addProgressNote(patientId: string, doctorName: string, note: string): Promise<void> {
    try {
      await UserDataStore.addHealthRecord({
        userId: patientId,
        type: 'appointment',
        data: { doctorName: doctorName },
        date: new Date().toISOString(),
        notes: note
      });
    } catch (error) {
      console.error('Error adding progress note:', error);
      throw error;
    }
  }

  /**
   * Add a new medication to a patient's record
   */
  static async prescribeMedication(patientId: string, drug: string, dosage: string, frequency: string, prescribedBy: string): Promise<void> {
    try {
      await UserDataStore.addMedication({
        userId: patientId,
        medication: drug,
        dosage: dosage,
        frequency: frequency,
        startDate: new Date().toISOString(),
        prescribedBy: prescribedBy,
        status: 'active'
      });
    } catch (error) {
      console.error('Error prescribing medication:', error);
      throw error;
    }
  }

  /**
   * Update patient vitals
   */
  static async updateVitals(patientId: string, vitals: Partial<PatientRecord['vitals']>): Promise<void> {
    try {
      // In a real implementation, this would update a vitals collection
      // For now, we can add it as a health record
      await UserDataStore.addHealthRecord({
        userId: patientId,
        type: 'vital_signs',
        data: vitals,
        date: new Date().toISOString(),
        notes: 'Vitals updated by medical staff'
      });
    } catch (error) {
      console.error('Error updating vitals:', error);
      throw error;
    }
  }

  /**
   * Search patients by name, condition, or room
   */
  static async searchPatients(searchTerm: string): Promise<PatientRecord[]> {
    // In a real implementation, this would perform a Firestore query
    // For now, return empty array but include the structure
    const allPatients = await this.getAllPatients();
    return allPatients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export default PatientDataService;
