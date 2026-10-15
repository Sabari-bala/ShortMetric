import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { MousePointerClick, Link2, CheckCircle2, XCircle, ArrowLeft, BarChart3 } from 'lucide-react';
import { MetricCard, LoadingState, ErrorState, EmptyState, Badge } from '../components';
import { analyticsService } from '../services/analyticsService';

const CHART_COLORS = ['#0F766E', '#D97706', '#2563EB', '#DC2626', '#7C3AED', '#0891B2', '#65A30D', '#DB2777'];

export default function AnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setNotFound(false);
    try {
      const result = id ? await analyticsService.forLink(id) : await analyticsService.dashboard();
      if (!result) {
        setNotFound(true);
        return;
      }
      setData(result);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingState message="Loading analytics..." />;

  if (notFound) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-12 h-12 mx-auto rounded-full bg-warning-light flex items-center justify-center mb-4">
          <BarChart3 className="w-5 h-5 text-warning" strokeWidth={2} />
        </div>
        <h2 className="text-base font-semibold text-ink-primary mb-2">Link not found</h2>
        <p className="text-sm text-ink-muted mb-6">
          This link may have been deleted or you don't have access to it.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (error || !data) return <ErrorState message="Could not load analytics." onRetry={load} />;

  // Sanity check: if viewing a specific link, ensure we have a valid link object
  if (id && (!data.link || !data.link.short_code)) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-12 h-12 mx-auto rounded-full bg-warning-light flex items-center justify-center mb-4">
          <BarChart3 className="w-5 h-5 text-warning" strokeWidth={2} />
        </div>
        <h2 className="text-base font-semibold text-ink-primary mb-2">Link not found</h2>
        <p className="text-sm text-ink-muted mb-6">
          This link may have been deleted or you don't have access to it.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return id ? <LinkAnalytics data={data} /> : <OverallAnalytics data={data} />;
}

