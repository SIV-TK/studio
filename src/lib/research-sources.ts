// Medical research sources configuration
export const RESEARCH_SOURCES = {
  pubmed: {
    name: 'PubMed',
    baseUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    apiUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
    reliability: 0.95,
  },
  medlineplus: {
    name: 'MedlinePlus',
    baseUrl: 'https://medlineplus.gov/',
    reliability: 0.90,
  },
  mayoclinic: {
    name: 'Mayo Clinic',
    baseUrl: 'https://www.mayoclinic.org/',
    reliability: 0.88,
  },
  cochrane: {
    name: 'Cochrane Library',
    baseUrl: 'https://www.cochranelibrary.com/',
    reliability: 0.92,
  },
  nejm: {
    name: 'New England Journal of Medicine',
    baseUrl: 'https://www.nejm.org/',
    reliability: 0.94,
  },
};

export const SEARCH_KEYWORDS = {
  symptoms: ['diagnosis', 'treatment', 'clinical', 'symptoms', 'management'],
  labResults: ['reference range', 'abnormal', 'interpretation', 'clinical significance', 'guidelines'],
  general: ['evidence-based', 'systematic review', 'meta-analysis', 'clinical trial'],
};