import { render, screen } from "@testing-library/react"
import { AIReviewModal } from "../ai-review-modal"
import { useAppStore } from "@/lib/store"
import jest from "jest" // Import jest to declare the variable

// Mock the store
jest.mock("@/lib/store")
const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>

describe("AIReviewModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    briefTitle: "Test Brief",
    briefSummary: {
      sections: 4,
      confirmedSections: 4,
      assets: 0,
      references: 3,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should show correct citation count with selected citations", () => {
    const mockCitations = [
      {
        id: "CIT-001",
        title: "Efficacy and Safety of Novel Immunotherapy",
        authors: ["Johnson, M.D.", "Smith, R.K."],
        journal: "Journal of Clinical Oncology",
        year: 2024,
        studyType: "RCT",
        relevanceScore: 0.95,
      },
      {
        id: "CIT-002",
        title: "Immunotherapy Response Predictors",
        authors: ["Chen, L.", "Rodriguez, P.M."],
        journal: "Nature Medicine",
        year: 2024,
        studyType: "Meta-analysis",
        relevanceScore: 0.92,
      },
      {
        id: "CIT-003",
        title: "Long-term Outcomes of Checkpoint Inhibitor Therapy",
        authors: ["Anderson, T.L.", "Brown, M.K."],
        journal: "The Lancet Oncology",
        year: 2023,
        studyType: "Clinical Trial",
        relevanceScore: 0.88,
      },
    ]

    mockUseAppStore.mockReturnValue({
      getSelectedCitations: () => mockCitations,
    } as any)

    render(<AIReviewModal {...defaultProps} />)

    // Wait for results stage
    setTimeout(() => {
      expect(screen.getByText("3 references")).toBeInTheDocument()
      expect(screen.getByText("Selected Citations (3)")).toBeInTheDocument()

      // Verify all citations are displayed
      expect(screen.getByText(/Efficacy and Safety of Novel Immunotherapy/)).toBeInTheDocument()
      expect(screen.getByText(/Immunotherapy Response Predictors/)).toBeInTheDocument()
      expect(screen.getByText(/Long-term Outcomes of Checkpoint Inhibitor Therapy/)).toBeInTheDocument()
    }, 3000)
  })

  it("should show empty state when no citations selected", () => {
    mockUseAppStore.mockReturnValue({
      getSelectedCitations: () => [],
    } as any)

    const propsWithZeroRefs = {
      ...defaultProps,
      briefSummary: {
        ...defaultProps.briefSummary,
        references: 0,
      },
    }

    render(<AIReviewModal {...propsWithZeroRefs} />)

    setTimeout(() => {
      expect(screen.getByText("0 references")).toBeInTheDocument()
      expect(screen.getByText("No citations selected.")).toBeInTheDocument()
    }, 3000)
  })
})
