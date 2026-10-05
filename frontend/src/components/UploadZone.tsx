import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import api from '../api/axios';

const UploadZone = ({ onUploaded }: { onUploaded: (doc: any) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');

    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(file.type)) {
      setError('Only PDF and TXT files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max 5 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(data.document);   // 👈 naya document pass karo
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative overflow-hidden border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
          dragging
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02] shadow-lg shadow-indigo-500/20'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50 hover:shadow-md'
        } ${uploading ? 'pointer-events-none opacity-90' : ''}`}
      >
        {/* Animated glow on drag */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 transition-opacity duration-300 ${
            dragging ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={onSelect}
        />

        <div className="relative flex flex-col items-center justify-center">
          {uploading ? (
            <>
              {/* Uploading spinner */}
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="w-7 h-7 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              </div>
              <p className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Uploading your file...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Please wait, this won't take long
              </p>
            </>
          ) : (
            <>
              {/* Upload icon */}
              <div
                className={`relative mb-4 transition-transform duration-300 ${
                  dragging ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                  <span className="text-3xl">⬆️</span>
                </div>
                {dragging && (
                  <span className="absolute -inset-1 rounded-2xl bg-indigo-400/30 blur-md animate-pulse" />
                )}
              </div>

              {/* Main text */}
              <p className="text-base font-semibold text-gray-800">
                {dragging ? (
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Drop your file here!
                  </span>
                ) : (
                  <>
                    Drag & drop file here, or{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      click to browse
                    </span>
                  </>
                )}
              </p>

              {/* File type pills */}
              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
                  📄 PDF
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
                  📝 TXT
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
                  ⚡ Max 5 MB
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 mt-3 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl animate-pulse">
          <span className="text-base leading-none">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;