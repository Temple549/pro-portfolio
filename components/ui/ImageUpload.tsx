"use client";

import { useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Cover Image' }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState(value || '');

  const handleApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = () => {
    setUrlInput('');
    onChange('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>

      {/* URL Input - Now the primary method */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste image URL here (e.g., from Imgur, Unsplash)"
          className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApply();
            }
          }}
        />
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Image Preview */}
      {value && (
        <div className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).alt = 'Invalid image URL';
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove Image
            </button>
          </div>
        </div>
      )}
      
      <p className="text-xs text-zinc-500">
        Tip: Upload your image to a free host like <span className="font-medium">imgur.com</span>, right-click the image, and copy the image address.
      </p>
    </div>
  );
}