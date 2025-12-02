import type { StateCreator } from "zustand"
import type {
  CampaignData,
  BriefData,
  BrandGuidelinesSettings,
  BrandGuidelinesSnapshots,
  BriefStatus,
  AttachmentFile,
  MedicalCitation,
  AiSelectionMode,
} from "./types"
import { demoBrief, mockRegeneratedContent, mockPromptSuggestions, mockMedicalCitations } from "../mock-data"

export interface BriefSlice {
  campaignData: CampaignData
  setCampaignData: (data: CampaignData) => void
  clearCampaignData: () => void
  formErrors: Record<string, string>
  setFormErrors: (errors: Record<string, string>) => void
  clearFormErrors: () => void
  isGeneratingBrief: boolean
  setIsGeneratingBrief: (loading: boolean) => void
  autoSaveStatus: "idle" | "saving" | "saved" | "error"
  setAutoSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void
  lastAutoSave: Date | null
  setLastAutoSave: (date: Date) => void
  currentBrief: BriefData | null
  setCurrentBrief: (brief: BriefData) => void
  clearCurrentBrief: () => void
  createdBriefs: BriefData[]
  addCreatedBrief: (brief: BriefData) => void
  updateBriefSection: (sectionKey: string, content: string) => void
  generateBrief: () => Promise<void>
  saveDraft: (briefId: string) => Promise<void>
  autoSaveDraft: () => Promise<void>
  updateBriefStatus: (id: string, status: BriefStatus, comment?: string) => boolean
  // Regeneration helpers
  regeneratingSection: string | null
  sectionStates: Record<
    string,
    {
      state: "original" | "regenerating" | "staged" | "confirmed"
      originalContent?: string
      stagedContent?: string
    }
  >
  regenerateSection: (sectionKey: string, prompt?: string) => Promise<void>
  acceptRegeneration: (sectionKey: string) => void
  rejectRegeneration: (sectionKey: string) => void
  undoConfirmedRegeneration: (sectionKey: string) => void
  fillMockPrompt: (sectionKey: string) => string
  // Brand guidelines
  brandGuidelines: BrandGuidelinesSettings
  brandGuidelinesSnapshots: BrandGuidelinesSnapshots
  updateCompanyGuidelines: (data: any) => void
  addCommunicationPersonality: (data: any) => void
  updateCommunicationPersonality: (id: string, data: any) => void
  removeCommunicationPersonality: (id: string) => void
  addTargetAudiencePreset: (data: any) => void
  updateTargetAudiencePreset: (id: string, data: any) => void
  removeTargetAudiencePreset: (id: string) => void
  addProductBrandGuidelines: (data: any) => void
  updateProductBrandGuidelines: (id: string, data: any) => void
  removeProductBrandGuidelines: (id: string) => void
  captureCompanyGuidelinesSnapshot: () => void
  undoCompanyGuidelinesChanges: () => void
  hasCompanyGuidelinesChanges: () => boolean
  captureCommunicationPersonalitySnapshot: (id: string) => void
  undoCommunicationPersonalityChanges: (id: string) => void
  hasCommunicationPersonalityChanges: (id: string) => boolean
  captureTargetAudienceSnapshot: (id: string) => void
  undoTargetAudienceChanges: (id: string) => void
  hasTargetAudienceChanges: (id: string) => boolean
  captureProductGuidelinesSnapshot: (id: string) => void
  undoProductGuidelinesChanges: (id: string) => void
  hasProductGuidelinesChanges: (id: string) => boolean
  clearCompanyGuidelinesSnapshot: () => void
  clearCommunicationPersonalitySnapshot: (id: string) => void
  clearTargetAudienceSnapshot: (id: string) => void
  clearProductGuidelinesSnapshot: (id: string) => void
  // Attachment management
  addAttachmentToCampaign: (attachment: AttachmentFile) => void
  removeAttachmentFromCampaign: (attachmentId: string) => void
  // Medical citation state management
  citations: {
    mockCitations: MedicalCitation[]
    isSearchingCitations: boolean
    citationSearchQuery: string
    selectedCitationIds: string[] // Using array instead of Set for Redux serialization
    aiSelectionMode: AiSelectionMode
  }
  searchCitationsWithAI: (briefContext: { topic: string; id: string }) => Promise<void>
  toggleCitationSelection: (id: string) => void
  setCitationSearchQuery: (query: string) => void
  getFilteredCitations: () => MedicalCitation[]
  getSelectedCitations: () => MedicalCitation[]
  setAiSelectionMode: (mode: AiSelectionMode) => void
  selectIsSelected: (id: string) => boolean
  selectSelectionCount: () => number
  selectSelectedCitationIds: () => string[]
  selectSelectedCitations: () => MedicalCitation[]
  selectSelectedCitationCount: () => number
  // RBAC selectors and role-based permissions
  selectIsBrandGuidelinesReadOnly: () => boolean
  selectCanEditBrandGuidelines: () => boolean
  selectUserRole: () => string
}

