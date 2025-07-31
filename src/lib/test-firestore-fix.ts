// Test the Firestore utilities and patient portal fix
import { pharmacyService } from './pharmacy-service';

export async function testPatientPortalFix() {
  console.log('Testing patient portal data retrieval with index fix...');
  
  try {
    // Test with a mock patient ID
    const portalData = await pharmacyService.getPatientPortalData('patient-001');
    
    if (portalData) {
      console.log('✅ Patient portal data retrieved successfully:', {
        patientId: portalData.patientId,
        prescriptionsCount: portalData.prescriptions.length
      });
    } else {
      console.log('⚠️ No portal data found for patient-001');
    }
    
    // Test prescription filtering
    const prescriptions = await pharmacyService.getPrescriptions({
      status: 'ready'
    });
    
    console.log(`✅ Prescriptions query successful: ${prescriptions.length} ready prescriptions found`);
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPatientPortalFix().then(success => {
    console.log(success ? '✅ All tests passed!' : '❌ Some tests failed!');
    process.exit(success ? 0 : 1);
  });
}
