"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type AttachmentFile,
  validateFile,
  validateTotalSize,
  processFile,
  formatFileSize,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
} from "@/lib/file-utils"

interface FileUploadProps {
  attachments: AttachmentFile[]
  onAttachmentAdd: (attachment: AttachmentFile) => void
  onAttachmentRemove: (attachmentId: string) => void
  className?: string
}

export function FileUpload({ attachments, onAttachmentAdd, onAttachmentRemove, className }: FileUploadProps) {
  const [uploading, setUploading] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setErrors([])

      // Validate total size
      const totalValidation = validateTotalSize(attachments, acceptedFiles)
      if (!totalValidation.valid) {
        setErrors([totalValidation.error!])
        return
      }

      // Process each file
      const newUploading: string[] = []
      const newErrors: string[] = []

      for (const file of acceptedFiles) {
        const validation = validateFile(file)
        if (!validation.valid) {
          newErrors.push(`${file.name}: ${validation.error}`)
          continue
        }

        const fileId = `uploading-${Date.now()}-${Math.random()}`
        newUploading.push(fileId)
        setUploading((prev) => [...prev, fileId])

        try {
          // Simulate upload progress
          await new Promise((resolve) => setTimeout(resolve, 500))

          const attachment = await processFile(file)
          onAttachmentAdd(attachment)

          setUploading((prev) => prev.filter((id) => id !== fileId))
        } catch (error) {
          newErrors.push(`${file.name}: Failed to process file`)
          setUploading((prev) => prev.filter((id) => id !== fileId))
        }
      }

      if (newErrors.length > 0) {
        setErrors(newErrors)
      }
    },
    [attachments, onAttachmentAdd],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed cursor-pointer transition-colors hover:border-accent-violet/50",
          isDragActive ? "border-accent-violet bg-accent-violet/5" : "border-border",
        )}
      >
        <CardContent className="p-6 text-center">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-accent-violet/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-accent-violet" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragActive ? "Drop files here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, XLS, PPT, Images, ZIP (max {formatFileSize(MAX_FILE_SIZE)} each)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Uploading Files */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((fileId) => (
            <div key={fileId} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <File className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Uploading...</p>
                <Progress value={75} className="h-1 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
