import { Link } from 'react-router-dom';
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

const DocumentCard = ({
  doc,
  onDelete,
}: {
  doc: DocumentItem;
  onDelete: (id: string) => void;
}) => {
  const sizeKB = (doc.fileSize / 1024).toFixed(1);
  const date = new Date(doc.createdAt).toLocaleDateString();

  const status = statusConfig[doc.status] || statusConfig.pending;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Top gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">
        {/* Header: Icon + Title + Status */}
        <div className="flex items-start gap-3 mb-4">
          {/* File icon */}
          <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
            📄
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-gray-800 truncate text-sm leading-tight"
              title={doc.originalName}
            >
              {doc.originalName}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                {doc.fileType}
              </span>
              <span className="text-gray-400">•</span>
              <span>{sizeKB} KB</span>
              <span className="text-gray-400">•</span>
              <span>{date}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
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

        {/* Summary */}
        <div className="mb-4 min-h-[40px]">
          {doc.summary ? (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {doc.summary}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic flex items-center gap-1.5">
              <span>💭</span> No summary yet
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/documents/${doc._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 px-3 py-2 rounded-lg border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-xs">👁️</span>
            View
          </Link>
          <button
            onClick={() => onDelete(doc._id)}
            className="flex items-center justify-center gap-1.5 text-sm font-semibold bg-red-50 text-red-600 px-3 py-2 rounded-lg border border-red-100 hover:bg-red-100 hover:border-red-200 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-xs">🗑️</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;