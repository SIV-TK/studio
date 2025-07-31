// Firestore utilities for handling index errors gracefully
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Execute a Firestore query with graceful fallback for missing indexes
 * @param collectionName - Name of the Firestore collection
 * @param constraints - Array of query constraints (where, orderBy, etc.)
 * @param fallbackConstraints - Fallback constraints if the main query fails
 * @returns Promise<QueryDocumentSnapshot<DocumentData>[]>
 */
export async function queryWithFallback(
  collectionName: string,
  constraints: QueryConstraint[],
  fallbackConstraints?: QueryConstraint[]
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
  try {
    // Try the main query first
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs;
  } catch (error: any) {
    console.log(`Main query failed for ${collectionName}:`, error.message);
    
    // If we have fallback constraints, try those
    if (fallbackConstraints && fallbackConstraints.length > 0) {
      try {
        const fallbackQuery = query(collection(db, collectionName), ...fallbackConstraints);
        const fallbackSnapshot = await getDocs(fallbackQuery);
        console.log(`Using fallback query for ${collectionName}`);
        return fallbackSnapshot.docs;
      } catch (fallbackError: any) {
        console.error(`Fallback query also failed for ${collectionName}:`, fallbackError.message);
        throw fallbackError;
      }
    } else {
      throw error;
    }
  }
}

/**
 * Query with automatic sorting fallback
 * @param collectionName - Name of the Firestore collection
 * @param whereConstraints - Where clauses
 * @param sortField - Field to sort by
 * @param sortDirection - Sort direction ('asc' or 'desc')
 * @returns Promise<QueryDocumentSnapshot<DocumentData>[]>
 */
export async function queryWithSort(
  collectionName: string,
  whereConstraints: QueryConstraint[],
  sortField: string,
  sortDirection: 'asc' | 'desc' = 'desc'
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const orderByConstraint = orderBy(sortField, sortDirection);
  
  try {
    // Try query with orderBy
    const docs = await queryWithFallback(
      collectionName,
      [...whereConstraints, orderByConstraint],
      whereConstraints // fallback without orderBy
    );
    
    // If we used the fallback (no orderBy), sort manually
    if (docs.length > 1) {
      docs.sort((a, b) => {
        const aValue = a.data()[sortField];
        const bValue = b.data()[sortField];
        
        // Handle Firestore Timestamps
        const aTime = aValue?.toMillis ? aValue.toMillis() : aValue;
        const bTime = bValue?.toMillis ? bValue.toMillis() : bValue;
        
        if (sortDirection === 'desc') {
          return bTime - aTime;
        } else {
          return aTime - bTime;
        }
      });
    }
    
    return docs;
  } catch (error) {
    console.error(`Query failed for ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get the most recent document for a user/entity
 * @param collectionName - Name of the Firestore collection
 * @param fieldName - Field name to filter by (e.g., 'patientId', 'userId')
 * @param fieldValue - Value to filter by
 * @param sortField - Field to sort by (default: 'createdAt')
 * @returns Promise<DocumentData | null>
 */
export async function getLatestDocument(
  collectionName: string,
  fieldName: string,
  fieldValue: string,
  sortField: string = 'createdAt'
): Promise<DocumentData | null> {
  try {
    const docs = await queryWithSort(
      collectionName,
      [where(fieldName, '==', fieldValue)],
      sortField,
      'desc'
    );
    
    return docs.length > 0 ? docs[0].data() : null;
  } catch (error) {
    console.error(`Failed to get latest document from ${collectionName}:`, error);
    return null;
  }
}
