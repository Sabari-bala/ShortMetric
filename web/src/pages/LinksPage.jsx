import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import {
  LoadingState, ErrorState, EmptyState, Pagination,
  LinkRow, LinkCard, ConfirmDialog,
} from '../components';
import { linksService } from '../services/linksService';

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (sort) params.sort = sort;
      const data = await linksService.list(params);
      setLinks(data.results || []);
      setCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sort]);

  useEffect(() => {
    const t = setTimeout(() => loadLinks(), 300);
    return () => clearTimeout(t);
  }, [loadLinks]);
  useEffect(() => { setPage(1); }, [search, status, sort]);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await linksService.remove(confirmDelete);
      setConfirmDelete(null);
      loadLinks();
    } catch {
      alert('Failed to delete link.');
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = search || status || sort !== 'newest';

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="page-title">Links</h1>
          <p className="page-subtitle">
            {count > 0 ? `${count} ${count === 1 ? 'link' : 'links'}` : 'Manage all your short links'}
          </p>
        </div>
        <Link to="/create-link" className="btn btn-primary btn-sm">
          <Plus className="w-3.5 h-3.5" />
          Create Link
        </Link>
      </div>

      <div className="card p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-8"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto">
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="clicks">Most clicks</option>
            <option value="least_clicks">Least clicks</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setStatus(''); setSort('newest'); }}
              className="btn btn-ghost btn-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading links..." />
      ) : error ? (
        <ErrorState message="Failed to load links." onRetry={loadLinks} />
      ) : links.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No links match your filters' : 'No links yet'}
          description={hasFilters ? 'Try adjusting your search or filters.' : 'Create your first short link to get started.'}
          actionLabel={hasFilters ? undefined : 'Create Link'}
          actionTo={hasFilters ? undefined : '/create-link'}
        />
      ) : (
        <>
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-4 py-2.5 text-left section-label">Link</th>
                  <th className="px-4 py-2.5 text-left section-label">Status</th>
                  <th className="px-4 py-2.5 text-left section-label">Clicks</th>
                  <th className="px-4 py-2.5 text-right section-label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <LinkRow key={link.id} link={link} onDelete={setConfirmDelete} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2.5">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} onDelete={setConfirmDelete} />
            ))}
          </div>
        </>
      )}

      <Pagination
        page={page}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this link?"
        message="This action cannot be undone. The short URL will stop working immediately."
        confirmLabel="Delete Link"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
