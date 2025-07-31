// Updated UserDataStore to use Firebase/Firestore
import { FirestoreService } from './firestore-service';
import type { UserProfile, Medication, HealthRecord } from './firestore-service';

// Legacy compatibility wrapper for existing code
export class UserDataStore {
  static async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>, userId?: string): Promise<string> {
    if (userId) {
      await FirestoreService.createUserProfile(userId, profile);
      return userId;
    } else {
      // Generate a user ID (in real app, this would come from Firebase Auth)
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await FirestoreService.createUserProfile(newUserId, profile);
      return newUserId;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    await FirestoreService.updateUserProfile(userId, updates);
  }

  static async addMedication(medication: Omit<Medication, 'id' | 'createdAt'>): Promise<string> {
    return await FirestoreService.addMedication(medication);
  }

  static async addHealthRecord(record: Omit<HealthRecord, 'id' | 'createdAt'>): Promise<string> {
    return await FirestoreService.addHealthRecord(record);
  }

  static async getComprehensiveUserData(userId: string) {
    return await FirestoreService.getComprehensiveUserData(userId);
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    return await FirestoreService.getUserProfile(userId);
  }

  static async getUserMedications(userId: string): Promise<Medication[]> {
    return await FirestoreService.getUserMedications(userId);
  }

  static async getUserHealthRecords(userId: string): Promise<HealthRecord[]> {
    return await FirestoreService.getUserHealthRecords(userId);
  }
}