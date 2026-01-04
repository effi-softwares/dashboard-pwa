"use client"

import { ChangeEvent, DragEvent, useRef, useState } from "react"

import { Image as ImageIcon, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type FileUploadProps = {
  accept?: string
  maxSize?: number // in bytes
  onFileSelect?: (file: File) => void
  disabled?: boolean
  className?: string
}

export function FileUpload({
  accept = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm",
  maxSize = 50 * 1024 * 1024, // 50MB
  onFileSelect,
  disabled,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`
    }
    const acceptedTypes = accept.split(",").map(t => t.trim())
    if (!acceptedTypes.some(type => file.type.match(new RegExp(type.replace("*", ".*"))))) {
      return "File type not allowed"
    }
    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setSelectedFile(null)
      return
    }
    setError(null)
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging && "border-primary bg-primary/5",
          !isDragging && "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          id="file-upload"
        />
        {!selectedFile ? (
          <>
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">
              Drag & drop or{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                browse
              </Button>
            </p>
            <p className="text-xs text-muted-foreground">
              Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </>
        ) : (
          <div className="flex w-full items-center gap-3">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

type FileUploadWithProgressProps = FileUploadProps & {
  progress?: number
  isUploading?: boolean
}

export function FileUploadWithProgress({
  progress,
  isUploading,
  ...props
}: FileUploadWithProgressProps) {
  return (
    <div className="space-y-2">
      <FileUpload {...props} disabled={props.disabled || isUploading} />
      {isUploading && progress !== undefined && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  )
}
