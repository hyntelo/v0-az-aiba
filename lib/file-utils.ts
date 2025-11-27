export interface AttachmentFile {
  id: string
  name: string
  size: number
  type: string
  lastModified: number
  data?: string // Base64 encoded data for small files
  url?: string // Blob URL for larger files
}

export const ALLOWED_FILE_TYPES = {
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
  images: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  archives: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"],
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB total

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(type: string): string {
  if (ALLOWED_FILE_TYPES.images.includes(type)) return "🖼️"
  if (type.includes("pdf")) return "📄"
  if (type.includes("word") || type.includes("document")) return "📝"
  if (type.includes("excel") || type.includes("sheet")) return "📊"
  if (type.includes("powerpoint") || type.includes("presentation")) return "📋"
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "🗜️"
  if (type.includes("text")) return "📃"
  return "📎"
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit` }
  }

  // Check file type
  const allAllowedTypes = [
    ...ALLOWED_FILE_TYPES.documents,
    ...ALLOWED_FILE_TYPES.images,
    ...ALLOWED_FILE_TYPES.archives,
  ]

  if (!allAllowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not supported" }
  }

  return { valid: true }
}

export function validateTotalSize(files: AttachmentFile[], newFiles: File[]): { valid: boolean; error?: string } {
  const currentSize = files.reduce((total, file) => total + file.size, 0)
  const newSize = newFiles.reduce((total, file) => total + file.size, 0)

  if (currentSize + newSize > MAX_TOTAL_SIZE) {
    return { valid: false, error: `Total file size exceeds ${formatFileSize(MAX_TOTAL_SIZE)} limit` }
  }

  return { valid: true }
}

export async function processFile(file: File): Promise<AttachmentFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const attachment: AttachmentFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        data: reader.result as string,
      }
      resolve(attachment)
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}
