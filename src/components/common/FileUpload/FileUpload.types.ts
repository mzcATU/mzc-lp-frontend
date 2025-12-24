import type { Accept } from 'react-dropzone';

export interface FileUploadLabels {
  dropHere?: string;
  dragAndDrop?: string;
  browse?: string;
  maxSizePerFile?: string;
  upToFiles?: string;
}

export interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  labels?: FileUploadLabels;
}

export interface ImageUploadLabels {
  dropHere?: string;
  dragAndDrop?: string;
  browse?: string;
  acceptedFormats?: string;
}

export interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  previewClassName?: string;
  labels?: ImageUploadLabels;
}
