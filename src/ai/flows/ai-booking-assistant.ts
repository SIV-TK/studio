import { ai } from '../genkit';
import { z } from 'zod';

const aiBookingInputSchema = z.object({
  userSymptoms: z.string(),
  userConditions: z.string(),
  userProfile: z.string(),
});

const aiBookingOutputSchema = z.object({
  recommendedSpecialty: z.string(),
  urgencyLevel: z.string(),
  enhancedDescription: z.string(),
  suggestedQuestions: z.array(z.string()),
  appointmentType: z.string(),
});

export const aiBookingAssistant = ai.defineFlow(
  {
    name: 'aiBookingAssistant',
    inputSchema: aiBookingInputSchema,
    outputSchema: aiBookingOutputSchema,
  },
  async (input) => {
    const prompt = `AI Booking Assistant Analysis with Medical Knowledge:

USER SYMPTOMS: ${input.userSymptoms}
USER CONDITIONS: ${input.userConditions}
USER PROFILE: ${input.userProfile}

Using your extensive medical knowledge from verified sources including PubMed, Cochrane Library, NEJM, Mayo Clinic, and other medical databases, provide:

1. RECOMMENDED SPECIALTY: Which medical specialist would be most appropriate based on current medical guidelines
2. URGENCY LEVEL: How urgent is this appointment (Low/Medium/High/Emergency) based on medical literature
3. ENHANCED DESCRIPTION: A comprehensive medical description using verified medical terminology and evidence-based findings
4. SUGGESTED QUESTIONS: 3-4 evidence-based questions the doctor should ask during the appointment
5. APPOINTMENT TYPE: Type of appointment needed (Consultation/Follow-up/Emergency/Routine)

Provide accurate, evidence-based recommendations using established medical knowledge.
Format as valid JSON with keys: recommendedSpecialty, urgencyLevel, enhancedDescription, suggestedQuestions, appointmentType`;

    const { output } = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash',
    });

    return JSON.parse(output.text());
  }
);

export type AIBookingOutput = z.infer<typeof aiBookingOutputSchema>;