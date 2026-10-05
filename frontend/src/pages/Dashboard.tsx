import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { DocumentItem } from '../types';
import DocumentCard from '../components/DocumentCard';
import UploadZone from '../components/UploadZone';

const Dashboard = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/documents');
      setDocs(data.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // ✅ NEW: upload hone ke baad naya doc turant add + background refetch
  const handleUploaded = (newDoc: any) => {
    setDocs((prev) => [newDoc, ...prev]);
    fetchDocs();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your documents — upload, view, and organize with AI.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-700">
            {docs.length} {docs.length === 1 ? 'document' : 'documents'}
          </span>
        </div>
      </div>

      {/* Upload Section */}
      <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md">
            <span className="text-lg">⬆️</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Upload Document</h2>
            <p className="text-xs text-gray-500">
              Drag & drop or click to upload a file
            </p>
          </div>
        </div>
        {/* ✅ CHANGE: fetchDocs → handleUploaded */}
        <UploadZone onUploaded={handleUploaded} />
      </div>

      {/* Documents Section */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-md">
            <span className="text-lg">📁</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">My Documents</h2>
            <p className="text-xs text-gray-500">
              {docs.length} {docs.length === 1 ? 'file' : 'files'} in your library
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-md border border-dashed border-gray-300 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                <span className="text-3xl">📭</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No documents yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Upload your first document above to get started. Your files will
                appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <DocumentCard key={doc._id} doc={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;