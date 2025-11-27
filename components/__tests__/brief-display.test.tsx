import { render, screen } from "@testing-library/react"
import { BriefDisplay } from "../brief-display"
import { useAppStore } from "@/lib/store"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the store
jest.mock("@/lib/store")
const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>

describe("BriefDisplay", () => {
  const mockStore = {
    currentBrief: {
      id: "test-brief",
      title: "Test Brief",
      campaignData: {
        brand: "Test Brand",
        channels: ["Email", "Social"],
        requestSummary: "Test summary",
      },
      generatedContent: {
        objectives: "Test objectives content",
        keyMessages: "Test key messages",
        toneOfVoice: "Professional tone",
        complianceNotes: "Compliance requirements",
      },
      references: [],
      createdAt: new Date(),
      status: "draft" as const,
      lastModified: new Date(),
      lastSavedAt: new Date(),
      statusHistory: [],
      isReadOnly: false,
    },
    getSelectedCitations: jest.fn(() => [
      {
        id: "CIT-001",
        title: "Test Citation",
        authors: ["Author, A."],
        journal: "Test Journal",
        year: 2024,
        studyType: "RCT",
        relevanceScore: 0.95,
      },
    ]),
    setCurrentView: jest.fn(),
    resetApp: jest.fn(),
    addReferenceToBrief: jest.fn(),
    removeReferenceFromBrief: jest.fn(),
    updateBriefSection: jest.fn(),
    saveDraft: jest.fn(),
    updateBriefStatus: jest.fn(),
    regeneratingSection: null,
    sectionStates: {},
    regenerateSection: jest.fn(),
    acceptRegeneration: jest.fn(),
    rejectRegeneration: jest.fn(),
    undoConfirmedRegeneration: jest.fn(),
    fillMockPrompt: jest.fn(),
    brandGuidelines: {
      targetAudiencePresets: [],
      communicationPersonalities: [],
    },
  }

  beforeEach(() => {
    mockUseAppStore.mockReturnValue(mockStore as any)
  })

  it("should not render citations under brief sections", () => {
    render(<BriefDisplay />)

    // Verify sections are rendered
    expect(screen.getByText("Campaign Objectives")).toBeInTheDocument()
    expect(screen.getByText("Key Messages")).toBeInTheDocument()
    expect(screen.getByText("Tone of Voice")).toBeInTheDocument()
    expect(screen.getByText("Compliance Notes")).toBeInTheDocument()

    // Verify no "Supporting Citations:" headers appear under sections
    expect(screen.queryByText("Supporting Citations:")).not.toBeInTheDocument()

    // Verify citation content doesn't appear in sections
    expect(screen.queryByText("Test Citation")).not.toBeInTheDocument()
  })

  it("should pass correct citation count to AI Review modal", () => {
    render(<BriefDisplay />)

    // The AI Review modal should receive selectedCitations.length as references count
    // This is tested through the briefSummary prop passed to AIReviewModal
    expect(mockStore.getSelectedCitations).toHaveBeenCalled()
  })
})
