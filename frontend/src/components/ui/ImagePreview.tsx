import React from 'react';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  title?: string;
  resolution?: string;
  onClose?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt = "Satellite Image", title, resolution, onClose }) => {
  return (
    <div className="relative rounded-lg border border-slate-700/80 bg-slate-900/60 overflow-hidden group">
      <img src={src} alt={alt} className="w-full h-auto object-cover max-h-96" />
      {(title || resolution) && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex justify-between items-end">
          {title && <span className="text-xs font-mono text-cyan-300 font-medium">{title}</span>}
          {resolution && <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">{resolution}</span>}
        </div>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 transition-colors"
          title="Dismiss preview"
        >
          ✕
        </button>
      )}
    </div>
  );
};
