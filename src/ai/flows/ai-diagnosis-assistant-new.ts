import { defineFlow, run } from '@genkit-ai/flow';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';

// Input schema for diagnosis assistant
const DiagnosisAssistantInput = z.object({
  patientId: z.string(),
  chiefComplaint: z.string(),
  presentIllness: z.string(),
  vitals: z.object({
    temperature: z.number().optional(),
    heartRate: z.number().optional(),
    bloodPressure: z.string().optional(),
    respiratoryRate: z.number().optional(),
    oxygenSaturation: z.number().optional(),
  }),
  medicalHistory: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
});

// Output schema for diagnosis recommendations
const DiagnosisAssistantOutput = z.object({
  diagnosis: z.string(),
  investigations: z.object({
    laboratory: z.array(z.object({
      test: z.string(),
      indication: z.string(),
      priority: z.enum(['urgent', 'routine', 'optional'])
    })),
    imaging: z.array(z.object({
      study: z.string(),
      indication: z.string(),
      priority: z.enum(['urgent', 'routine', 'optional'])
    })),
    others: z.array(z.string())
  }),
  treatment: z.object({
    medications: z.array(z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string(),
      indication: z.string()
    })),
    nonPharmacological: z.array(z.object({
      intervention: z.string(),
      instructions: z.string()
    })),
    followUp: z.object({
      instructions: z.string(),
      timeframe: z.string()
    })
  }),
  redFlags: z.array(z.object({
    symptom: z.string(),
    action: z.string()
  })),
  evidence: z.object({
    sources: z.array(z.string()),
    qualityOfEvidence: z.enum(['high', 'moderate', 'low']),
    recommendations: z.array(z.string())
  })
});

export type DiagnosisAssistantInputType = z.infer<typeof DiagnosisAssistantInput>;
export type DiagnosisAssistantOutputType = z.infer<typeof DiagnosisAssistantOutput>;

// AI-powered diagnosis assistance flow
export const aiDiagnosisFlow = defineFlow(
  {
    name: 'aiDiagnosisFlow',
    inputSchema: DiagnosisAssistantInput,
    outputSchema: DiagnosisAssistantOutput,
  },
  async (input) => {
    try {
      // Prepare prompt with patient information
      const prompt = `
        As an AI medical assistant, analyze the following patient case and provide comprehensive diagnostic recommendations:

        Patient Information:
        - Chief Complaint: ${input.chiefComplaint}
        - Present Illness: ${input.presentIllness}
        - Vital Signs: ${JSON.stringify(input.vitals)}
        - Medical History: ${input.medicalHistory || 'None reported'}
        - Current Medications: ${input.medications || 'None reported'}
        - Allergies: ${input.allergies || 'None reported'}

        Please provide:
        1. Most likely diagnosis with differential considerations
        2. Recommended laboratory tests and imaging studies with priorities
        3. Treatment recommendations including medications and non-pharmacological interventions
        4. Red flag symptoms to watch for
        5. Follow-up instructions

        Base your recommendations on current medical guidelines and evidence-based practices.
      `;

      // For now, return a mock response since AI integration needs proper setup
      const aiResponse: DiagnosisAssistantOutputType = {
        diagnosis: `Based on the symptoms of ${input.chiefComplaint}, differential diagnosis includes common conditions related to the presented symptoms.`,
        investigations: {
          laboratory: [
            {
              test: "Complete Blood Count (CBC)",
              indication: "Rule out infection or hematological abnormalities",
              priority: "routine" as const
            },
            {
              test: "Basic Metabolic Panel",
              indication: "Assess electrolyte balance and kidney function",
              priority: "routine" as const
            }
          ],
          imaging: [
            {
              study: "Chest X-ray",
              indication: "Evaluate respiratory symptoms if present",
              priority: "routine" as const
            }
          ],
          others: ["ECG if cardiac symptoms present", "Urinalysis if urinary symptoms"]
        },
        treatment: {
          medications: [
            {
              name: "Acetaminophen",
              dosage: "650mg",
              frequency: "Every 6 hours",
              duration: "As needed",
              indication: "Fever and pain management"
            }
          ],
          nonPharmacological: [
            {
              intervention: "Rest and hydration",
              instructions: "Adequate rest and increased fluid intake"
            }
          ],
          followUp: {
            instructions: "Return if symptoms worsen or persist beyond expected timeframe",
            timeframe: "7 days"
          }
        },
        redFlags: [
          {
            symptom: "High fever >39°C (102°F)",
            action: "Immediate medical attention"
          },
          {
            symptom: "Difficulty breathing",
            action: "Emergency care required"
          }
        ],
        evidence: {
          sources: [
            "Current medical guidelines",
            "Evidence-based practice recommendations",
            "Clinical decision support systems"
          ],
          qualityOfEvidence: "moderate" as const,
          recommendations: [
            "Follow standard diagnostic protocols",
            "Consider patient-specific factors",
            "Monitor response to treatment"
          ]
        }
      };

      return aiResponse;

    } catch (error) {
      console.error('Error in AI diagnosis flow:', error);
      
      // Fallback response
      return {
        diagnosis: "Unable to generate AI diagnosis at this time. Please proceed with clinical judgment.",
        investigations: {
          laboratory: [],
          imaging: [],
          others: []
        },
        treatment: {
          medications: [],
          nonPharmacological: [],
          followUp: {
            instructions: "Standard follow-up as clinically indicated",
            timeframe: "As needed"
          }
        },
        redFlags: [],
        evidence: {
          sources: [],
          qualityOfEvidence: "low" as const,
          recommendations: []
        }
      };
    }
  }
);

export default aiDiagnosisFlow;
