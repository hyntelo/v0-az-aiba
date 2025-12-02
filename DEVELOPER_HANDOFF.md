# Brief Assistant - Developer Handoff Documentation

**Version:** 1.0  
**Last Updated:** November 11 2025  
**Status:** Mock-Driven Prototype (Production-Ready Architecture)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Key Features](#key-features)
6. [State Management](#state-management)
7. [Mock Data](#mock-data)
8. [Internationalization](#internationalization)
9. [Setup Instructions](#setup-instructions)
10. [Transition to Production](#transition-to-production)
11. [Known Issues & Limitations](#known-issues--limitations)
12. [Testing](#testing)
13. [Deployment](#deployment)

---

## Overview

Brief Creator is a **mock-driven prototype** for pharma companies to create promotional and medical content briefs. The application demonstrates a complete happy path workflow where a Marketing Manager (Brief Creator role) can:

- Create new marketing briefs
- Generate AI-powered content for briefs
- Review and refine generated content
- Submit briefs for AI review
- Manage brand guidelines and preferences

**Critical Note:** All AI outputs, approvals, and data persistence are mocked. The prototype is designed to look and behave like a production application while running entirely on client-side mock data.

### Demo Flow (Happy Path)

1. Dashboard → View existing briefs and stats
2. Create New Brief → Fill form with campaign details
3. Generate with AI → Pre-scripted AI content appears
4. Review & Refine → Edit sections, regenerate, select references
5. Submit for AI Review → Immediate feedback with quality score
6. Accept & Submit → Brief status changes to "AI-Reviewed"
7. Return to Dashboard → See updated brief with new status

---

## Architecture

### Design Principles

1. **Mock-Driven with Production Structure** - All flows use mocked data but are architecturally ready for real APIs
2. **Component Modularity** - Small, single-responsibility components
3. **Server Components by Default** - Client components only when interactivity is required
4. **Type Safety** - Full TypeScript coverage with strict interfaces
5. **Separation of Concerns** - Clear boundaries between UI, state, and data layers

### Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────┐
│                    Next.js App                       │
│  ┌────────────────────────────────────────────────┐ │
│  │            App Router (Next.js 15)             │ │
│  │  • app/page.tsx (Dashboard)                    │ │
│  │  • app/brand-guidelines/page.tsx               │ │
│  │  • app/profile/page.tsx                        │ │
│  │  • app/settings/page.tsx                       │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │              Components Layer                   │ │
│  │  • app-shell.tsx (Navigation)                  │ │
│  │  • campaign-form.tsx (Brief Creation)          │ │
│  │  • brief-display.tsx (Brief Review)            │ │
│  │  • ai-generation-modal.tsx                     │ │
│  │  • ai-review-modal.tsx                         │ │
│  │  • citations-modal.tsx                         │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │           State Management (Zustand)           │ │
│  │  • briefSlice (Briefs & Brand Guidelines)      │ │
│  │  • userSlice (User Profile & Settings)         │ │
│  │  • navigationSlice (UI State)                  │ │
│  │  • systemSlice (Network, Storage, Notifs)      │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │              Mock Data Layer                    │ │
│  │  • lib/mock-data.ts (Citations, Demo Briefs)   │ │
│  │  • briefSlice initial state (Brand Guidelines) │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
\`\`\`

---

## Technology Stack

### Core Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library (Radix UI primitives)
- **Lucide React** - Icon library
- **Geist Font** - Typography

### State Management
- **Zustand** - Lightweight state management with Redux DevTools integration
- **Immer** - Immutable state updates

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### File Handling
- **React Dropzone** - Drag-and-drop file uploads
- **jsPDF** - PDF generation for exports

### Internationalization
- **Custom i18n Context** - English/Italian support via `lib/i18n.tsx` and `locales/*.json`

### Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package manager

---

## Project Structure

\`\`\`
brief-creator/
├── app/                           # Next.js App Router pages
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Dashboard (Homepage)
│   ├── brand-guidelines/
│   │   └── page.tsx               # Brand Guidelines management
│   ├── profile/
│   │   └── page.tsx               # User profile
│   ├── settings/
│   │   └── page.tsx               # User settings
│   └── globals.css                # Global styles & Tailwind config
│
├── components/                    # React components
│   ├── ui/                        # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ... (40+ components)
│   ├── app-shell.tsx              # Main layout with sidebar navigation
│   ├── campaign-form.tsx          # Brief creation form
│   ├── brief-display.tsx          # Brief review & editing interface
│   ├── ai-generation-modal.tsx    # AI content generation modal
│   ├── ai-review-modal.tsx        # AI review feedback modal
│   ├── citations-modal.tsx        # Reference management modal
│   ├── export-modal.tsx           # Brief export functionality
│   ├── file-upload.tsx            # File attachment component
│   ├── reference-manager.tsx      # Citation management
│   └── __tests__/                 # Component tests
│
├── lib/                           # Utilities and core logic
│   ├── store/                     # Zustand state management
│   │   ├── index.ts               # Store configuration
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── briefSlice.ts          # Briefs & brand guidelines state
│   │   ├── userSlice.ts           # User profile & settings state
│   │   ├── navigationSlice.ts     # Navigation UI state
│   │   └── systemSlice.ts         # System state (network, storage)
│   ├── mock-data.ts               # Mock citations & demo briefs
│   ├── utils.ts                   # Utility functions (cn, etc.)
│   ├── i18n.tsx                   # Internationalization context
│   └── file-utils.ts              # File handling utilities
│
├── locales/                       # Internationalization
│   ├── en.json                    # English translations
│   └── it.json                    # Italian translations
│
├── public/                        # Static assets
│   ├── astrazeneca-logo.svg
│   ├── logo.svg
│   ├── placeholder-*.{png,svg,jpg}
│   └── pdf-demo/export.pdf        # Example export
│
├── hooks/                         # Custom React hooks
│   ├── use-mobile.ts              # Mobile detection
│   └── use-toast.ts               # Toast notifications
│
├── next.config.mjs                # Next.js configuration
├── tailwind.config.js             # Tailwind CSS v4 config (in globals.css)
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest test configuration
├── package.json                   # Dependencies
├── prd.md                         # Product Requirements Document
└── DEVELOPER_HANDOFF.md           # This document
\`\`\`

---

## Key Features

### 1. Dashboard (app/page.tsx)

**What it does:**
- Displays statistics cards (Total Briefs, In Progress, AI-Reviewed, Avg. Completion Time)
- Shows recent briefs with status indicators
- Provides "Create New Brief" action button
- Displays notifications for brief status changes

**Key Components:**
- Stats cards with icons
- Brief list table with status badges
- Notification bell with unread count

**Mock Data:**
- `existingBriefs` from `lib/mock-data.ts`
- Stats calculated from brief statuses in store

### 2. Brief Creation (components/campaign-form.tsx)

**What it does:**
- Multi-step form for creating new briefs
- Collects campaign details (product, department, channels, etc.)
- Supports file attachments
- Triggers AI generation

**Form Fields:**
- Project Name
- Department
- Brand/Product (from Brand Guidelines)
- Expected Launch Date
- Specialty
- Request Summary
- Channels (multi-select)
- Additional Context
- File Attachments
- Communication Personality (from Brand Guidelines)
- Target Audience Preset (from Brand Guidelines)

**Mock Behavior:**
- "Generate Brief with AI" button shows loading state (2 seconds)
- Navigates to brief review with pre-generated content

### 3. AI Content Generation (components/ai-generation-modal.tsx)

**What it does:**
- Simulates AI content generation
- Shows progress indicators
- Pre-populated content appears after delay

**Mocked Sections:**
- Objectives
- Key Messages
- Tone of Voice
- Compliance Notes

**Data Source:**
- `demoBrief` from `lib/mock-data.ts`
- Content adjusted based on selected Brand Guidelines

### 4. Brief Review & Editing (components/brief-display.tsx)

**What it does:**
- Display generated brief content
- Section-by-section editing
- Selective regeneration per section
- Reference/citation management
- Export to PDF
- Status management (Draft → AI-Reviewed)

**Key Interactions:**
- Edit icon on each section → Opens textarea
- Regenerate icon → Shows loading, then new content
- Approve checkmark → Confirms section
- Add References → Opens citations modal
- Submit for AI Review → Opens AI review modal

**Section States:**
- `original` - Initial AI-generated content
- `regenerating` - Showing loading spinner
- `staged` - New content ready for approval
- `confirmed` - User accepted the content

### 5. AI Review System (components/ai-review-modal.tsx)

**What it does:**
- Simulates AI analysis of brief content
- Provides quality score (star rating 0-3)
- Lists positive feedback and suggestions
- Updates brief status to "AI-Reviewed"

**Mock Scoring:**
- 3 stars if completeness, messaging, and compliance all pass
- Scoring rules in `lib/store/types.ts`
- Pre-scripted feedback messages

### 6. Citation Management (components/citations-modal.tsx)

**What it does:**
- Displays searchable list of medical citations
- AI-powered auto-selection (mocked)
- Manual selection/deselection
- Filters by study type

**Mock Data:**
- `mockMedicalCitations` from `lib/mock-data.ts`
- Lokelma-specific citations pre-selected
- Relevance scores for sorting

### 7. Brand Guidelines (app/brand-guidelines/page.tsx)

**What it does:**
- Configure company guidelines
- Manage communication personalities
- Define target audience presets
- Set product-specific brand guidelines

**Read-Only for Brief Creator:**
- Only Admin users can edit (not in prototype scope)
- Brief Creators can view to understand AI behavior

**Data Structure:**
\`\`\`typescript
BrandGuidelinesSettings {
  companyGuidelines: { toneOfVoice, companyValues, dos, donts }
  communicationPersonalities: [{ id, name, description, guidelines }]
  targetAudiencePresets: [{ id, name, description, guidelines }]
  productBrandGuidelines: [{ id, productName, guidelines }]
}
\`\`\`

---

## State Management

### Zustand Store Architecture

The app uses **Zustand** with slice pattern for modular state management.

#### Store Setup (lib/store/index.ts)

\`\`\`typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useStore = create(
  devtools(
    immer((set, get) => ({
      ...createBriefSlice(set, get),
      ...createUserSlice(set, get),
      ...createNavigationSlice(set, get),
      ...createSystemSlice(set, get),
    }))
  )
)
\`\`\`

#### Brief Slice (lib/store/briefSlice.ts)

**Responsibilities:**
- Manage all briefs (list, current, draft)
- Handle brief CRUD operations
- Manage brand guidelines
- Track section states for editing/regeneration

**Key Actions:**
\`\`\`typescript
// Brief Management
createBrief(data: CampaignData)
saveBrief()
submitBrief()
deleteBrief(id: string)
setCurrentBrief(id: string)

// Content Management
updateGeneratedContent(field: string, value: string)
setSectionState(section: string, state: SectionState)
regenerateSection(section: string)

// References
addReference(ref: Reference)
removeReference(refId: string)
setSelectedCitations(ids: string[])

// Brand Guidelines
updateCompanyGuidelines(data: CompanyGuidelines)
addCommunicationPersonality(personality: CommunicationPersonality)
updateProductBrandGuidelines(id: string, guidelines: string)
\`\`\`

**Initial State:**
- 3 pre-seeded briefs from `existingBriefs`
- Complete brand guidelines for 6 products
- Empty draft brief

#### User Slice (lib/store/userSlice.ts)

**Responsibilities:**
- User profile data
- User settings (notifications, preferences, privacy)

**Key Actions:**
\`\`\`typescript
updateProfile(data: Partial<UserProfile>)
updateNotificationSettings(settings: NotificationSettings)
updatePreferences(preferences: Preferences)
\`\`\`

#### Navigation Slice (lib/store/navigationSlice.ts)

**Responsibilities:**
- Track current navigation section
- Manage UI-specific state

**Key Actions:**
\`\`\`typescript
setCurrentSection(section: string)
\`\`\`

#### System Slice (lib/store/systemSlice.ts)

**Responsibilities:**
- Network status
- Notifications
- Storage info

**Key Actions:**
\`\`\`typescript
addNotification(notification: Notification)
markNotificationAsRead(id: string)
setNetworkStatus(isOnline: boolean)
\`\`\`

---

## Mock Data

### Location: lib/mock-data.ts

#### Medical Citations (`mockMedicalCitations`)

**Purpose:** Pre-populated reference library for brief creation

**Structure:**
\`\`\`typescript
{
  id: string              // Unique identifier
  title: string           // Publication title
  authors: string[]       // Author list
  journal: string         // Journal name
  year: number           // Publication year
  studyType: StudyType   // RCT, Meta-analysis, etc.
  type: string           // "clinical-study"
  addedAt: Date
  isSelected: boolean    // Pre-selection status
  relevanceScore: number // For sorting (0-100)
}
\`\`\`

**Product-Specific Citations:**
- First 4 citations are Lokelma-specific (relevance: 85-95)
- Pre-selected when creating Lokelma briefs
- Other citations for different products/conditions

#### Demo Briefs (`existingBriefs`)

**Purpose:** Pre-seeded briefs to populate dashboard

**Count:** 3 briefs
1. CardioShield Plus (AI-Reviewed) - 5 days old
2. Wainzua (Draft) - 8 days old
3. RespiraClear (AI-Reviewed) - 12 days old

**Each includes:**
- Complete campaign data
- Generated content (objectives, key messages, tone, compliance)
- Status history
- Timestamps

#### Demo Brief Template (`demoBrief`)

**Purpose:** Default content for new brief generation

**Product:** Lokelma (Italian content)
- Objectives, key messages, tone, compliance notes
- Pre-selected communication personality and target audience
- Ready-to-use content for happy path demo

#### Mock Regenerated Content (`mockRegeneratedContent`)

**Purpose:** Alternative content shown when user clicks "regenerate section"

**Structure:** Object with keys matching brief sections:
\`\`\`typescript
{
  objectives: ["Alternative objective text..."],
  keyMessages: ["Alternative key messages..."],
  toneOfVoice: ["Alternative tone..."],
  complianceNotes: ["Alternative compliance..."]
}
\`\`\`

---

## Internationalization

### Implementation

**Context Provider:** `lib/i18n.tsx`
\`\`\`typescript
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const translations = currentLanguage === "en" ? en : it
  
  return (
    <LanguageContext.Provider value={{ t: translations, currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
\`\`\`

**Hook:** `useLanguage()`
\`\`\`typescript
const { t, currentLanguage, setLanguage } = useLanguage()
\`\`\`

### Translation Files

**English:** `locales/en.json`  
**Italian:** `locales/it.json`

**Usage in Components:**
\`\`\`typescript
<h1>{t.dashboard.title}</h1>
<Button>{t.common.save}</Button>
\`\`\`

### Supported Languages
- English (en) - Default
- Italian (it)

### Translation Coverage
- All UI labels and buttons
- Form field labels and placeholders
- Validation messages
- Status labels
- Navigation items
- Settings labels

**Note:** Mock content (brief objectives, key messages) is pre-translated in mock-data.ts

---

## Setup Instructions

### Prerequisites

- **Node.js:** v18+ (recommended v20 LTS)
- **Package Manager:** pnpm (recommended), npm, or yarn
- **IDE:** VS Code with TypeScript and Tailwind CSS extensions

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd brief-creator

# Install dependencies
pnpm install
# or
npm install

# Run development server
pnpm dev
# or
npm run dev

# Open browser
http://localhost:3000
\`\`\`

### Environment Variables

**Not required for prototype.** All data is mocked and runs client-side.

For production, you will need:
\`\`\`env
# API Endpoints
NEXT_PUBLIC_API_URL=https://api.yourcompany.com
API_SECRET_KEY=your_secret_key

# AI Service
OPENAI_API_KEY=your_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/briefcreator

# Authentication
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000

# File Storage
AWS_S3_BUCKET=your_s3_bucket
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
\`\`\`

### Build for Production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

### Running Tests

\`\`\`bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
\`\`\`

---

## Transition to Production

This section outlines the steps to convert the mock-driven prototype into a production application.

### 1. Backend API Integration

#### Brief Management API

**Endpoints Needed:**
\`\`\`
POST   /api/briefs                # Create new brief
GET    /api/briefs                # List all briefs
GET    /api/briefs/:id            # Get single brief
PUT    /api/briefs/:id            # Update brief
DELETE /api/briefs/:id            # Delete brief
POST   /api/briefs/:id/submit     # Submit for review
GET    /api/briefs/:id/history    # Get status history
\`\`\`

**Replace Mock Functions:**

**Current (Mock):**
\`\`\`typescript
// lib/store/briefSlice.ts
createBrief: (data: CampaignData) => {
  const newBrief = {
    id: `brief-${Date.now()}`,
    ...data,
    createdAt: new Date(),
  }
  set(state => { state.briefs.push(newBrief) })
}
\`\`\`

**Production:**
\`\`\`typescript
createBrief: async (data: CampaignData) => {
  try {
    const response = await fetch('/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const newBrief = await response.json()
    set(state => { state.briefs.push(newBrief) })
    return newBrief
  } catch (error) {
    console.error('Failed to create brief:', error)
    throw error
  }
}
\`\`\`

#### AI Generation API

**Endpoints Needed:**
\`\`\`
POST   /api/ai/generate-brief     # Generate brief content
POST   /api/ai/regenerate-section # Regenerate specific section
POST   /api/ai/review-brief       # AI review analysis
POST   /api/ai/select-citations   # AI citation selection
\`\`\`

**Replace Mock in:**
- `components/ai-generation-modal.tsx`
- `components/brief-display.tsx` (regenerate functions)
- `components/ai-review-modal.tsx`
- `components/citations-modal.tsx` (AI selection)

**Example API Call:**
\`\`\`typescript
// Replace setTimeout mock with real API
const generateBriefContent = async (campaignData: CampaignData) => {
  const response = await fetch('/api/ai/generate-brief', {
    method: 'POST',
    body: JSON.stringify({
      campaignData,
      brandGuidelines: get().brandGuidelines,
      communicationPersonalityId: campaignData.communicationPersonalityId,
      targetAudiencePresetId: campaignData.targetAudiencePresetId,
    })
  })
  return await response.json()
}
\`\`\`

#### File Upload API

**Endpoints Needed:**
\`\`\`
POST   /api/files/upload          # Upload file
GET    /api/files/:id             # Get file
DELETE /api/files/:id             # Delete file
\`\`\`

**Replace Mock in:**
- `components/file-upload.tsx`

**Current:** Files stored as Base64 in memory  
**Production:** Upload to S3/Azure Blob, store URL in database

### 2. Database Schema

**Recommended Database:** PostgreSQL

**Tables Needed:**

\`\`\`sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'Brief Creator', 'Admin', 'Strategist'
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Briefs
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'ai-reviewed', 'submitted', 'approved'
  campaign_data JSONB NOT NULL,
  generated_content JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW(),
  last_saved_at TIMESTAMP DEFAULT NOW(),
  is_read_only BOOLEAN DEFAULT false
);

-- Brief References
CREATE TABLE brief_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  citation_id UUID REFERENCES citations(id),
  added_at TIMESTAMP DEFAULT NOW()
);

-- Medical Citations
CREATE TABLE citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  journal VARCHAR(255),
  year INTEGER,
  study_type VARCHAR(50),
  type VARCHAR(50),
  description TEXT,
  relevance_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Status History
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW(),
  comment TEXT
);

-- Brand Guidelines
CREATE TABLE brand_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'company', 'personality', 'audience', 'product'
  name VARCHAR(255),
  guidelines JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- File Attachments
CREATE TABLE file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  storage_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  brief_id UUID REFERENCES briefs(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### 3. Authentication

**Recommended:** NextAuth.js with OAuth providers

**Setup:**
\`\`\`bash
pnpm add next-auth
\`\`\`

**Implementation:**
- Create `app/api/auth/[...nextauth]/route.ts`
- Add `SESSION_SECRET` to environment variables
- Wrap app with `SessionProvider`
- Protect routes with `useSession()` hook
- Add sign-in/sign-out UI

**Protected Routes:**
- All pages except login should require authentication
- Brief Creator role enforcement on brief creation
- Admin role enforcement on Brand Guidelines editing

### 4. Real-Time Features (Optional)

**Technology:** WebSockets or Server-Sent Events

**Use Cases:**
- Collaborative editing (multiple users editing same brief)
- Real-time notifications
- Live AI generation progress

### 5. File Storage

**Recommended:** AWS S3 or Azure Blob Storage

**Current:** Files stored as Base64 in state  
**Production:** 
1. Upload files to cloud storage
2. Store file URLs in database
3. Generate pre-signed URLs for secure access

### 6. Error Handling

**Add Throughout App:**
\`\`\`typescript
try {
  const response = await fetch('/api/briefs')
  if (!response.ok) throw new Error('Failed to fetch briefs')
  const data = await response.json()
  set({ briefs: data })
} catch (error) {
  console.error('Error:', error)
  toast.error('Failed to load briefs. Please try again.')
}
\`\`\`

**Error Boundaries:**
- Add React Error Boundaries around major sections
- Create `app/error.tsx` for global error handling

### 7. Loading States

**Current:** Mock 2-second delays  
**Production:** Show loading states during real API calls

**Example:**
\`\`\`typescript
const [isLoading, setIsLoading] = useState(false)

const handleGenerate = async () => {
  setIsLoading(true)
  try {
    await generateBriefContent(formData)
  } finally {
    setIsLoading(false)
  }
}
\`\`\`

### 8. Validation & Security

**Add:**
- Server-side validation for all API endpoints
- Rate limiting on AI generation endpoints
- Input sanitization to prevent XSS
- CSRF protection
- API authentication tokens
- Role-based access control (RBAC)

### 9. Analytics & Monitoring

**Recommended Tools:**
- Vercel Analytics (already integrated)
- Sentry for error tracking
- LogRocket for session replay
- PostHog for product analytics

### 10. Performance Optimization

**Production Checklist:**
- Enable Next.js image optimization
- Implement lazy loading for heavy components
- Add React.memo() for expensive renders
- Consider server-side rendering for dashboard
- Add caching headers for API responses
- Implement database query optimization

---

## Known Issues & Limitations

### Prototype Limitations

1. **No Data Persistence**
   - All data resets on page refresh
   - No localStorage or sessionStorage implemented
   - Brief creation does not survive page reload

2. **Mock AI Outputs**
   - AI generation always returns same content
   - No actual AI model integration
   - Regeneration cycles through pre-defined alternatives

3. **Single User Mode**
   - No authentication system
   - Fixed user profile (Sarah Chen)
   - No multi-user or role-based access control

4. **Simplified Workflows**
   - No approval workflow (Strategist review)
   - No collaborative editing
   - No version history beyond status changes

5. **Limited Error Handling**
   - Assumes happy path always succeeds
   - No network error handling
   - No validation beyond form-level

6. **Fixed Demo Data**
   - Only 3 pre-seeded briefs
   - Citations library is static
   - Brand guidelines are pre-populated

7. **File Upload Limitations**
   - Files stored in memory only
   - No file type validation beyond accept attribute
   - No file size limits enforced

8. **No Real-Time Features**
   - Notifications appear only on manual navigation
   - No live updates or push notifications
   - No concurrent editing support

### Browser Compatibility

**Tested On:**
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

**Known Issues:**
- File drag-and-drop may not work in older browsers
- Some Tailwind CSS v4 features require modern browsers

### Known CSS Issue

**tw-animate-css Package:**
There is a known issue with the `tw-animate-css` package causing a CSS parsing error:
\`\`\`
Error: Missing closing } at @utility direction-*
\`\`\`

**Temporary Fix:** Package has been removed from dependencies. If you need animation utilities, use `tailwindcss-animate` instead.

---

## Testing

### Test Structure

**Location:** `components/__tests__/`

**Test Files:**
- `ai-review-modal.test.tsx` - AI review modal interactions
- `brief-display.test.tsx` - Brief display and editing
- `briefSlice.spec.ts` - State management logic
- `citation-item.rtl.spec.tsx` - Citation rendering
- `citation-selection.test.tsx` - Citation selection logic

### Running Tests

\`\`\`bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage
\`\`\`

### Test Coverage

**Current Coverage:**
- Critical user flows: ✅ Covered
- State management: ✅ Covered
- Component rendering: ✅ Covered
- API integration: ❌ Not covered (no real APIs)

### Writing New Tests

**Example:**
\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { CampaignForm } from '@/components/campaign-form'

describe('CampaignForm', () => {
  it('should render form fields', () => {
    render(<CampaignForm />)
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    render(<CampaignForm />)
    fireEvent.click(screen.getByText(/generate/i))
    expect(await screen.findByText(/required/i)).toBeInTheDocument()
  })
})
\`\`\`

---

## Deployment

### Vercel Deployment (Recommended)

**Current:** App is deployed to Vercel automatically via GitHub integration

**Manual Deployment:**
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
\`\`\`

**Environment Variables:**
- Set in Vercel dashboard under Project Settings → Environment Variables
- Separate values for Development, Preview, Production

### Other Deployment Options

**Docker:**
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

**Build Command:** `npm run build`  
**Start Command:** `npm start`  
**Port:** 3000

---

## Contact & Support

**Product Owner:** [Name]  
**Tech Lead:** [Name]  
**Design Lead:** [Name]

**Documentation Updates:**
When making significant changes to the codebase, please update this document to reflect:
- New features or components
- Changed data structures
- Updated API endpoints
- New dependencies

---

## Appendix

### TypeScript Interfaces Quick Reference

**Full definitions in:** `lib/store/types.ts`

\`\`\`typescript
interface BriefData {
  id: string
  title: string
  campaignData: CampaignData
  generatedContent?: GeneratedContent
  references: Reference[]
  createdAt: Date
  status: BriefStatus
  lastModified: Date
  statusHistory: StatusChange[]
  isReadOnly: boolean
  aIFeedback?: AIFeedback
}

interface CampaignData {
  projectName: string
  department: string
  brand: string
  expectedLaunchDate: string
  specialty: string
  requestSummary: string
  channels: string[]
  additionalContext: string
  attachments: AttachmentFile[]
  communicationPersonalityId?: string
  targetAudiencePresetId?: string
}

interface GeneratedContent {
  objectives: string
  keyMessages: string
  toneOfVoice: string
  complianceNotes: string
}

interface BrandGuidelinesSettings {
  companyGuidelines: CompanyGuidelines
  communicationPersonalities: CommunicationPersonality[]
  targetAudiencePresets: TargetAudiencePreset[]
  productBrandGuidelines: ProductBrandGuidelines[]
}
\`\`\`

### Useful Commands

\`\`\`bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report

# Package Management
pnpm install          # Install dependencies
pnpm add <package>    # Add new package
pnpm remove <package> # Remove package
pnpm update           # Update all packages

# Deployment
vercel                # Deploy to Vercel
vercel --prod         # Production deployment
\`\`\`

### Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Zustand:** https://zustand-demo.pmnd.rs
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev

---

**End of Developer Handoff Documentation**
