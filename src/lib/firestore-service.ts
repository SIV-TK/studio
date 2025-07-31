// Firestore service for user data management
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  name: string;
  userType: 'doctor' | 'patient' | 'general';
  hospitalName?: string;
  medicalLicense?: string;
  specialization?: string;
  age: number;
  gender: string;
  healthProfile: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Medication {
  id?: string;
  userId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt?: any;
}

export interface HealthRecord {
  id?: string;
  userId: string;
  type: 'appointment' | 'lab_result' | 'symptom' | 'vital_signs';
  data: any;
  date: string;
  notes?: string;
  createdAt?: any;
}

export class FirestoreService {
  // User Profile Methods
  static async createUserProfile(userId: string, profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    
    // First check if the document exists
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Document exists, update it
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } else {
      // Document doesn't exist, create it with default values
      await setDoc(userRef, {
        name: updates.name || '',
        age: updates.age || 0,
        gender: updates.gender || '',
        healthProfile: updates.healthProfile || '',
        allergies: updates.allergies || [],
        conditions: updates.conditions || [],
        emergencyContact: updates.emergencyContact || '',
        ...updates,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  }

  // Medication Methods
  static async addMedication(medication: Omit<Medication, 'id' | 'createdAt'>): Promise<string> {
    const medicationRef = await addDoc(collection(db, 'medications'), {
      ...medication,
      createdAt: serverTimestamp()
    });
    return medicationRef.id;
  }

  static async getUserMedications(userId: string): Promise<Medication[]> {
    const q = query(collection(db, 'medications'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const medications: Medication[] = [];
    querySnapshot.forEach((doc) => {
      medications.push({ id: doc.id, ...doc.data() } as Medication);
    });
    
    return medications;
  }

  static async updateMedication(medicationId: string, updates: Partial<Medication>): Promise<void> {
    const medicationRef = doc(db, 'medications', medicationId);
    await updateDoc(medicationRef, updates);
  }

  static async deleteMedication(medicationId: string): Promise<void> {
    const medicationRef = doc(db, 'medications', medicationId);
    await deleteDoc(medicationRef);
  }

  // Health Records Methods
  static async addHealthRecord(record: Omit<HealthRecord, 'id' | 'createdAt'>): Promise<string> {
    const recordRef = await addDoc(collection(db, 'healthRecords'), {
      ...record,
      createdAt: serverTimestamp()
    });
    return recordRef.id;
  }

  static async getUserHealthRecords(userId: string): Promise<HealthRecord[]> {
    const q = query(collection(db, 'healthRecords'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const records: HealthRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as HealthRecord);
    });
    
    return records;
  }

  // Comprehensive user data (profile + medications + health records)
  static async getComprehensiveUserData(userId: string) {
    const [profile, medications, healthRecords] = await Promise.all([
      this.getUserProfile(userId),
      this.getUserMedications(userId),
      this.getUserHealthRecords(userId)
    ]);

    return {
      profile,
      medications,
      healthRecords
    };
  }
}
