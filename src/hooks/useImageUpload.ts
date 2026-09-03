'use client';

import { useState } from 'react';
import { ImageInput, ImageModality } from '@/types/image';
import { UploadService } from '@/services/uploadService';

export function useImageUpload() {
  const [images, setImages] = useState<ImageInput[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, modality?: ImageModality) => {
    setIsUploading(true);
    setError(null);
    try {
      const processed = await UploadService.processUploadedFile(file, modality);
      setImages((prev) => [...prev, processed]);
      return processed;
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return {
    images,
    setImages,
    uploadFile,
    removeImage,
    isUploading,
    error,
  };
}
