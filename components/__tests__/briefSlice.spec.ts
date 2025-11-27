import { createBriefSlice } from "@/lib/store/briefSlice"
import type { BriefSlice } from "@/lib/store/briefSlice"
import jest from "jest" // Declare the jest variable

// Mock the dependencies
jest.mock("@/lib/mock-data", () => ({
  demoBrief: { generatedContent: {} },
  mockRegeneratedContent: {},
  mockPromptSuggestions: {},
  mockMedicalCitations: [
    {
      id: "CIT-001",
      title: "Test Citation 1",
      authors: ["Author 1"],
      journal: "Test Journal",
      year: 2023,
      studyType: "RCT" as const,
      doi: "10.1000/test1",
      isSelected: false,
      relevanceScore: 95,
      url: "https://example.com/1",
      type: "clinical-study" as const,
      description: "Test citation 1",
      addedAt: new Date(),
    },
    {
      id: "CIT-002",
      title: "Test Citation 2",
      authors: ["Author 2"],
      journal: "Test Journal",
      year: 2023,
      studyType: "Meta-analysis" as const,
      doi: "10.1000/test2",
      isSelected: false,
      relevanceScore: 90,
      url: "https://example.com/2",
      type: "clinical-study" as const,
      description: "Test citation 2",
      addedAt: new Date(),
    },
    {
      id: "CIT-IMMU-001",
      title: "Immunotherapy Citation",
      authors: ["Immuno Author"],
      journal: "Immuno Journal",
      year: 2023,
      studyType: "Clinical Trial" as const,
      doi: "10.1000/immuno1",
      isSelected: false,
      relevanceScore: 98,
      url: "https://example.com/immuno1",
      type: "clinical-study" as const,
      description: "Immunotherapy citation",
      addedAt: new Date(),
    },
  ],
}))