const emptyCampaign: CampaignData = {
  projectName: "",
  brand: "",
  therapeuticArea: "",
  expectedLaunchDate: "",
  specialty: "",
  requestSummary: "",
  channels: [],
  additionalContext: "",
  attachments: [],
}

const initialBrandGuidelines: BrandGuidelinesSettings = {
  companyGuidelines: {
    toneOfVoice:
      "Professional, evidence-based, and patient-centric. Maintain scientific rigor while ensuring accessibility for healthcare professionals.",
    companyValues:
      "Patient safety, scientific integrity, regulatory compliance, and ethical responsibility in all pharmaceutical communications.",
    dos: "Use evidence-based claims, maintain regulatory compliance, focus on patient outcomes.",
    donts: "Make unsubstantiated claims, use overly promotional language, ignore safety information.",
  },
  communicationPersonalities: [
    {
      id: "scientific-communication",
      name: "Comunicazione Scientifica",
      description: "Messaggistica scientifica obiettiva e basata sui dati",
      guidelines:
        "Utilizzare terminologia clinica e fare riferimento a evidenze peer-reviewed mantenendo un tono obiettivo.",
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Linguaggio di marketing coinvolgente e focalizzato sul brand",
      guidelines:
        "Evidenziare le proposte di valore con messaggistica persuasiva ma conforme che supporta gli obiettivi del brand.",
    },
    {
      id: "awareness",
      name: "Awareness",
      description: "Messaggistica accessibile per un pubblico ampio",
      guidelines: "Semplificare concetti complessi e concentrarsi sulla comprensione generale senza claim di prodotto.",
    },
    {
      id: "educational",
      name: "Educazionale",
      description: "Messaggistica istruttiva focalizzata sul trasferimento di conoscenze",
      guidelines:
        "Chiarire argomenti complessi con spiegazioni strutturate, visual e obiettivi di apprendimento adatti per formazione o ECM.",
    },
    {
      id: "patient-engagement",
      name: "Coinvolgimento Pazienti",
      description: "Messaggistica empatica e di supporto centrata sui pazienti",
      guidelines:
        "Utilizzare un linguaggio chiaro e non tecnico che enfatizza la qualità della vita, il supporto all'aderenza e l'accessibilità.",
    },
    {
      id: "internal-communication",
      name: "Comunicazione Interna",
      description: "Messaggistica chiara e concisa per team interni e stakeholder",
      guidelines:
        "Concentrarsi su allineamento, aggiornamenti di progetto e insight azionabili utilizzando un linguaggio professionale ma accessibile.",
    },
  ],
  targetAudiencePresets: [
    {
      id: "tech-savvy-young-professional",
      name: "Professionista Giovane e Tecnologico",
      description: "Professionista digitalmente connesso che abbraccia l'innovazione",
      guidelines: "Utilizzare un tono informale e dinamico con riferimenti tecnologici.",
    },
    {
      id: "datadriven-clinician",
      name: "Clinico Data-Driven",
      description: "Cerca evidenze solide e rilevanza clinica",
      guidelines: "Messaggistica: enfatizzare dati, outcome comprovati e allineamento alle linee guida.",
    },
    {
      id: "innovative-researcher",
      name: "Ricercatore Innovativo",
      description: "Attratto da metodi all'avanguardia e terapie innovative",
      guidelines: "Messaggistica: sottolineare innovazione, unicità e potenziale impatto futuro.",
    },
    {
      id: "patientcentered-advocate",
      name: "Sostenitore Patient-Centered",
      description: "Prioritizza esperienza del paziente, accessibilità e qualità della vita",
      guidelines: "Messaggistica: evidenziare empatia, usabilità e outcome positivi per i pazienti.",
    },
  ],
  productBrandGuidelines: [
    {
      id: "lynparza",
      productName: "Lynparza",
      guidelines:
        "Linee guida per il brand Lynparza.",
    },
    {
      id: "wainzua",
      productName: "Wainzua",
      guidelines:
        "Linee guida per il brand Wainzua.",
    },
    {
      id: "tezspire",
      productName: "Tezspire",
      guidelines:
        "Linee guida per il brand Tezspire.",
    },
    {
      id: "imfinzi",
      productName: "Imfinzi",
      guidelines:
        "Linee guida per il brand Imfinzi.",
    },
  ],
}

