import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CitationItem } from "../citation-item"
import type { MedicalCitation } from "@/lib/store/types"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the store
const mockToggleCitationSelection = jest.fn()
const mockSelectIsSelected = jest.fn()

jest.mock("@/lib/store", () => ({
  useAppStore: () => ({
    toggleCitationSelection: mockToggleCitationSelection,
    selectIsSelected: mockSelectIsSelected,
  }),
}))

const mockCitation: MedicalCitation = {
  id: "CIT-TEST-001",
  title: "Test Citation Title",
  authors: ["Dr. Test Author", "Dr. Second Author"],
  journal: "Test Medical Journal",
  year: 2023,
  studyType: "RCT" as const,
  doi: "10.1000/test123",
  isSelected: false,
  relevanceScore: 95,
  url: "https://example.com/test",
  type: "clinical-study" as const,
  description: "Test citation description",
  addedAt: new Date(),
}

describe("CitationItem", () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    mockSelectIsSelected.mockReturnValue(false)
  })

  test("Click checkbox toggles once", async () => {
    render(<CitationItem citation={mockCitation} />)

    const checkbox = screen.getByRole("checkbox")
    await user.click(checkbox)

    expect(mockToggleCitationSelection).toHaveBeenCalledTimes(1)
    expect(mockToggleCitationSelection).toHaveBeenCalledWith("CIT-TEST-001")
  })

  test("Press Space toggles once", async () => {
    render(<CitationItem citation={mockCitation} />)

    const checkbox = screen.getByRole("checkbox")
    checkbox.focus()
    await user.keyboard(" ")

    expect(mockToggleCitationSelection).toHaveBeenCalledTimes(1)
    expect(mockToggleCitationSelection).toHaveBeenCalledWith("CIT-TEST-001")
  })

  test("Clicking DOI does not toggle", async () => {
    render(<CitationItem citation={mockCitation} />)

    const doiLink = screen.getByText(/DOI: 10.1000\/test123/)
    await user.click(doiLink)

    expect(mockToggleCitationSelection).not.toHaveBeenCalled()
  })

  test("Clicking row label toggles once", async () => {
    render(<CitationItem citation={mockCitation} />)

    // Click on the label (which wraps the entire row)
    const label = screen.getByLabelText(/Select citation: Test Citation Title/)
    await user.click(label)

    expect(mockToggleCitationSelection).toHaveBeenCalledTimes(1)
    expect(mockToggleCitationSelection).toHaveBeenCalledWith("CIT-TEST-001")
  })

  test("Checkbox reflects selected state from store", () => {
    // Test unselected state
    mockSelectIsSelected.mockReturnValue(false)
    const { rerender } = render(<CitationItem citation={mockCitation} />)

    let checkbox = screen.getByRole("checkbox") as HTMLInputElement
    expect(checkbox.checked).toBe(false)

    // Test selected state
    mockSelectIsSelected.mockReturnValue(true)
    rerender(<CitationItem citation={mockCitation} />)

    checkbox = screen.getByRole("checkbox") as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  test("Proper accessibility attributes", () => {
    render(<CitationItem citation={mockCitation} />)

    const checkbox = screen.getByRole("checkbox")
    const title = screen.getByText("Test Citation Title")

    // Check aria-labelledby connection
    expect(checkbox).toHaveAttribute("aria-labelledby", "citation-title-CIT-TEST-001")
    expect(title).toHaveAttribute("id", "citation-title-CIT-TEST-001")

    // Check label association
    const label = screen.getByLabelText(/Select citation: Test Citation Title/)
    expect(label).toBeInTheDocument()
  })

  test("Stable checkbox ID generation", () => {
    const { rerender } = render(<CitationItem citation={mockCitation} />)

    const checkbox1 = screen.getByRole("checkbox")
    const id1 = checkbox1.getAttribute("id")

    // Re-render and check ID stability
    rerender(<CitationItem citation={mockCitation} />)

    const checkbox2 = screen.getByRole("checkbox")
    const id2 = checkbox2.getAttribute("id")

    expect(id1).toBe(id2)
    expect(id1).toBe("citation-checkbox-CIT-TEST-001")
  })

  test("Search query highlighting works", () => {
    render(<CitationItem citation={mockCitation} searchQuery="Test" />)

    // Should highlight "Test" in title
    const highlightedText = screen.getByText("Test")
    expect(highlightedText.tagName).toBe("MARK")
    expect(highlightedText).toHaveClass("bg-yellow-200")
  })

  test("Visual state changes based on selection", () => {
    // Test unselected visual state
    mockSelectIsSelected.mockReturnValue(false)
    const { rerender } = render(<CitationItem citation={mockCitation} />)

    let label = screen.getByLabelText(/Select citation: Test Citation Title/)
    expect(label).toHaveClass("border-gray-200")
    expect(label).not.toHaveClass("border-[var(--accent-violet)]")

    // Test selected visual state
    mockSelectIsSelected.mockReturnValue(true)
    rerender(<CitationItem citation={mockCitation} />)

    label = screen.getByLabelText(/Deselect citation: Test Citation Title/)
    expect(label).toHaveClass("border-[var(--accent-violet)]")
    expect(label).toHaveClass("bg-[var(--accent-violet)]/5")
  })

  test("DOI link prevents event propagation", () => {
    render(<CitationItem citation={mockCitation} />)

    const doiLink = screen.getByText(/DOI: 10.1000\/test123/)

    // Create a spy for stopPropagation
    const stopPropagationSpy = jest.fn()
    const preventDefaultSpy = jest.fn()

    // Simulate click with event object
    fireEvent.click(doiLink, {
      stopPropagation: stopPropagationSpy,
      preventDefault: preventDefaultSpy,
    })

    // The component should call stopPropagation and preventDefault
    expect(mockToggleCitationSelection).not.toHaveBeenCalled()
  })
})
