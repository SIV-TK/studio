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
  healthPreferences?: HealthPreferences;
}

interface HealthPreferences {
  age: number;
  gender: string;
  healthProfile: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: string;
}

interface StoredSession {
  userId: string;
  email: string;
  name: string;
  healthPreferences: HealthPreferences;
  loginTime: number;
  expiresAt: number;
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

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<UserSession | null> {
    const user = mockUsers.get(credentials.email);
    
    if (!user || user.password !== credentials.password) {
      return null;
    }

    const healthPreferences: HealthPreferences = {
      age: user.age,
      gender: user.gender,
      healthProfile: user.healthProfile,
      allergies: user.allergies,
      conditions: user.conditions,
      emergencyContact: user.emergencyContact,
    };

    // Save session
    this.saveSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      healthPreferences,
      loginTime: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    });

    // Create user profile
    try {
      await UserDataStore.createUserProfile({
        name: user.name,
        age: user.age,
        gender: user.gender,
        healthProfile: user.healthProfile,
        allergies: user.allergies,
        conditions: user.conditions,
        emergencyContact: user.emergencyContact,
      }, user.id);
    } catch (error) {
      console.error('Profile creation error:', error);
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      profileExists: true,
      healthPreferences,
    };
  }

  static async getCurrentUser(): Promise<UserSession | null> {
    const session = this.getStoredSession();
    
    if (!session || Date.now() > session.expiresAt) {
      this.logout();
      return null;
    }

    return {
      userId: session.userId,
      email: session.email,
      name: session.name,
      profileExists: true,
      healthPreferences: session.healthPreferences,
    };
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mediassist_session');
    }
  }

  private static saveSession(session: StoredSession): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediassist_session', JSON.stringify(session));
    }
  }

  private static getStoredSession(): StoredSession | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('mediassist_session');
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  static updateHealthPreferences(preferences: Partial<HealthPreferences>): void {
    const session = this.getStoredSession();
    if (!session) return;

    session.healthPreferences = { ...session.healthPreferences, ...preferences };
    this.saveSession(session);
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