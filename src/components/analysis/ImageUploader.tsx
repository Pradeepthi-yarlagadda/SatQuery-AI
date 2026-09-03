'use client';

import React from 'react';
import { Upload } from 'lucide-react';
import { ImageModality } from '@/types/image';

export function ImageUploader({
  onUpload,
  modality = 'optical',
}: {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modality?: ImageModality;
}) {
  return (
    <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-glass-border bg-white/[0.01] p-6 text-center transition-colors hover:border-cyan-400/50 hover:bg-cyan-400/[0.02]">
      <Upload size={24} className="text-cyan-400" />
      <span className="mt-2 text-xs font-mono font-medium text-white">
        Upload {modality.toUpperCase()} Observation
      </span>
      <span className="mt-1 text-[10px] text-gray-400">
        GeoTIFF, PNG, or JPEG raster format
      </span>
      <input
        type="file"
        accept=".tif,.tiff,.png,.jpg,.jpeg"
        onChange={onUpload}
        className="hidden"
      />
    </label>
  );
}

export default ImageUploader;
