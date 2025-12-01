import type { CampaignData, KnowledgeBaseDocument, Claim } from "@/lib/store/types"

// In-memory knowledge base store
let knowledgeBase: KnowledgeBaseDocument[] = []

// Initialize with some mock documents
const initializeMockKnowledgeBase = (): void => {
  if (knowledgeBase.length === 0) {
    knowledgeBase = [
      {
        id: "kb-001",
        referenceId: "IT-762386",
        title: "Studio clinico randomizzato controllato su efficacia e sicurezza",
        authors: "Rossi et al.",
        journal: "Journal of Medicine",
        publicationDate: "2017-07-10",
        claims: [
          { id: "claim-001-1", pageNumber: 1, text: "Il trattamento ha dimostrato una riduzione significativa del 45% rispetto al placebo" },
          { id: "claim-001-2", pageNumber: 2, text: "L'incidenza di eventi avversi è stata del 12% nel gruppo di trattamento" },
          { id: "claim-001-3", pageNumber: 3, text: "Il miglioramento è stato osservato già dopo 4 settimane di terapia" },
          { id: "claim-001-4", pageNumber: 5, text: "I risultati sono stati confermati in tutti i sottogruppi analizzati" },
        ],
        claimsCount: 4,
      },
      {
        id: "kb-002",
        referenceId: "IT-7657865",
        title: "Meta-analisi di studi clinici su terapia combinata",
        authors: "Bianchi et al.",
        journal: "Medical Research",
        publicationDate: "2018-03-15",
        claims: [
          { id: "claim-002-1", pageNumber: 1, text: "La combinazione terapeutica mostra un'efficacia superiore del 30% rispetto alla monoterapia" },
          { id: "claim-002-2", pageNumber: 2, text: "Il profilo di sicurezza è risultato favorevole in tutti gli studi inclusi" },
          { id: "claim-002-3", pageNumber: 4, text: "L'aderenza al trattamento è stata dell'87% nel gruppo combinato" },
        ],
        claimsCount: 3,
      },
      {
        id: "kb-003",
        referenceId: "IT-7891234",
        title: "Studio osservazionale longitudinale su outcome a lungo termine",
        authors: "Verdi et al.",
        journal: "Clinical Studies",
        publicationDate: "2019-05-20",
        claims: [
          { id: "claim-003-1", pageNumber: 1, text: "Il follow-up a 24 mesi ha confermato la sostenibilità dei risultati" },
          { id: "claim-003-2", pageNumber: 3, text: "La qualità della vita è migliorata significativamente nel 78% dei pazienti" },
          { id: "claim-003-3", pageNumber: 5, text: "Non sono stati osservati eventi avversi gravi correlati al trattamento" },
          { id: "claim-003-4", pageNumber: 6, text: "I pazienti hanno riportato un'alta soddisfazione per il trattamento" },
          { id: "claim-003-5", pageNumber: 7, text: "I risultati supportano l'uso continuato della terapia" },
        ],
        claimsCount: 5,
      },
    ]
  }
}

// Initialize on first import
initializeMockKnowledgeBase()

/**
 * Search knowledge base based on campaign context
 */
export async function searchKnowledgeBase(context: CampaignData): Promise<KnowledgeBaseDocument[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simple mock search logic - in real app, this would use AI/ML to search
  const searchTerms = [
    context.projectName,
    context.brand,
    context.specialty,
    context.requestSummary,
    context.therapeuticArea,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  // Filter documents based on context (mock implementation)
  let results = [...knowledgeBase]

  // Sort: uploaded documents first (by uploadedAt date, newest first), then others
  results = results.sort((a, b) => {
    const aHasUploadedAt = !!(a as any).uploadedAt
    const bHasUploadedAt = !!(b as any).uploadedAt
    
    // If one has uploadedAt and the other doesn't, prioritize the one with uploadedAt
    if (aHasUploadedAt && !bHasUploadedAt) return -1
    if (!aHasUploadedAt && bHasUploadedAt) return 1
    
    // If both have uploadedAt, sort by date (newest first)
    if (aHasUploadedAt && bHasUploadedAt) {
      const aDate = new Date((a as any).uploadedAt).getTime()
      const bDate = new Date((b as any).uploadedAt).getTime()
      return bDate - aDate
    }
    
    // If search terms exist, prioritize documents that might match
    if (searchTerms) {
      const aScore = a.title.toLowerCase().includes(searchTerms.split(" ")[0]) ? 1 : 0
      const bScore = b.title.toLowerCase().includes(searchTerms.split(" ")[0]) ? 1 : 0
      return bScore - aScore
    }
    
    // Otherwise maintain original order
    return 0
  })

  // Return documents with claimsCount populated
  return results.map((doc) => ({
    ...doc,
    claimsCount: doc.claims?.length || 0,
  }))
}

/**
 * Add document to knowledge base
 * New documents are added at the beginning (reverse order - newest first)
 */
export function addDocumentToKnowledgeBase(document: KnowledgeBaseDocument): void {
  // Check if document already exists
  const existingIndex = knowledgeBase.findIndex((doc) => doc.id === document.id)
  
  if (existingIndex >= 0) {
    // Update existing document
    knowledgeBase[existingIndex] = document
  } else {
    // Add new document at the beginning (newest first)
    knowledgeBase.unshift(document)
  }
}

/**
 * Extract claims from uploaded file (mock implementation)
 * In real app, this would use PDF parsing, NLP, or AI to extract highlighted sentences
 */
export async function extractClaimsFromFile(file: File): Promise<Claim[]> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock: Generate 3-5 sample claims with random page numbers
  const numClaims = Math.floor(Math.random() * 3) + 3 // 3-5 claims
  const maxPage = Math.floor(Math.random() * 10) + 5 // 5-15 pages

  const mockClaims: Claim[] = []
  const sampleTexts = [
    "Il trattamento ha dimostrato risultati significativi nel gruppo di studio",
    "L'analisi statistica ha confermato l'efficacia del protocollo terapeutico",
    "I pazienti hanno mostrato un miglioramento clinico rilevante",
    "Il profilo di sicurezza è risultato favorevole durante tutto lo studio",
    "I dati supportano l'uso del trattamento nella popolazione target",
    "L'aderenza al protocollo è stata elevata in entrambi i gruppi",
    "Non sono stati osservati eventi avversi gravi correlati",
    "I risultati sono stati consistenti in tutti i sottogruppi analizzati",
  ]

  for (let i = 0; i < numClaims; i++) {
    const pageNumber = Math.floor(Math.random() * maxPage) + 1
    const textIndex = Math.floor(Math.random() * sampleTexts.length)
    
    mockClaims.push({
      id: `claim-${Date.now()}-${i}`,
      pageNumber,
      text: sampleTexts[textIndex],
    })
  }

  // Sort by page number
  mockClaims.sort((a, b) => a.pageNumber - b.pageNumber)

  return mockClaims
}

/**
 * Get all documents from knowledge base (for debugging/testing)
 */
export function getAllKnowledgeBaseDocuments(): KnowledgeBaseDocument[] {
  return [...knowledgeBase]
}

