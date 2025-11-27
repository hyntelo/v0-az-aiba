"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Upload, File, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type AttachmentFile,
  validateFile,
  validateTotalSize,
  processFile,
  formatFileSize,
  getFileIcon,
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

  const totalSize = attachments.reduce((total, file) => total + file.size, 0)
  const usagePercentage = (totalSize / MAX_TOTAL_SIZE) * 100

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

      {/* Storage Usage */}
      {(attachments.length > 0 || uploading.length > 0) && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Storage used</span>
            <span>
              {formatFileSize(totalSize)} / {formatFileSize(MAX_TOTAL_SIZE)}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
      )}

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

      {/* Uploaded Files */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Attached Files ({attachments.length})</h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors"
              >
                <span className="text-lg">{getFileIcon(attachment.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)} • {new Date(attachment.lastModified).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAttachmentRemove(attachment.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
