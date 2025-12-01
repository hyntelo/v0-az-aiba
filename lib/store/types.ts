export interface CampaignData {
  projectName: string
  brand: string
  therapeuticArea: string
  expectedLaunchDate: string
  specialty: string
  requestSummary: string
  channels: string[]
  additionalContext: string
  attachments: AttachmentFile[] // Added attachments field to store uploaded files
  communicationPersonalityId?: string
  targetAudiencePresetId?: string
}

export interface Asset {
  id: string
  name: string
  type: "image" | "video" | "document"
  thumbnail: string
  size: string
  lastModified: string
}

export interface Reference {
  id: string
  title: string
  url: string
  type: "clinical-study" | "regulatory" | "competitor" | "internal"
  description: string
  addedAt: Date
}

export type AiSelectionMode = "merge" | "replace"

export interface MedicalCitation extends Reference {
  authors: string[]
  journal: string
  year: number
  studyType: "RCT" | "Meta-analysis" | "Clinical Trial" | "Systematic Review" | "Case Study"
  isSelected: boolean // @deprecated - use store selectedCitationIds instead
  relevanceScore: number // for deterministic AI sorting
}

export type StudyType = "RCT" | "Meta-analysis" | "Clinical Trial" | "Systematic Review" | "Case Study"

export type BriefStatus = "draft" | "ai-reviewed"

export interface StatusChange {
  id: string
  briefId: string
  fromStatus: BriefStatus | null
  toStatus: BriefStatus
  changedBy: string
  changedAt: Date
  comment?: string
}

export interface BriefData {
  id: string
  title: string
  campaignData: CampaignData
  generatedContent?: {
    objectives: string
    keyMessages: string
    toneOfVoice: string
    complianceNotes: string
  }
  references: Reference[]
  createdAt: Date
  status: BriefStatus
  lastModified: Date
  lastSavedAt: Date
  statusHistory: StatusChange[]
  isReadOnly: boolean
  aIFeedback?: AIFeedback // Added AIFeedback interface for star-based scoring system
}

export interface UserProfile {
  id: string
  name: string
  email: string
  department: string
  role: "Brief Creator"
  title: string
  phone: string
  location: string
  bio: string
  avatar: string
}

export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    briefSubmitted: boolean
    briefApproved: boolean
    briefReturned: boolean
    deadlineReminders: boolean
    weeklyDigest: boolean
  }
  preferences: {
    language: string
    timezone: string
    theme: string
    defaultTemplate: string
    autoSave: boolean
    showTips: boolean
  }
  privacy: {
    profileVisibility: string
    activityTracking: boolean
    dataCollection: boolean
  }
}

export interface NetworkStatus {
  isOnline: boolean
  saveQueue: Array<{ briefId: string; data: BriefData; timestamp: Date }>
  retryAttempts: number
}

export interface StorageInfo {
  usage: number
  quota: number
  isNearLimit: boolean
}

export interface Notification {
  id: string
  type: "brief-submitted" | "brief-approved" | "brief-returned" | "deadline-approaching" | "review-required"
  title: string
  message: string
  briefId?: string
  briefTitle?: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

export type IconName = "LayoutDashboard" | "FileText" | "Template" | "User" | "Settings"

export interface NavigationItem {
  id: string
  label: string
  icon: IconName
}

export interface SectionState {
  state: "original" | "regenerating" | "staged" | "confirmed"
  originalContent?: string
  stagedContent?: string
}

export interface CompanyGuidelines {
  toneOfVoice: string
  companyValues: string
  dos: string
  donts: string
}

export interface CommunicationPersonality {
  id: string
  name: string
  description: string
  guidelines: string
}

export interface TargetAudiencePreset {
  id: string
  name: string
  description: string
  guidelines: string
}

export interface ProductBrandGuidelines {
  id: string
  productName: string
  guidelines: string
}

export interface BrandGuidelinesSettings {
  companyGuidelines: CompanyGuidelines
  communicationPersonalities: CommunicationPersonality[]
  targetAudiencePresets: TargetAudiencePreset[]
  productBrandGuidelines: ProductBrandGuidelines[]
}

export interface BrandGuidelinesSnapshots {
  companyGuidelines?: CompanyGuidelines
  communicationPersonalities?: Record<string, CommunicationPersonality>
  targetAudiencePresets?: Record<string, TargetAudiencePreset>
  productBrandGuidelines?: Record<string, ProductBrandGuidelines>
}

export interface AttachmentFile {
  id: string
  name: string
  size: number
  type: string
  lastModified: number
  data?: string // Base64 encoded data for small files
  url?: string // Blob URL for larger files
}

export interface AIFeedback {
  overallStars: number // 0–3 (derived)
  completeness: boolean
  messaging: boolean
  compliance: boolean
  suggestions: string[]
  positivePoints: string[] // unused by UI - kept for data compatibility
}

export type PassRule = (v?: unknown) => boolean

export const scoringRules = {
  completeness: (() => true) as PassRule, // default pass for mocks
  messaging: (() => true) as PassRule,
  compliance: (() => true) as PassRule,
}

export const calcStars = (f: Pick<AIFeedback, "completeness" | "messaging" | "compliance">) =>
  [f.completeness, f.messaging, f.compliance].filter(Boolean).length
