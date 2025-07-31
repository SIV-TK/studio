// Hospital directory service for managing hospital-specific data and unified services
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface HospitalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  departments: string[];
  totalBeds: number;
  availableBeds: number;
  emergencyServices: boolean;
  accreditation: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface DoctorProfile {
  userId: string;
  name: string;
  hospitalName: string;
  medicalLicense: string;
  specialization: string;
  department?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  schedule?: {
    workingHours?: string;
    availability?: string[];
  };
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface HospitalService {
  id: string;
  hospitalName: string;
  serviceName: string;
  department: string;
  description: string;
  availability: string;
  contactInfo: string;
  isActive: boolean;
  createdAt?: any;
}

export class HospitalDirectoryService {
  // Create or update hospital information
  static async createOrUpdateHospital(hospitalName: string, hospitalInfo: Partial<HospitalInfo>): Promise<void> {
    try {
      const hospitalRef = doc(db, 'hospitals', hospitalName.toLowerCase().replace(/\s+/g, '-'));
      const existingHospital = await getDoc(hospitalRef);
      
      if (existingHospital.exists()) {
        await updateDoc(hospitalRef, {
          ...hospitalInfo,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(hospitalRef, {
          name: hospitalName,
          departments: [
            'Emergency',
            'Cardiology',
            'Oncology',
            'Pediatrics',
            'Geriatrics',
            'Surgery',
            'ICU',
            'Radiology',
            'Laboratory',
            'Pharmacy'
          ],
          totalBeds: 200,
          availableBeds: 50,
          emergencyServices: true,
          accreditation: ['JCI', 'ISO 9001'],
          ...hospitalInfo,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error creating/updating hospital:', error);
      throw error;
    }
  }

  // Get hospital information
  static async getHospitalInfo(hospitalName: string): Promise<HospitalInfo | null> {
    try {
      const hospitalRef = doc(db, 'hospitals', hospitalName.toLowerCase().replace(/\s+/g, '-'));
      const hospitalDoc = await getDoc(hospitalRef);
      
      if (hospitalDoc.exists()) {
        return hospitalDoc.data() as HospitalInfo;
      }
      return null;
    } catch (error) {
      console.error('Error getting hospital info:', error);
      return null;
    }
  }

  // Register doctor to hospital
  static async registerDoctor(doctorProfile: DoctorProfile): Promise<void> {
    try {
      const doctorRef = doc(db, 'hospital-doctors', doctorProfile.userId);
      await setDoc(doctorRef, {
        ...doctorProfile,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Ensure hospital exists
      await this.createOrUpdateHospital(doctorProfile.hospitalName, {
        name: doctorProfile.hospitalName
      });
    } catch (error) {
      console.error('Error registering doctor:', error);
      throw error;
    }
  }

  // Get doctors from same hospital
  static async getDoctorsByHospital(hospitalName: string): Promise<DoctorProfile[]> {
    try {
      const doctorsQuery = query(
        collection(db, 'hospital-doctors'),
        where('hospitalName', '==', hospitalName),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(doctorsQuery);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        userId: doc.id
      } as DoctorProfile));
    } catch (error) {
      console.error('Error getting doctors by hospital:', error);
      return [];
    }
  }

  // Get hospital services
  static async getHospitalServices(hospitalName: string): Promise<HospitalService[]> {
    try {
      const servicesQuery = query(
        collection(db, 'hospital-services'),
        where('hospitalName', '==', hospitalName),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(servicesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as HospitalService));
    } catch (error) {
      console.error('Error getting hospital services:', error);
      return [];
    }
  }

  // Add hospital service
  static async addHospitalService(service: Omit<HospitalService, 'id' | 'createdAt'>): Promise<string> {
    try {
      const servicesRef = collection(db, 'hospital-services');
      const docRef = doc(servicesRef);
      await setDoc(docRef, {
        ...service,
        isActive: true,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding hospital service:', error);
      throw error;
    }
  }

  // Get hospital statistics
  static async getHospitalStats(hospitalName: string): Promise<any> {
    try {
      const doctors = await this.getDoctorsByHospital(hospitalName);
      const hospitalInfo = await this.getHospitalInfo(hospitalName);
      const services = await this.getHospitalServices(hospitalName);

      return {
        totalDoctors: doctors.length,
        activeDoctors: doctors.filter(d => d.isActive).length,
        departments: hospitalInfo?.departments || [],
        totalBeds: hospitalInfo?.totalBeds || 0,
        availableBeds: hospitalInfo?.availableBeds || 0,
        occupancyRate: hospitalInfo ? 
          Math.round(((hospitalInfo.totalBeds - hospitalInfo.availableBeds) / hospitalInfo.totalBeds) * 100) : 0,
        activeServices: services.length,
        emergencyServices: hospitalInfo?.emergencyServices || false
      };
    } catch (error) {
      console.error('Error getting hospital stats:', error);
      return {
        totalDoctors: 0,
        activeDoctors: 0,
        departments: [],
        totalBeds: 0,
        availableBeds: 0,
        occupancyRate: 0,
        activeServices: 0,
        emergencyServices: false
      };
    }
  }
}
