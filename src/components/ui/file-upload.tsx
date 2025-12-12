"use client";

import * as React from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { Upload, X, File, Image, FileText, Film, Music } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
}

function FileUpload({
  onFilesChange,
  accept,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
  className,
  multiple = false,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        setError(firstError.message);
        return;
      }

      const newFiles = multiple
        ? [...files, ...acceptedFiles].slice(0, maxFiles)
        : acceptedFiles.slice(0, 1);

      setFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [files, maxFiles, multiple, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? maxFiles : 1,
    maxSize,
    disabled,
    multiple,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Film className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "cursor-pointer"
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            "h-10 w-10 mb-4",
            isDragActive ? "text-primary" : "text-muted-foreground"
          )}
        />
        <p className="text-sm text-muted-foreground text-center">
          {isDragActive ? (
            "Drop the files here..."
          ) : (
            <>
              Drag & drop files here, or{" "}
              <span className="text-primary font-medium">browse</span>
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Max {formatFileSize(maxSize)} per file
          {multiple && ` · Up to ${maxFiles} files`}
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Image upload with preview
interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  previewClassName?: string;
}

function ImageUpload({
  onImageChange,
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  className,
  previewClassName,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        setError(firstError.message);
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageChange?.(file);
      }
    },
    [onImageChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    maxFiles: 1,
    maxSize,
    disabled,
    multiple: false,
  });

  const removeImage = () => {
    setPreview(null);
    onImageChange?.(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className={cn(
              "rounded-lg object-cover w-full h-48",
              previewClassName
            )}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "cursor-not-allowed opacity-50",
            !disabled && "cursor-pointer"
          )}
        >
          <input {...getInputProps()} />
          <Image
            className={cn(
              "h-10 w-10 mb-4",
              isDragActive ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-sm text-muted-foreground text-center">
            {isDragActive ? (
              "Drop the image here..."
            ) : (
              <>
                Drop an image here, or{" "}
                <span className="text-primary font-medium">browse</span>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG, GIF up to {maxSize / 1024 / 1024}MB
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export { FileUpload, ImageUpload };
export type { FileUploadProps, ImageUploadProps };
