import jest from "jest"
import "@testing-library/jest-dom"

// Mock console.info to avoid noise in tests
global.console = {
  ...console,
  info: jest.fn(),
}

// Mock window.location for tests that need it
Object.defineProperty(window, "location", {
  value: {
    origin: "http://localhost:3000",
  },
  writable: true,
})