describe("BriefSlice Citation Selection", () => {
  let store: BriefSlice
  let setState: jest.Mock
  let getState: jest.Mock

  beforeEach(() => {
    setState = jest.fn()
    getState = jest.fn()

    // Create the slice with mocked set/get functions
    store = createBriefSlice(setState, getState, {})

    // Mock getState to return current store state
    getState.mockImplementation(() => store)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("Manual Selection Preservation", () => {
    test("Manual select one → run AI (merge) → union preserved", async () => {
      // Manually select one citation
      store.toggleCitationSelection("CIT-001")
      expect(setState).toHaveBeenCalledWith(expect.any(Function))

      // Simulate the state update
      store.citations.selectedCitationIds = ["CIT-001"]

      // Set mode to merge (default)
      store.setAiSelectionMode("merge")

      // Run AI search
      await store.searchCitationsWithAI({ topic: "test", id: "test-brief" })

      // Verify merge behavior - should include both manual and AI selections
      const finalCall = setState.mock.calls[setState.mock.calls.length - 1][0]
      const finalState = finalCall(store)

      expect(finalState.citations.selectedCitationIds).toContain("CIT-001") // Manual selection preserved
      expect(finalState.citations.selectedCitationIds.length).toBeGreaterThan(1) // AI selections added
    })

    test("Run AI twice (merge) → no duplicates, count stable", async () => {
      // Set mode to merge
      store.setAiSelectionMode("merge")

      // First AI run
      await store.searchCitationsWithAI({ topic: "test", id: "test-brief" })

      // Simulate first AI result
      store.citations.selectedCitationIds = ["CIT-001", "CIT-002"]

      // Second AI run with same context
      await store.searchCitationsWithAI({ topic: "test", id: "test-brief" })

      // Verify no duplicates and stable count
      const finalCall = setState.mock.calls[setState.mock.calls.length - 1][0]
      const finalState = finalCall(store)

      const uniqueIds = Array.from(new Set(finalState.citations.selectedCitationIds))
      expect(finalState.citations.selectedCitationIds).toEqual(uniqueIds)
      expect(finalState.citations.selectedCitationIds.length).toBe(2) // Should remain stable
    })

    test("Set mode to replace → selection equals AI picks only", async () => {
      // Manually select one citation first
      store.toggleCitationSelection("CIT-001")
      store.citations.selectedCitationIds = ["CIT-001"]

      // Set mode to replace
      store.setAiSelectionMode("replace")

      // Run AI search
      await store.searchCitationsWithAI({ topic: "test", id: "test-brief" })

      // Verify replace behavior - should only have AI selections
      const finalCall = setState.mock.calls[setState.mock.calls.length - 1][0]
      const finalState = finalCall(store)

      expect(finalState.citations.selectedCitationIds).not.toContain("CIT-001") // Manual selection replaced
      expect(finalState.citations.selectedCitationIds.length).toBeGreaterThan(0) // Has AI selections
    })

    test("After AI, manual deselect persists", async () => {
      // Run AI search first
      store.setAiSelectionMode("merge")
      await store.searchCitationsWithAI({ topic: "test", id: "test-brief" })

      // Simulate AI result
      store.citations.selectedCitationIds = ["CIT-001", "CIT-002"]

      // Manually deselect one
      store.toggleCitationSelection("CIT-001")

      // Verify deselection persists
      const finalCall = setState.mock.calls[setState.mock.calls.length - 1][0]
      const finalState = finalCall(store)

      expect(finalState.citations.selectedCitationIds).not.toContain("CIT-001")
      expect(finalState.citations.selectedCitationIds).toContain("CIT-002")
    })
  })

  describe("Toggle Citation Selection", () => {
    test("toggleCitationSelection is idempotent", () => {
      // Start with empty selection
      store.citations.selectedCitationIds = []

      // Select citation
      store.toggleCitationSelection("CIT-001")
      let updateCall = setState.mock.calls[setState.mock.calls.length - 1][0]
      let newState = updateCall(store)
      expect(newState.citations.selectedCitationIds).toContain("CIT-001")

      // Update store state
      store.citations.selectedCitationIds = newState.citations.selectedCitationIds

      // Deselect same citation
      store.toggleCitationSelection("CIT-001")
      updateCall = setState.mock.calls[setState.mock.calls.length - 1][0]
      newState = updateCall(store)
      expect(newState.citations.selectedCitationIds).not.toContain("CIT-001")
    })

    test("array operations maintain immutability", () => {
      const originalArray = ["CIT-001"]
      store.citations.selectedCitationIds = originalArray

      store.toggleCitationSelection("CIT-002")

      const updateCall = setState.mock.calls[setState.mock.calls.length - 1][0]
      const newState = updateCall(store)

      // Original array should not be mutated
      expect(originalArray).toEqual(["CIT-001"])
      // New array should have both items
      expect(newState.citations.selectedCitationIds).toEqual(["CIT-001", "CIT-002"])
    })
  })

  describe("Selectors", () => {
    test("selectIsSelected returns correct boolean", () => {
      store.citations.selectedCitationIds = ["CIT-001", "CIT-002"]

      expect(store.selectIsSelected("CIT-001")).toBe(true)
      expect(store.selectIsSelected("CIT-002")).toBe(true)
      expect(store.selectIsSelected("CIT-003")).toBe(false)
    })

    test("selectSelectionCount returns correct count", () => {
      store.citations.selectedCitationIds = ["CIT-001", "CIT-002", "CIT-003"]

      expect(store.selectSelectionCount()).toBe(3)

      store.citations.selectedCitationIds = []
      expect(store.selectSelectionCount()).toBe(0)
    })
  })

  describe("Logging", () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "info").mockImplementation()
    })

    afterEach(() => {
      consoleSpy.mockRestore()
    })

    test("AI merge action logs correctly", async () => {
      store.citations.selectedCitationIds = ["CIT-001"]
      store.setAiSelectionMode("merge")

      await store.searchCitationsWithAI({ topic: "test topic", id: "test-brief-123" })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "ai_merge",
          prevCount: 1,
          briefId: "test-brief-123",
          query: "test topic",
        }),
      )
    })

    test("AI replace action logs correctly", async () => {
      store.citations.selectedCitationIds = ["CIT-001", "CIT-002"]
      store.setAiSelectionMode("replace")

      await store.searchCitationsWithAI({ topic: "test topic", id: "test-brief-456" })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "ai_replace",
          prevCount: 2,
          briefId: "test-brief-456",
          query: "test topic",
        }),
      )
    })
  })
})
