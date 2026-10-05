import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { AdminStats, DocumentItem } from '../types';

interface PaginatedDocsResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  limit: number;
  documents: DocumentItem[];
}

const AdminPanel = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocs = async (p: number) => {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedDocsResponse>('/admin/documents', {
        params: { page: p, limit },
      });
      setDocs(data.documents);
      // setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchDocs(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document permanently?')) return;
    try {
      await api.delete(`/documents/${id}`);
      if (docs.length === 1 && page > 1) {
        setPage((p) => p - 1);  // useEffect trigger hoga
      } else {
        fetchDocs(page);  // same page refresh
      }
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRefreshSummary = async (id: string) => {
    try {
      await api.post(`/admin/refresh-summary/${id}`);
      alert('Summary refresh queued');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > pages) return;
    setPage(p);
  };

  // Page numbers generate karo (max 5 buttons)
  const getPageNumbers = (): (number | string)[] => {
    const result: (number | string)[] = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) result.push(i);
    } else {
      result.push(1);
      let start = Math.max(2, page - 1);
      let end = Math.min(pages - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = 4;
      }
      if (page >= pages - 2) {
        start = pages - 3;
        end = pages - 1;
      }

      if (start > 2) result.push('...');
      for (let i = start; i <= end; i++) result.push(i);
      if (end < pages - 1) result.push('...');
      result.push(pages);
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">🛠️ Admin Panel</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Users', value: stats.totalUsers, color: 'text-blue-600' },
            { label: 'Documents', value: stats.totalDocuments, color: 'text-gray-800' },
            { label: 'Completed', value: stats.completed, color: 'text-green-600' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Failed', value: stats.failed, color: 'text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Total: <span className="font-semibold">{total}</span> documents
          </p>
          <p className="text-sm text-gray-500">
            Page {page} of {pages}
          </p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">File</th>
              <th className="text-left px-4 py-3">Owner</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : docs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                  No documents
                </td>
              </tr>
            ) : (
              docs.map((doc) => {
                const owner = typeof doc.userId === 'object' ? doc.userId.name : doc.userId;
                return (
                  <tr key={doc._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{doc.originalName}</td>
                    <td className="px-4 py-3">{owner}</td>
                    <td className="px-4 py-3">{doc.status}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleRefreshSummary(doc._id)}
                        className="text-primary-600 hover:underline"
                      >
                        Refresh Summary
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ✅ Pagination controls */}
        {pages > 1 && (
          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((p, idx) =>
                typeof p === 'number' ? (
                  <button
                    key={idx}
                    onClick={() => goToPage(p)}
                    className={`px-3 py-1.5 text-sm rounded border ${
                      p === page
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={idx} className="px-2 text-gray-500">
                    {p}
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === pages}
              className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;