function OverallAnalytics({ data }) {
  const clicks = (data?.clicks_over_time || []).map((d) => ({ date: d.date, clicks: d.count }));
  const hasClicks = (data?.total_clicks || 0) > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Overview of all your links and click activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Total Links" value={data?.total_links ?? 0} icon={Link2} accent="primary" />
        <MetricCard label="Total Clicks" value={data?.total_clicks ?? 0} icon={MousePointerClick} accent="primary" />
        <MetricCard label="Active" value={data?.active_links ?? 0} icon={CheckCircle2} accent="success" />
        <MetricCard label="Expired / Off" value={data?.expired_links ?? 0} icon={XCircle} accent="warning" />
      </div>

      {!hasClicks ? (
        <EmptyState
          title="No clicks yet"
          description="Share your links to start collecting analytics."
          actionLabel="Back to Dashboard"
          actionTo="/dashboard"
          icon={BarChart3}
        />
      ) : (
        <>
          <div className="card p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-ink-primary">Clicks over time</div>
                <div className="text-2xs text-ink-muted">Last 14 days</div>
              </div>
              <div className="text-xs text-ink-muted tabular-nums">
                {clicks.reduce((sum, d) => sum + d.clicks, 0)} clicks
              </div>
            </div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={clicks} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E5" vertical={false} />
                  <XAxis dataKey="date" stroke="#7C888A" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#7C888A" fontSize={10} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E3E8E5', fontSize: 12 }} />
                  <Line type="monotone" dataKey="clicks" stroke="#0F766E" strokeWidth={2} dot={{ fill: '#0F766E', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {data?.top_links?.length > 0 && (
            <div className="card p-4 mb-4">
              <div className="text-sm font-semibold text-ink-primary mb-3">Top performing links</div>
              <div className="space-y-1">
                {data.top_links.map((link, i) => (
                  <div key={link.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-2xs font-bold flex-shrink-0"
                        style={{ backgroundColor: `${CHART_COLORS[i % CHART_COLORS.length]}20`, color: CHART_COLORS[i % CHART_COLORS.length] }}
                      >
                        {i + 1}
                      </div>
                      <Link to={`/analytics/${link.id}`} className="text-sm font-medium text-primary hover:underline truncate">
                        /{link.short_code}
                      </Link>
                    </div>
                    <span className="text-xs text-ink-muted tabular-nums flex-shrink-0">
                      {link.click_count} {link.click_count === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.recent_clicks?.length > 0 && (
            <RecentClicks clicks={data.recent_clicks} showLink />
          )}
        </>
      )}
    </div>
  );
}

function LinkAnalytics({ data }) {
  const link = data.link;
  const clicks = (data?.clicks_over_time || []).map((d) => ({ date: d.date, clicks: d.count }));
  const devices = (data?.device_breakdown || []).map((d) => ({ name: d.device_category || 'Unknown', value: d.count }));
  const browsers = (data?.browser_breakdown || []).map((d) => ({ name: d.browser || 'Unknown', value: d.count }));
  const os = (data?.os_breakdown || []).map((d) => ({ name: d.operating_system || 'Unknown', value: d.count }));

  const status = !link.is_active
    ? { label: 'Disabled', variant: 'danger' }
    : { label: 'Active', variant: 'success' };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="page-title">Analytics for /{link.short_code}</h1>
          <p className="text-xs text-ink-muted truncate">{link.original_url}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Total Clicks" value={data?.total_clicks ?? 0} icon={MousePointerClick} accent="primary" />
      </div>

      {data.total_clicks === 0 ? (
        <EmptyState
          title="No clicks yet"
          description="Share this link and your first click will appear here."
          actionLabel="Back to Dashboard"
          actionTo="/dashboard"
          icon={BarChart3}
        />
      ) : (
        <>
          <div className="card p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-ink-primary">Clicks over time</div>
              <div className="text-xs text-ink-muted tabular-nums">
                {clicks.reduce((sum, d) => sum + d.clicks, 0)} total
              </div>
            </div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={clicks} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E5" vertical={false} />
                  <XAxis dataKey="date" stroke="#7C888A" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#7C888A" fontSize={10} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E3E8E5', fontSize: 12 }} />
                  <Line type="monotone" dataKey="clicks" stroke="#0F766E" strokeWidth={2} dot={{ fill: '#0F766E', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <Breakdown title="Devices" data={devices} type="pie" />
            <Breakdown title="Browsers" data={browsers} type="bar" />
            <Breakdown title="Operating Systems" data={os} type="bar" />
          </div>

          {data?.recent_clicks?.length > 0 && (
            <RecentClicks clicks={data.recent_clicks} />
          )}
        </>
      )}
    </div>
  );
}

function Breakdown({ title, data, type = 'bar' }) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-4">
        <div className="text-sm font-semibold text-ink-primary mb-3">{title}</div>
        <p className="text-xs text-ink-muted">No data.</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colorFor = (i) => CHART_COLORS[i % CHART_COLORS.length];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-ink-primary">{title}</div>
        <div className="text-2xs text-ink-muted tabular-nums">{total} total</div>
      </div>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={65}
                innerRadius={35}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colorFor(i)} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E3E8E5', fontSize: 12 }} />
            </PieChart>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E5" horizontal={false} />
              <XAxis type="number" stroke="#7C888A" fontSize={10} allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="#7C888A" fontSize={10} tickLine={false} axisLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E3E8E5', fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={colorFor(i)} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentClicks({ clicks, showLink = false }) {
  if (!clicks || clicks.length === 0) return null;
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="text-sm font-semibold text-ink-primary">Recent Clicks</div>
        <div className="text-2xs text-ink-muted">{clicks.length} recent</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-muted">
              <th className="px-4 py-2 text-left section-label">Time</th>
              {showLink && <th className="px-4 py-2 text-left section-label">Link</th>}
              <th className="px-4 py-2 text-left section-label">Browser</th>
              <th className="px-4 py-2 text-left section-label">Device</th>
              <th className="px-4 py-2 text-left section-label">OS</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-surface-hover transition-colors">
                <td className="px-4 py-2 text-ink-secondary whitespace-nowrap">
                  {new Date(c.clicked_at).toLocaleString()}
                </td>
                {showLink && (
                  <td className="px-4 py-2 text-primary font-medium">/{c.link__short_code}</td>
                )}
                <td className="px-4 py-2 text-ink-secondary">{c.browser || '—'}</td>
                <td className="px-4 py-2 text-ink-secondary">{c.device_category || '—'}</td>
                <td className="px-4 py-2 text-ink-secondary">{c.operating_system || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
