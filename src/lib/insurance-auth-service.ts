import { UserDataStore } from '@/lib/user-data-store';

interface InsuranceLoginCredentials {
  email: string;
  password: string;
}

interface InsuranceUserSession {
  userId: string;
  email: string;
  name: string;
  companyName: string;
  role: string;
  department: string;
  permissions: string[];
  loginTime: number;
  expiresAt: number;
}

interface InsuranceCompany {
  id: string;
  name: string;
  type: 'health' | 'life' | 'comprehensive';
  licenseNumber: string;
  established: number;
  headquarters: string;
}

// Mock insurance companies
const insuranceCompanies: Map<string, InsuranceCompany> = new Map([
  ['healthfirst_ins', {
    id: 'healthfirst_ins',
    name: 'HealthFirst Insurance',
    type: 'health',
    licenseNumber: 'HF-2020-001',
    established: 2020,
    headquarters: 'New York, NY'
  }],
  ['lifecare_global', {
    id: 'lifecare_global',
    name: 'LifeCare Global Insurance',
    type: 'comprehensive',
    licenseNumber: 'LC-2018-045',
    established: 2018,
    headquarters: 'Chicago, IL'
  }],
  ['wellness_shield', {
    id: 'wellness_shield',
    name: 'Wellness Shield Insurance',
    type: 'health',
    licenseNumber: 'WS-2019-023',
    established: 2019,
    headquarters: 'Los Angeles, CA'
  }],
  ['premier_health', {
    id: 'premier_health',
    name: 'Premier Health Insurance',
    type: 'health',
    licenseNumber: 'PH-2017-089',
    established: 2017,
    headquarters: 'Houston, TX'
  }]
]);

// Mock insurance users database
const mockInsuranceUsers = new Map([
  ['sarah.johnson@healthfirst.com', {
    id: 'ins_user_001',
    email: 'sarah.johnson@healthfirst.com',
    password: 'insurance123',
    name: 'Sarah Johnson',
    companyId: 'healthfirst_ins',
    role: 'Risk Analyst',
    department: 'Underwriting',
    permissions: ['view_patient_data', 'analyze_risk', 'create_policies', 'view_analytics', 'process_claims'],
    hireDate: '2023-01-15'
  }],
  ['michael.chen@lifecare.com', {
    id: 'ins_user_002',
    email: 'michael.chen@lifecare.com',
    password: 'insurance123',
    name: 'Michael Chen',
    companyId: 'lifecare_global',
    role: 'Senior Underwriter',
    department: 'Risk Assessment',
    permissions: ['view_patient_data', 'analyze_risk', 'approve_policies', 'view_analytics', 'manage_team', 'process_claims', 'approve_claims', 'manage_accounts'],
    hireDate: '2022-03-20'
  }],
  ['emily.davis@wellness.com', {
    id: 'ins_user_003',
    email: 'emily.davis@wellness.com',
    password: 'insurance123',
    name: 'Emily Davis',
    companyId: 'wellness_shield',
    role: 'Claims Specialist',
    department: 'Claims Processing',
    permissions: ['view_patient_data', 'process_claims', 'view_analytics', 'approve_claims'],
    hireDate: '2023-06-10'
  }],
  ['robert.martinez@premier.com', {
    id: 'ins_user_004',
    email: 'robert.martinez@premier.com',
    password: 'insurance123',
    name: 'Robert Martinez',
    companyId: 'premier_health',
    role: 'AI Analytics Manager',
    department: 'Data Science',
    permissions: ['view_patient_data', 'analyze_risk', 'manage_ai_models', 'view_analytics', 'export_data', 'process_claims'],
    hireDate: '2021-11-05'
  }]
]);

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours for insurance users

export class InsuranceAuthService {
  static async login(credentials: InsuranceLoginCredentials): Promise<InsuranceUserSession | null> {
    const user = mockInsuranceUsers.get(credentials.email);
    
    if (!user || user.password !== credentials.password) {
      return null;
    }

    const company = insuranceCompanies.get(user.companyId);
    if (!company) {
      return null;
    }

    const session: InsuranceUserSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      companyName: company.name,
      role: user.role,
      department: user.department,
      permissions: user.permissions,
      loginTime: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    };

    // Save session
    this.saveSession(session);

    return session;
  }

  static saveSession(session: InsuranceUserSession): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('insurance_session', JSON.stringify(session));
    }
  }

  static getSession(): InsuranceUserSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = localStorage.getItem('insurance_session');
      if (!sessionData) return null;

      const session: InsuranceUserSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error retrieving insurance session:', error);
      return null;
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('insurance_session');
    }
  }

  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  static hasPermission(permission: string): boolean {
    const session = this.getSession();
    return session?.permissions.includes(permission) || false;
  }

  static getCompanies(): InsuranceCompany[] {
    return Array.from(insuranceCompanies.values());
  }

  static getCompanyById(id: string): InsuranceCompany | undefined {
    return insuranceCompanies.get(id);
  }
}
