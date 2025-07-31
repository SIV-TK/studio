import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    // Mock AI response based on the type
    const generateMockResponse = (type: string, data: any) => {
      const baseResponse = {
        assessment: `Based on your provided information, here's a comprehensive ${type} assessment tailored to your specific needs and medical profile.`,
        recommendations: [
          'Continue with your current treatment plan',
          'Regular monitoring and follow-up appointments',
          'Lifestyle modifications as discussed',
          'Medication adherence as prescribed'
        ],
        nextSteps: [
          'Schedule follow-up appointment in 3-6 months',
          'Monitor symptoms and report any changes',
          'Continue current medications as prescribed',
          'Maintain healthy lifestyle habits'
        ],
        warnings: [
          'Contact healthcare provider if symptoms worsen',
          'Seek immediate medical attention for emergency symptoms',
          'Do not discontinue medications without consulting doctor'
        ]
      };

      switch (type) {
        case 'cardiology':
          return {
            ...baseResponse,
            assessment: `Cardiovascular Assessment: ${baseResponse.assessment}`,
            recommendations: [
              'Monitor blood pressure regularly',
              'Maintain heart-healthy diet low in sodium',
              'Regular cardiovascular exercise as tolerated',
              'Take prescribed cardiac medications consistently'
            ]
          };
        case 'oncology':
          return {
            ...baseResponse,
            assessment: `Oncology Consultation: ${baseResponse.assessment}`,
            recommendations: [
              'Continue with treatment protocol as scheduled',
              'Maintain nutritional support during treatment',
              'Monitor for treatment side effects',
              'Regular imaging and lab monitoring'
            ]
          };
        case 'pediatrics':
          return {
            ...baseResponse,
            assessment: `Pediatric Assessment: ${baseResponse.assessment}`,
            recommendations: [
              'Age-appropriate developmental milestones monitoring',
              'Vaccination schedule compliance',
              'Nutritional guidance for growth',
              'Regular pediatric check-ups'
            ]
          };
        case 'geriatrics':
          return {
            ...baseResponse,
            assessment: `Geriatric Assessment: ${baseResponse.assessment}`,
            recommendations: [
              'Fall prevention strategies',
              'Medication review and management',
              'Cognitive health monitoring',
              'Mobility and independence support'
            ]
          };
        case 'patient-management':
          return {
            ...baseResponse,
            assessment: `Patient Admission Plan: ${baseResponse.assessment}`,
            recommendations: [
              'Appropriate ward assignment based on condition',
              'Initial treatment and monitoring protocols',
              'Coordination with specialist teams as needed',
              'Discharge planning considerations'
            ]
          };
        default:
          return baseResponse;
      }
    };

    const response = generateMockResponse(type, data);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('AI consultation error:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation request' },
      { status: 500 }
    );
  }
}
