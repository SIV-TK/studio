import { UserDataStore } from '@/lib/user-data-store';

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserSession {
  userId: string;
  email: string;
  name: string;
  profileExists: boolean;
}

// Mock user database with health profiles
const mockUsers = new Map([
  ['john@example.com', {
    id: 'user_001',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    age: 35,
    gender: 'male',
    healthProfile: 'diabetes',
    allergies: ['penicillin', 'peanuts'],
    conditions: ['diabetes', 'hypertension'],
    emergencyContact: 'Jane Doe - 555-0123',
  }],
  ['mary@example.com', {
    id: 'user_002',
    email: 'mary@example.com',
    password: 'password123',
    name: 'Mary Smith',
    age: 28,
    gender: 'female',
    healthProfile: 'pregnant',
    allergies: ['shellfish'],
    conditions: ['pregnancy'],
    emergencyContact: 'Tom Smith - 555-0456',
  }],
  ['bob@example.com', {
    id: 'user_003',
    email: 'bob@example.com',
    password: 'password123',
    name: 'Bob Johnson',
    age: 67,
    gender: 'male',
    healthProfile: 'elderly',
    allergies: [],
    conditions: ['heart_disease', 'arthritis'],
    emergencyContact: 'Alice Johnson - 555-0789',
  }],
]);

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<UserSession | null> {
    const user = mockUsers.get(credentials.email);
    
    if (!user || user.password !== credentials.password) {
      return null;
    }

    // Create minimal profile for new users - they'll complete it via popup
    try {
      const profileId = await UserDataStore.createUserProfile({
        name: user.name,
        age: 0, // Will be updated via popup
        gender: '', // Will be updated via popup
        healthProfile: '', // Will be updated via popup
        allergies: [],
        conditions: [],
        emergencyContact: '', // Will be updated via popup
      }, user.id);
    } catch (error) {
      console.error('Profile creation error:', error);
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      profileExists: true,
    };
  }

  static async getCurrentUser(): Promise<UserSession | null> {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('currentUserId') : null;
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
    
    if (!userId || !userEmail) return null;

    let profile = null;
    try {
      profile = await UserDataStore.getUserProfile(userId);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
    
    return profile ? {
      userId,
      email: userEmail,
      name: profile.name,
      profileExists: true,
    } : null;
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('userEmail');
    }
  }

  private static async addSampleHealthData(userId: string): Promise<void> {
    // Add sample lab results
    await UserDataStore.addLabResult({
      userId,
      testType: 'Complete Blood Count',
      results: 'WBC: 7.2, RBC: 4.5, Hemoglobin: 14.2 g/dL',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'normal',
    });

    // Add sample consultation
    await UserDataStore.addConsultation({
      userId,
      doctorName: 'Dr. Sarah Wilson',
      specialty: 'Internal Medicine',
      diagnosis: 'Routine checkup - Good health',
      recommendations: 'Continue current lifestyle, regular exercise',
      prescriptions: 'Multivitamin daily',
      followUp: '6 months',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Add sample medication
    await UserDataStore.addMedication({
      userId,
      medication: 'Multivitamin',
      dosage: '1 tablet',
      frequency: 'Daily',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      prescribedBy: 'Dr. Sarah Wilson',
      status: 'active',
    });

    // Add sample health metrics
    await UserDataStore.addHealthMetrics({
      userId,
      heartRate: 72,
      bloodPressure: '120/80',
      weight: 70,
      height: 175,
      temperature: 98.6,
      date: new Date().toISOString(),
    });
  }
}