export const createBriefSlice: StateCreator<BriefSlice, [], [], BriefSlice> = (set, get) => ({
  campaignData: emptyCampaign,
  setCampaignData: (data) => set({ campaignData: data }),
  clearCampaignData: () => set({ campaignData: emptyCampaign }),
  formErrors: {},
  setFormErrors: (errors) => set({ formErrors: errors }),
  clearFormErrors: () => set({ formErrors: {} }),
  isGeneratingBrief: false,
  setIsGeneratingBrief: (loading) => set({ isGeneratingBrief: loading }),
  autoSaveStatus: "idle",
  setAutoSaveStatus: (status) => set({ autoSaveStatus: status }),
  lastAutoSave: null,
  setLastAutoSave: (date) => set({ lastAutoSave: date }),
  currentBrief: null,
  setCurrentBrief: (brief) => set({ currentBrief: brief }),
  clearCurrentBrief: () => set({ currentBrief: null }),
  createdBriefs: [],
  addCreatedBrief: (brief) => set((state) => ({ createdBriefs: [brief, ...state.createdBriefs] })),
  updateBriefSection: (sectionKey, content) =>
    set((state) => {
      if (!state.currentBrief?.generatedContent) return state

      // Handle keyMessages (channel-specific: "keyMessages.channel" or global update)
      if (sectionKey === "keyMessages" || sectionKey.startsWith("keyMessages.")) {
        let keyMessages = content
        if (typeof content === "string") {
          try {
            keyMessages = JSON.parse(content)
          } catch {
            // If parsing fails, treat as regular content
          }
        }
        
        // If it's channel-specific (keyMessages.channel)
        if (sectionKey.includes(".")) {
          const [, channel] = sectionKey.split(".")
          const currentKeyMessages = state.currentBrief.generatedContent.keyMessages || {}
          return {
            ...state,
            currentBrief: {
              ...state.currentBrief,
              generatedContent: {
                ...state.currentBrief.generatedContent,
                keyMessages: {
                  ...(typeof currentKeyMessages === "object" && !Array.isArray(currentKeyMessages)
                    ? currentKeyMessages
                    : {}),
                  [channel]: keyMessages,
                },
              },
              lastModified: new Date(),
            },
          }
        }
        
        // Global update (replace entire keyMessages object)
        return {
          ...state,
          currentBrief: {
            ...state.currentBrief,
            generatedContent: {
              ...state.currentBrief.generatedContent,
              keyMessages: keyMessages,
            },
            lastModified: new Date(),
          },
        }
      }

      // Handle channel-specific updates (format: "toneOfVoice.emailMarketing")
      if (sectionKey.includes(".")) {
        const [baseKey, channel] = sectionKey.split(".")
        const currentContent = state.currentBrief.generatedContent[baseKey as keyof typeof state.currentBrief.generatedContent]
        
        if (typeof currentContent === "object" && currentContent !== null && !Array.isArray(currentContent)) {
          return {
            ...state,
            currentBrief: {
              ...state.currentBrief,
              generatedContent: {
                ...state.currentBrief.generatedContent,
                [baseKey]: {
                  ...(currentContent as Record<string, string>),
                  [channel]: content,
                },
              },
              lastModified: new Date(),
            },
          }
        }
      }

      // Default update
      return {
        ...state,
        currentBrief: {
          ...state.currentBrief,
          generatedContent: {
            ...state.currentBrief.generatedContent,
            [sectionKey]: content,
          },
          lastModified: new Date(),
        },
      }
    }),
  generateBrief: async () => {
    const { campaignData } = get()
    // isGeneratingBrief is controlled by the caller (campaign-form.tsx)
    
    // Generate channel-specific content
    const channels = campaignData.channels || []
    const baseGenerated = demoBrief.generatedContent
    
    // Generate tone of voice, compliance notes, and key messages per channel
    const toneOfVoice: Record<string, string> = {}
    const complianceNotes: Record<string, string> = {}
    const keyMessages: Record<string, any[]> = {}
    
    channels.forEach((channel) => {
      // Use channel-specific content if available, otherwise use base content
      if (baseGenerated.toneOfVoice && typeof baseGenerated.toneOfVoice === "object") {
        const channelTone = (baseGenerated.toneOfVoice as Record<string, string>)[channel]
        toneOfVoice[channel] = channelTone || (baseGenerated.toneOfVoice as Record<string, string>)[Object.keys(baseGenerated.toneOfVoice as Record<string, string>)[0]] || ""
      }
      
      if (baseGenerated.complianceNotes && typeof baseGenerated.complianceNotes === "object") {
        const channelCompliance = (baseGenerated.complianceNotes as Record<string, string>)[channel]
        complianceNotes[channel] = channelCompliance || (baseGenerated.complianceNotes as Record<string, string>)[Object.keys(baseGenerated.complianceNotes as Record<string, string>)[0]] || ""
      }
      
      // Generate key messages per channel
      if (baseGenerated.keyMessages && typeof baseGenerated.keyMessages === "object" && !Array.isArray(baseGenerated.keyMessages)) {
        const channelKeyMessages = (baseGenerated.keyMessages as Record<string, any[]>)[channel]
        keyMessages[channel] = channelKeyMessages || (baseGenerated.keyMessages as Record<string, any[]>)[Object.keys(baseGenerated.keyMessages as Record<string, any[]>)[0]] || []
      }
    })
    
    const generated = {
      ...baseGenerated,
      toneOfVoice,
      complianceNotes,
      keyMessages,
    }
    
    const brief: BriefData = {
      id: `brief-${Date.now()}`,
      title: campaignData.projectName || "Untitled Brief",
      campaignData,
      generatedContent: generated,
      references: [],
      createdAt: new Date(),
      status: "draft",
      lastModified: new Date(),
      lastSavedAt: new Date(),
      statusHistory: [],
      isReadOnly: false,
    }
    set((state) => ({
      currentBrief: brief,
      createdBriefs: [brief, ...state.createdBriefs],
      // Don't set isGeneratingBrief: false here - let the caller handle the timing
    }))
  },
  saveDraft: async (briefId) => {
    const state = get()
    if (!state.currentBrief || state.currentBrief.id !== briefId) return
    set({ autoSaveStatus: "saving" })
    const now = new Date()
    set({
      currentBrief: { ...state.currentBrief, lastSavedAt: now, lastModified: now },
      autoSaveStatus: "saved",
      lastAutoSave: now,
    })
  },
  autoSaveDraft: async () => {
    const brief = get().currentBrief
    if (brief) {
      await get().saveDraft(brief.id)
    }
  },
  updateBriefStatus: (id, status, comment) => {
    const { createdBriefs, currentBrief } = get()
    const brief = createdBriefs.find((b) => b.id === id)
    if (!brief) return false
    const updated: BriefData = {
      ...brief,
      status,
      lastModified: new Date(),
      statusHistory: [
        ...brief.statusHistory,
        {
          id: `status-${Date.now()}`,
          briefId: id,
          fromStatus: brief.status,
          toStatus: status,
          changedBy: "system",
          changedAt: new Date(),
          comment,
        },
      ],
    }
    set({
      createdBriefs: createdBriefs.map((b) => (b.id === id ? updated : b)),
      currentBrief: currentBrief && currentBrief.id === id ? updated : currentBrief,
    })
    return true
  },
  regeneratingSection: null,
  sectionStates: {},
  regenerateSection: async (sectionKey, _prompt) => {
    const state = get()
    if (!state.currentBrief?.generatedContent) return
    
    // Handle channel-specific sections (format: "section.channel")
    let actualSectionKey = sectionKey
    let channel: string | undefined
    if (sectionKey.includes(".")) {
      const parts = sectionKey.split(".")
      actualSectionKey = parts[0]
      channel = parts[1]
    }
    
    let currentContent: any
    if (channel && (actualSectionKey === "keyMessages" || actualSectionKey === "toneOfVoice" || actualSectionKey === "complianceNotes")) {
      // Get channel-specific content
      const sectionContent = state.currentBrief.generatedContent[actualSectionKey as keyof typeof state.currentBrief.generatedContent]
      if (typeof sectionContent === "object" && sectionContent !== null && !Array.isArray(sectionContent)) {
        currentContent = (sectionContent as Record<string, any>)[channel]
      }
    } else {
      currentContent = state.currentBrief.generatedContent[actualSectionKey as keyof typeof state.currentBrief.generatedContent]
    }
    
    if (!currentContent) return

    // Serialize current content for storage
    const serializedContent = typeof currentContent === "object" 
      ? JSON.stringify(currentContent) 
      : String(currentContent)

    set({ regeneratingSection: sectionKey })
    set((s) => ({
      sectionStates: {
        ...s.sectionStates,
        [sectionKey]: { state: "regenerating", originalContent: serializedContent },
      },
    }))

    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Get variations based on section type
    let variations: any[] = []
    if (actualSectionKey === "keyMessages") {
      // For channel-specific key messages
      const keyMsgVariations = mockRegeneratedContent.keyMessages
      if (keyMsgVariations && typeof keyMsgVariations === "object" && !Array.isArray(keyMsgVariations)) {
        const channelVariations = (keyMsgVariations as Record<string, any[]>)[channel || ""] || []
        variations = channelVariations.length > 0 ? channelVariations[0] : []
      } else if (Array.isArray(keyMsgVariations)) {
        variations = keyMsgVariations
      }
    } else if (actualSectionKey === "toneOfVoice" || actualSectionKey === "complianceNotes") {
      // For channel-specific, get variations for the specific channel or first available
      const channelVariations = mockRegeneratedContent[actualSectionKey]
      if (channelVariations && typeof channelVariations === "object") {
        const targetChannel = channel || Object.keys(channelVariations)[0]
        variations = (channelVariations as Record<string, any[]>)[targetChannel] || []
      }
    } else {
      variations = mockRegeneratedContent[actualSectionKey] || []
    }
    
    const randomVariation = variations.length > 0
      ? variations[Math.floor(Math.random() * variations.length)]
      : currentContent

    // Serialize staged content
    const serializedStaged = typeof randomVariation === "object" 
      ? JSON.stringify(randomVariation) 
      : String(randomVariation)

    set((s) => ({
      sectionStates: {
        ...s.sectionStates,
        [sectionKey]: {
          state: "staged",
          originalContent: serializedContent,
          stagedContent: serializedStaged,
        },
      },
      regeneratingSection: null,
    }))
  },
  acceptRegeneration: (sectionKey) => {
    const state = get()
    const sectionState = state.sectionStates[sectionKey]
    if (!sectionState?.stagedContent) return
    
    // Parse staged content if it's a JSON string
    let contentToUpdate = sectionState.stagedContent
    if (sectionKey === "keyMessages" || sectionKey.startsWith("keyMessages.")) {
      try {
        contentToUpdate = JSON.parse(sectionState.stagedContent)
      } catch {
        // Keep as string if parsing fails
      }
    }
    
    // Use the sectionKey as-is (it may include channel like "keyMessages.emailMarketing")
    state.updateBriefSection(sectionKey, contentToUpdate)
    set((s) => ({
      sectionStates: {
        ...s.sectionStates,
        [sectionKey]: {
          state: "confirmed",
          originalContent: sectionState.originalContent,
        },
      },
    }))
  },
  rejectRegeneration: (sectionKey) =>
    set((s) => ({
      sectionStates: {
        ...s.sectionStates,
        [sectionKey]: { state: "original" },
      },
    })),
  undoConfirmedRegeneration: (sectionKey) => {
    const state = get()
    const sectionState = state.sectionStates[sectionKey]
    if (!sectionState?.originalContent) return
    state.updateBriefSection(sectionKey, sectionState.originalContent)
    set((s) => ({
      sectionStates: {
        ...s.sectionStates,
        [sectionKey]: { state: "original" },
      },
    }))
  },
  fillMockPrompt: (sectionKey) => {
    const suggestions = mockPromptSuggestions[sectionKey] || []
    return suggestions[Math.floor(Math.random() * suggestions.length)] || ""
  },
  brandGuidelines: initialBrandGuidelines,
  brandGuidelinesSnapshots: {},
  updateCompanyGuidelines: (data) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: { ...state.brandGuidelines, companyGuidelines: data },
    }))
  },
  addCommunicationPersonality: (data) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        communicationPersonalities: [
          ...state.brandGuidelines.communicationPersonalities,
          { ...data, id: `cp-${Date.now()}` },
        ],
      },
    }))
  },
  updateCommunicationPersonality: (id, data) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        communicationPersonalities: state.brandGuidelines.communicationPersonalities.map((p) =>
          p.id === id ? { ...p, ...data } : p,
        ),
      },
    }))
  },
  removeCommunicationPersonality: (id) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        communicationPersonalities: state.brandGuidelines.communicationPersonalities.filter((p) => p.id !== id),
      },
    }))
  },
  addTargetAudiencePreset: (data) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        targetAudiencePresets: [...state.brandGuidelines.targetAudiencePresets, { ...data, id: `ta-${Date.now()}` }],
      },
    }))
  },
  updateTargetAudiencePreset: (id, data) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        targetAudiencePresets: state.brandGuidelines.targetAudiencePresets.map((p) =>
          p.id === id ? { ...p, ...data } : p,
        ),
      },
    }))
  },
  removeTargetAudiencePreset: (id) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        targetAudiencePresets: state.brandGuidelines.targetAudiencePresets.filter((p) => p.id !== id),
      },
    }))
  },
  addProductBrandGuidelines: (data) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        productBrandGuidelines: [...state.brandGuidelines.productBrandGuidelines, { ...data, id: `pb-${Date.now()}` }],
      },
    }))
  },
  updateProductBrandGuidelines: (id, data) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        productBrandGuidelines: state.brandGuidelines.productBrandGuidelines.map((p) =>
          p.id === id ? { ...p, ...data } : p,
        ),
      },
    }))
  },
  removeProductBrandGuidelines: (id) => {
    const canEdit = get().selectCanEditBrandGuidelines()
    if (!canEdit) {
      console.warn("[v0] Brand guidelines mutation blocked: insufficient permissions")
      return
    }
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        productBrandGuidelines: state.brandGuidelines.productBrandGuidelines.filter((p) => p.id !== id),
      },
    }))
  },
  captureCompanyGuidelinesSnapshot: () =>
    set((state) => ({
      brandGuidelinesSnapshots: {
        ...state.brandGuidelinesSnapshots,
        companyGuidelines: { ...state.brandGuidelines.companyGuidelines },
      },
    })),
  undoCompanyGuidelinesChanges: () =>
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        companyGuidelines: state.brandGuidelinesSnapshots.companyGuidelines || state.brandGuidelines.companyGuidelines,
      },
    })),
  hasCompanyGuidelinesChanges: () => false,
  captureCommunicationPersonalitySnapshot: (id) =>
    set((state) => ({
      brandGuidelinesSnapshots: {
        ...state.brandGuidelinesSnapshots,
        communicationPersonalities: {
          ...(state.brandGuidelinesSnapshots.communicationPersonalities || {}),
          [id]: state.brandGuidelines.communicationPersonalities.find((p) => p.id === id)!,
        },
      },
    })),
  undoCommunicationPersonalityChanges: (id) =>
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        communicationPersonalities: state.brandGuidelines.communicationPersonalities.map((p) =>
          p.id === id && state.brandGuidelinesSnapshots.communicationPersonalities
            ? state.brandGuidelinesSnapshots.communicationPersonalities[id]
            : p,
        ),
      },
    })),
  hasCommunicationPersonalityChanges: (id) => {
    const { communicationPersonalities } = get().brandGuidelines
    const { communicationPersonalities: snapshotPersonalities } = get().brandGuidelinesSnapshots
    const original = communicationPersonalities.find((p) => p.id === id)
    const snapshot = snapshotPersonalities ? snapshotPersonalities[id] : undefined
    return original !== snapshot
  },
  captureTargetAudienceSnapshot: (id) =>
    set((state) => ({
      brandGuidelinesSnapshots: {
        ...state.brandGuidelinesSnapshots,
        targetAudiencePresets: {
          ...(state.brandGuidelinesSnapshots.targetAudiencePresets || {}),
          [id]: state.brandGuidelines.targetAudiencePresets.find((p) => p.id === id)!,
        },
      },
    })),
  undoTargetAudienceChanges: (id) =>
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        targetAudiencePresets: state.brandGuidelines.targetAudiencePresets.map((p) =>
          p.id === id && state.brandGuidelinesSnapshots.targetAudiencePresets
            ? state.brandGuidelinesSnapshots.targetAudiencePresets[id]
            : p,
        ),
      },
    })),
  hasTargetAudienceChanges: (id) => {
    const { targetAudiencePresets } = get().brandGuidelines
    const { targetAudiencePresets: snapshotPresets } = get().brandGuidelinesSnapshots
    const original = targetAudiencePresets.find((p) => p.id === id)
    const snapshot = snapshotPresets ? snapshotPresets[id] : undefined
    return original !== snapshot
  },
  captureProductGuidelinesSnapshot: (id) =>
    set((state) => ({
      brandGuidelinesSnapshots: {
        ...state.brandGuidelinesSnapshots,
        productBrandGuidelines: {
          ...(state.brandGuidelinesSnapshots.productBrandGuidelines || {}),
          [id]: state.brandGuidelines.productBrandGuidelines.find((p) => p.id === id)!,
        },
      },
    })),
  undoProductGuidelinesChanges: (id) =>
    set((state) => ({
      brandGuidelines: {
        ...state.brandGuidelines,
        productBrandGuidelines: state.brandGuidelines.productBrandGuidelines.map((p) =>
          p.id === id && state.brandGuidelinesSnapshots.productBrandGuidelines
            ? state.brandGuidelinesSnapshots.productBrandGuidelines[id]
            : p,
        ),
      },
    })),
  hasProductGuidelinesChanges: (id) => {
    const { productBrandGuidelines } = get().brandGuidelines
    const { productBrandGuidelines: snapshotGuidelines } = get().brandGuidelinesSnapshots
    const original = productBrandGuidelines.find((p) => p.id === id)
    const snapshot = snapshotGuidelines ? snapshotGuidelines[id] : undefined
    return original !== snapshot
  },
  clearCompanyGuidelinesSnapshot: () =>
    set((state) => ({
      brandGuidelinesSnapshots: {
        ...state.brandGuidelinesSnapshots,
        companyGuidelines: undefined,
      },
    })),
  clearCommunicationPersonalitySnapshot: (id) =>
    set((state) => {
      const snaps = { ...(state.brandGuidelinesSnapshots.communicationPersonalities || {}) }
      delete snaps[id]
      return {
        brandGuidelinesSnapshots: {
          ...state.brandGuidelinesSnapshots,
          communicationPersonalities: snaps,
        },
      }
    }),
  clearTargetAudienceSnapshot: (id) =>
    set((state) => {
      const snaps = { ...(state.brandGuidelinesSnapshots.targetAudiencePresets || {}) }
      delete snaps[id]
      return {
        brandGuidelinesSnapshots: {
          ...state.brandGuidelinesSnapshots,
          targetAudiencePresets: snaps,
        },
      }
    }),
  clearProductGuidelinesSnapshot: (id) =>
    set((state) => {
      const snaps = { ...(state.brandGuidelinesSnapshots.productBrandGuidelines || {}) }
      delete snaps[id]
      return {
        brandGuidelinesSnapshots: {
          ...state.brandGuidelinesSnapshots,
          productBrandGuidelines: snaps,
        },
      }
    }),
  // Attachment management
  addAttachmentToCampaign: (attachment) =>
    set((state) => ({
      campaignData: {
        ...state.campaignData,
        attachments: [...state.campaignData.attachments, attachment],
      },
    })),
  removeAttachmentFromCampaign: (attachmentId) =>
    set((state) => ({
      campaignData: {
        ...state.campaignData,
        attachments: state.campaignData.attachments.filter((a) => a.id !== attachmentId),
      },
    })),
  // Medical citation state management
  citations: {
    mockCitations: mockMedicalCitations,
    isSearchingCitations: false,
    citationSearchQuery: "",
    selectedCitationIds: [],
    aiSelectionMode: "merge",
  },
  searchCitationsWithAI: async (briefContext) => {
    set((state) => ({
      citations: { ...state.citations, isSearchingCitations: true },
    }))

    // 2 second realistic loading animation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const { mockCitations, selectedCitationIds: prevSelected, aiSelectionMode } = get().citations
    let autoIds: string[] = []

    // Deterministic selection logic
    if (briefContext.id === "existing-brief-1" || briefContext.topic.toLowerCase().includes("immunotherapy")) {
      // Q4 Immunotherapy Education Initiative gets immunotherapy-specific citations
      autoIds = ["CIT-IMMU-001", "CIT-IMMU-002", "CIT-IMMU-003"]
    } else if (
      briefContext.topic.toLowerCase().includes("lokelma") ||
      briefContext.topic.toLowerCase().includes("iperkaliemia")
    ) {
      // Lokelma brief gets all 4 Lokelma-specific citations
      autoIds = ["CIT-LOK-001", "CIT-LOK-002", "CIT-LOK-003", "CIT-LOK-004"]
    } else {
      // Other briefs get top 4 by relevance score, with stable tie-breaking
      const sortedCitations = [...mockCitations].sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore
        }
        if (b.year !== a.year) {
          return b.year - a.year
        }
        return a.title.localeCompare(b.title)
      })
      autoIds = sortedCitations.slice(0, 4).map((c) => c.id)
    }

    const finalSelectedIds =
      aiSelectionMode === "replace" ? Array.from(new Set(autoIds)) : Array.from(new Set([...prevSelected, ...autoIds]))

    set((state) => ({
      citations: {
        ...state.citations,
        isSearchingCitations: false,
        selectedCitationIds: finalSelectedIds,
      },
    }))

    const prevCount = prevSelected.length
    const addedCount = autoIds.filter((id) => !prevSelected.includes(id)).length
    const finalCount = finalSelectedIds.length

    console.info({
      ts: Date.now(),
      action: aiSelectionMode === "replace" ? "ai_replace" : "ai_merge",
      prevCount,
      addedCount,
      finalCount,
      briefId: briefContext.id,
      query: briefContext.topic,
      autoIds,
    })
  },
  toggleCitationSelection: (id) => {
    set((state) => {
      const a = [...state.citations.selectedCitationIds] // Create new array for immutability
      const i = a.indexOf(id)
      if (i === -1) {
        a.push(id)
      } else {
        a.splice(i, 1)
      }

      // Log the action
      console.info({
        ts: Date.now(),
        action: "citation-selection-toggle",
        citationIds: [id],
        briefId: state.currentBrief?.id || "",
        selected: i === -1,
      })

      return {
        citations: {
          ...state.citations,
          selectedCitationIds: a,
        },
      }
    })
  },
  setCitationSearchQuery: (query) => {
    set((state) => ({
      citations: { ...state.citations, citationSearchQuery: query },
    }))

    // Log search action
    console.info({
      ts: Date.now(),
      action: "citation-search",
      citationIds: [],
      briefId: get().currentBrief?.id || "",
      query,
    })
  },
  getFilteredCitations: () => {
    const { mockCitations, citationSearchQuery } = get().citations
    if (!citationSearchQuery.trim()) {
      return mockCitations
    }

    const query = citationSearchQuery.toLowerCase()
    return mockCitations.filter(
      (citation) =>
        citation.title.toLowerCase().includes(query) ||
        citation.authors.some((author) => author.toLowerCase().includes(query)) ||
        citation.studyType.toLowerCase().includes(query) ||
        citation.journal.toLowerCase().includes(query),
    )
  },
  getSelectedCitations: () => {
    const { mockCitations, selectedCitationIds } = get().citations
    const selectedSet = new Set(selectedCitationIds)
    return mockCitations.filter((citation) => selectedSet.has(citation.id))
  },
  setAiSelectionMode: (mode) => {
    set((state) => ({
      citations: { ...state.citations, aiSelectionMode: mode },
    }))
  },
  selectIsSelected: (id) => {
    const { selectedCitationIds } = get().citations
    return selectedCitationIds.includes(id)
  },
  selectSelectionCount: () => {
    return get().citations.selectedCitationIds.length
  },
  selectSelectedCitationIds: () => {
    return get().citations.selectedCitationIds
  },
  selectSelectedCitations: () => {
    const { mockCitations, selectedCitationIds } = get().citations
    const selectedSet = new Set(selectedCitationIds)
    return mockCitations.filter((citation) => selectedSet.has(citation.id))
  },
  selectSelectedCitationCount: () => {
    return get().citations.selectedCitationIds.length
  },
  // RBAC selector functions
  selectUserRole: () => {
    // For demo purposes, Brief Creator role is read-only for brand guidelines
    return "Brief Creator"
  },
  selectCanEditBrandGuidelines: () => {
    const role = get().selectUserRole()
    return role === "Admin" // Only Admin can edit brand guidelines
  },
  selectIsBrandGuidelinesReadOnly: () => {
    return !get().selectCanEditBrandGuidelines()
  },
})
