import { render, screen, fireEvent } from "@testing-library/react"
import { CitationItem } from "../citation-item"
import { useAppStore } from "@/lib/store"
import jest from "jest" // Import jest to declare the variable

// Mock the store
jest.mock("@/lib/store", () => ({
  useAppStore: jest.fn(),
}))

const mockCitation = {
  id: "test-citation-1",
  title: "Test Citation Title",
  authors: ["Author One", "Author Two"],
  journal: "Test Journal",
  year: 2023,
  doi: "10.1000/test.doi",
  studyType: "RCT" as const,
  relevanceScore: 0.95,
}

describe("Citation Selection", () => {
  const mockToggleSelection = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAppStore as jest.Mock).mockReturnValue({
      citations: {
        selectedCitationIds: [],
      },
      toggleCitationSelection: mockToggleSelection,
    })
  })

  test("clicking checkbox once selects citation", () => {
    render(<CitationItem citation={mockCitation} isSelected={false} onToggleSelection={mockToggleSelection} />)

    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)

    expect(mockToggleSelection).toHaveBeenCalledTimes(1)
    expect(mockToggleSelection).toHaveBeenCalledWith("test-citation-1")
  })

  test("clicking checkbox again deselects citation", () => {
    render(<CitationItem citation={mockCitation} isSelected={true} onToggleSelection={mockToggleSelection} />)

    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)

    expect(mockToggleSelection).toHaveBeenCalledTimes(1)
    expect(mockToggleSelection).toHaveBeenCalledWith("test-citation-1")
  })

  test("pressing Space on focused checkbox toggles once", () => {
    render(<CitationItem citation={mockCitation} isSelected={false} onToggleSelection={mockToggleSelection} />)

    const checkbox = screen.getByRole("checkbox")
    checkbox.focus()
    fireEvent.keyDown(checkbox, { key: " ", code: "Space" })

    expect(mockToggleSelection).toHaveBeenCalledTimes(1)
    expect(mockToggleSelection).toHaveBeenCalledWith("test-citation-1")
  })

  test("clicking the row toggles once", () => {
    render(<CitationItem citation={mockCitation} isSelected={false} onToggleSelection={mockToggleSelection} />)

    const label = screen.getByLabelText(/select citation/i)
    fireEvent.click(label)

    expect(mockToggleSelection).toHaveBeenCalledTimes(1)
    expect(mockToggleSelection).toHaveBeenCalledWith("test-citation-1")
  })

  test("clicking the DOI link does not toggle", () => {
    render(<CitationItem citation={mockCitation} isSelected={false} onToggleSelection={mockToggleSelection} />)

    const doiLink = screen.getByText(/DOI: 10.1000\/test.doi/i)
    fireEvent.click(doiLink)

    expect(mockToggleSelection).not.toHaveBeenCalled()
  })
})
