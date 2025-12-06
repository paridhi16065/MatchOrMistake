import React, { useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Lock } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        className={`
          w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer mb-4
          ${isLoading ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed' : 'border-rose-300 bg-rose-50 hover:bg-rose-100 hover:border-rose-400'}
        `}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-full shadow-sm">
            <Upload className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upload Profile Screenshot</h3>
            <p className="text-sm text-gray-500 mt-1">Tap to browse or drag & drop</p>
          </div>
          
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-400">
               <Camera size={14} />
               <span>Screenshots</span>
            </div>
             <div className="flex items-center gap-1 text-xs text-gray-400">
               <ImageIcon size={14} />
               <span>Photos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-700 max-w-sm">
        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Privacy First:</span> Your photos are analyzed in memory and never stored. 
          For extra privacy, feel free to crop out names or workplaces before uploading.
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
