import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Link2, MousePointerClick, CheckCircle2, XCircle, Search } from 'lucide-react';
import {
  MetricCard, MetricSkeleton, LoadingState, ErrorState, EmptyState,
  Pagination, LinkRow, LinkCard, ConfirmDialog,
} from '../components';
import { linksService } from '../services/linksService';
import { analyticsService } from '../services/analyticsService';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const data = await analyticsService.dashboard();
      setStats(data);
    } catch {
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadLinks = useCallback(async () => {
    setLinksLoading(true);
    setLinksError(false);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (sort) params.sort = sort;
      const data = await linksService.list(params);
      setLinks(data.results || []);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch {
      setLinksError(true);
    } finally {
      setLinksLoading(false);
    }
  }, [page, search, status, sort]);

  useEffect(() => { loadStats(); }, [loadStats]);
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
      loadStats();
      loadLinks();
    } catch {
      alert('Failed to delete link.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your links and understand their performance.</p>
        </div>
        <Link to="/create-link" className="btn btn-primary btn-sm">
          <Plus className="w-3.5 h-3.5" />
          Create Link
        </Link>
      </div>

      {/* Metrics */}
      {statsError ? (
        <ErrorState message="Could not load statistics." onRetry={loadStats} />
      ) : statsLoading ? (
        <MetricSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard label="Total Links" value={stats?.total_links ?? 0} subtitle="All time" icon={Link2} accent="primary" />
          <MetricCard label="Total Clicks" value={stats?.total_clicks ?? 0} subtitle="All time" icon={MousePointerClick} accent="primary" />
          <MetricCard label="Active" value={stats?.active_links ?? 0} subtitle="Currently live" icon={CheckCircle2} accent="success" />
          <MetricCard label="Expired / Off" value={stats?.expired_links ?? 0} subtitle="Not redirecting" icon={XCircle} accent="warning" />
        </div>
      )}

      {/* Filters */}
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
        </div>
      </div>

      {/* Links */}
      {linksLoading ? (
        <LoadingState message="Loading links..." />
      ) : linksError ? (
        <ErrorState message="Failed to load links." onRetry={loadLinks} />
      ) : links.length === 0 ? (
        <EmptyState
          title={search || status ? 'No links match your filters' : 'No links yet'}
          description={search || status ? 'Try adjusting your search or filters.' : 'Create your first short link to get started.'}
          actionLabel={search || status ? undefined : 'Create Link'}
          actionTo={search || status ? undefined : '/create-link'}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="py-3 pl-5 pr-3 text-left section-label">Link</th>
                  <th className="py-3 px-3 text-left section-label w-[110px]">Status</th>
                  <th className="py-3 px-3 text-left section-label w-[80px]">Clicks</th>
                  <th className="py-3 pl-3 pr-5 text-left section-label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <LinkRow key={link.id} link={link} onDelete={setConfirmDelete} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-2.5">
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






