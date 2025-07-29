'use server';

interface ResearchData {
  title: string;
  abstract: string;
  source: string;
  date: string;
  relevanceScore: number;
}

export async function scrapeResearchData(query: string): Promise<ResearchData[]> {
  const sources = [
    { name: 'PubMed', url: `https://pubmed.ncbi.nlm.nih.gov/` },
    { name: 'MedlinePlus', url: `https://medlineplus.gov/` },
    { name: 'Mayo Clinic', url: `https://www.mayoclinic.org/` },
  ];

  try {
    // Simulate research data fetching (replace with actual scraping logic)
    const mockData: ResearchData[] = [
      {
        title: `Recent findings on ${query} - Clinical Study 2024`,
        abstract: `Latest research indicates new treatment approaches for ${query} with improved outcomes. Study shows 85% efficacy in clinical trials with minimal side effects.`,
        source: 'PubMed',
        date: new Date().toISOString().split('T')[0],
        relevanceScore: 0.95,
      },
      {
        title: `${query} Management Guidelines - Updated Protocol`,
        abstract: `Updated clinical guidelines for ${query} management based on recent meta-analysis of 50+ studies. Recommends personalized treatment approach.`,
        source: 'Mayo Clinic',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        relevanceScore: 0.88,
      },
      {
        title: `Diagnostic Accuracy in ${query} Cases - Systematic Review`,
        abstract: `Systematic review of diagnostic methods for ${query} shows improved accuracy with AI-assisted analysis. Reduces false positives by 30%.`,
        source: 'MedlinePlus',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        relevanceScore: 0.82,
      },
    ];

    return mockData.filter(data => data.relevanceScore > 0.7);
  } catch (error) {
    console.error('Error scraping research data:', error);
    return [];
  }
}

export async function getSymptomResearch(symptoms: string): Promise<string> {
  const queries = symptoms.split(',').map(s => s.trim()).slice(0, 3);
  const allResearch: ResearchData[] = [];

  for (const query of queries) {
    const research = await scrapeResearchData(query);
    allResearch.push(...research);
  }

  return allResearch
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5)
    .map(r => `${r.title}\n${r.abstract}\nSource: ${r.source} (${r.date})`)
    .join('\n\n');
}

export async function getLabResultsResearch(labFindings: string): Promise<string> {
  const findings = labFindings.split(',').map(s => s.trim()).slice(0, 3);
  const allResearch: ResearchData[] = [];

  for (const finding of findings) {
    const research = await scrapeResearchData(finding);
    allResearch.push(...research);
  }

  return allResearch
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5)
    .map(r => `${r.title}\n${r.abstract}\nSource: ${r.source} (${r.date})`)
    .join('\n\n');
}