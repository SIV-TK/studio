import { HospitalFinanceService, PatientFinancialProfile, HospitalBill } from './hospital-finance-service';
import { pharmacyService, PatientPortalData } from './pharmacy-service';

export interface IntegratedPatientData {
  personalInfo: {
    patientId: string;
    name: string;
    email: string;
    phone: string;
  };
  medical: {
    medications: PatientPortalData | null;
    adherenceRate: number;
    nextAppointment?: string;
  };
  financial: {
    profile: PatientFinancialProfile | null;
    urgentBills: HospitalBill[];
    paymentDue: number;
    insuranceStatus: string;
  };
  alerts: PatientAlert[];
}

export interface PatientAlert {
  id: string;
  type: 'medication' | 'payment' | 'appointment' | 'health';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
}

export class PatientFinanceIntegration {
  
  static async getIntegratedPatientData(patientId: string): Promise<IntegratedPatientData> {
    try {
      const [medicationData, financialProfile] = await Promise.all([
        pharmacyService.getPatientPortalData(patientId),
        HospitalFinanceService.getPatientFinancialProfile(patientId)
      ]);

      const urgentBills = financialProfile?.activeBills.filter(bill => 
        bill.status === 'Overdue' || 
        (bill.pendingAmount > 1000 && new Date(bill.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      ) || [];

      const alerts = this.generatePatientAlerts(medicationData, financialProfile, urgentBills);

      return {
        personalInfo: {
          patientId,
          name: financialProfile?.patientName || 'Patient',
          email: 'patient@example.com',
          phone: '+1-555-0123'
        },
        medical: {
          medications: medicationData,
          adherenceRate: this.calculateAdherenceRate(medicationData),
          nextAppointment: this.getNextAppointment(medicationData)
        },
        financial: {
          profile: financialProfile,
          urgentBills,
          paymentDue: financialProfile?.pendingAmount || 0,
          insuranceStatus: this.getInsuranceStatus(financialProfile)
        },
        alerts
      };
    } catch (error) {
      console.error('Error fetching integrated patient data:', error);
      throw error;
    }
  }

  private static calculateAdherenceRate(medicationData: PatientPortalData | null): number {
    if (!medicationData) return 0;
    
    const totalReminders = medicationData.reminders.length;
    const takenReminders = medicationData.reminders.filter(r => r.taken).length;
    
    return totalReminders > 0 ? Math.round((takenReminders / totalReminders) * 100) : 0;
  }

  private static getNextAppointment(medicationData: PatientPortalData | null): string | undefined {
    // Mock implementation - in real app, this would come from appointment system
    return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  }

  private static getInsuranceStatus(financialProfile: PatientFinancialProfile | null): string {
    if (!financialProfile) return 'Unknown';
    
    // Check if there are recent insurance payments
    const recentInsurancePayments = financialProfile.paymentHistory.filter(
      payment => payment.paymentMethod === 'Insurance' && 
      new Date(payment.paymentDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    return recentInsurancePayments.length > 0 ? 'Active' : 'Pending Verification';
  }

  private static generatePatientAlerts(
    medicationData: PatientPortalData | null,
    financialProfile: PatientFinancialProfile | null,
    urgentBills: HospitalBill[]
  ): PatientAlert[] {
    const alerts: PatientAlert[] = [];

    // Medication alerts
    if (medicationData) {
      const missedDoses = medicationData.reminders.filter(r => 
        !r.taken && !r.skipped && new Date(r.doseTime) < new Date()
      );

      if (missedDoses.length > 0) {
        alerts.push({
          id: 'missed-medication',
          type: 'medication',
          priority: missedDoses.length > 2 ? 'high' : 'medium',
          title: 'Missed Medication Doses',
          message: `You have ${missedDoses.length} missed medication dose${missedDoses.length > 1 ? 's' : ''}`,
          actionRequired: true,
          actionUrl: '/integrated-portal?tab=today',
          createdAt: new Date().toISOString()
        });
      }

      // Low medication supply alert
      const lowSupplyMeds = medicationData.prescriptions.filter(p => 
        p.status === 'active' && p.remainingDoses < 7
      );

      if (lowSupplyMeds.length > 0) {
        alerts.push({
          id: 'low-medication-supply',
          type: 'medication',
          priority: 'medium',
          title: 'Medication Running Low',
          message: `${lowSupplyMeds.length} medication${lowSupplyMeds.length > 1 ? 's' : ''} running low - refill needed`,
          actionRequired: true,
          actionUrl: '/pharmacy',
          createdAt: new Date().toISOString()
        });
      }
    }

    // Financial alerts
    if (financialProfile) {
      if (financialProfile.overdueAmount > 0) {
        alerts.push({
          id: 'overdue-payment',
          type: 'payment',
          priority: 'urgent',
          title: 'Overdue Payment',
          message: `You have ${HospitalFinanceService.formatCurrency(financialProfile.overdueAmount)} in overdue bills`,
          actionRequired: true,
          actionUrl: '/integrated-portal?tab=billing',
          createdAt: new Date().toISOString()
        });
      }

      if (urgentBills.length > 0) {
        alerts.push({
          id: 'urgent-bills',
          type: 'payment',
          priority: 'high',
          title: 'Bills Due Soon',
          message: `${urgentBills.length} bill${urgentBills.length > 1 ? 's' : ''} due within 7 days`,
          actionRequired: true,
          actionUrl: '/integrated-portal?tab=billing',
          createdAt: new Date().toISOString()
        });
      }
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  static async processPayment(billId: string, amount: number, paymentMethod: string): Promise<boolean> {
    try {
      await HospitalFinanceService.recordPayment(billId, {
        amount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod as any,
        receivedBy: 'Patient Portal'
      });
      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    }
  }

  static async updateMedicationAdherence(patientId: string, reminderId: string, taken: boolean): Promise<void> {
    // This would integrate with the pharmacy service to update adherence
    // For now, it's handled in the component state
    console.log(`Updating medication adherence for patient ${patientId}, reminder ${reminderId}, taken: ${taken}`);
  }

  static formatCurrency(amount: number): string {
    return HospitalFinanceService.formatCurrency(amount);
  }

  static getBillStatusColor(status: string): string {
    return HospitalFinanceService.getBillStatusColor(status);
  }

  static getAlertColor(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}