import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import type { DocumentItem } from '../types';

const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string; icon: string }
> = {
  completed: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    icon: '✅',
  },
  processing: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    icon: '⏳',
  },
  pending: {
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-700',
    dot: 'bg-gray-400',
    icon: '🕐',
  },
  failed: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    icon: '⚠️',
  },
};

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const { data } = await api.get(`/documents/${id}`);
        setDoc(data.document);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
          <div className="h-6 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-24 bg-gray-100 rounded-full" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-3">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 p-5 rounded-2xl">
          <span className="text-xl leading-none">⚠️</span>
          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Document not found
          </h3>
          <p className="text-sm text-gray-500">
            The document you're looking for doesn't exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  const sizeKB = (doc.fileSize / 1024).toFixed(1);
  const status = statusConfig[doc.status] || statusConfig.pending;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-purple-600 hover:gap-2.5 transition-all duration-200"
      >
        ← Back to Dashboard
      </Link>

      {/* Header card */}
      <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            {/* File icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 shadow-sm">
              <span className="text-2xl">📄</span>
            </div>

            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight break-words"
                title={doc.originalName}
              >
                {doc.originalName}
              </h1>

              {/* Status badge */}
              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${status.dot} ${
                      doc.status === 'processing' ? 'animate-pulse' : ''
                    }`}
                  />
                  <span className="uppercase tracking-wide">{doc.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Meta info pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <span>🏷️</span>
              <span className="font-semibold">
                {doc.fileType.toUpperCase()}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <span>💾</span>
              <span className="font-semibold">{sizeKB} KB</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <span>📅</span>
              <span className="font-semibold">
                {new Date(doc.createdAt).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-md">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">AI Summary</h2>
              <p className="text-xs text-gray-500">
                Auto-generated summary of your document
              </p>
            </div>
          </div>

          {doc.summary ? (
            <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 rounded-xl p-5">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {doc.summary}
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5">
              <span className="text-xl leading-none">💭</span>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Summary not generated yet
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  AI integration Part 4 mein aayega
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extracted Text */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-md">
              <span className="text-lg">📄</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Extracted Text
              </h2>
              <p className="text-xs text-gray-500">
                Raw text content from the file
              </p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-gray-50 to-indigo-50/30 border border-gray-200 rounded-xl max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans p-5 leading-relaxed">
              {doc.extractedText || 'No text extracted'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;