import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Scissors, Share2, BarChart3, Zap, Lock, Clock, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-light text-primary text-2xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Short links. Clear insights.
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-ink-primary tracking-tight leading-[1.1] max-w-3xl mx-auto mb-5">
          Create, share, and understand<br className="hidden md:block" /> every link you share.
        </h1>
        <p className="text-base text-ink-secondary max-w-xl mx-auto mb-8 leading-relaxed">
          ShortMetric is a link management platform that gives you powerful analytics for every short link you create.
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/create-link" className="btn btn-outline btn-lg">
                Create a Link
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create your first link <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">Sign in</Link>
            </>
          )}
        </div>
      </section>

      {/* Workflow */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-ink-primary tracking-tight mb-2">How it works</h2>
          <p className="text-sm text-ink-secondary">Three simple steps to shorten, share, and track.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Step number="01" icon={Scissors} title="Create" desc="Shorten any URL and optionally add a custom alias." />
          <Step number="02" icon={Share2} title="Share" desc="Copy the short link and share it anywhere — social, email, QR code." />
          <Step number="03" icon={BarChart3} title="Track" desc="See clicks, devices, browsers, and referrers in real time." />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink-primary tracking-tight mb-2">Everything you need</h2>
            <p className="text-sm text-ink-secondary">A focused set of features to manage links and understand performance.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature icon={Zap} title="Short links" desc="Generate clean, shareable short URLs instantly." />
            <Feature icon={BarChart3} title="Click analytics" desc="Track clicks over time, browsers, devices, and operating systems." />
            <Feature icon={Lock} title="Private by default" desc="Each user can only access their own links and analytics." />
            <Feature icon={Clock} title="Expiration" desc="Set links to expire automatically after a chosen date." />
            <Feature icon={Share2} title="QR codes" desc="Generate and download a QR code for every link." />
            <Feature icon={Scissors} title="Custom aliases" desc="Choose memorable aliases instead of random codes." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-ink-primary tracking-tight mb-3">
          Start tracking your links today
        </h2>
        <p className="text-sm text-ink-secondary mb-8">Free, no credit card, no setup — just create your first link.</p>
        {isAuthenticated ? (
          <Link to="/create-link" className="btn btn-primary btn-lg">
            Create a link <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </section>
    </div>
  );
}

function Step({ number, icon: Icon, title, desc }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xs font-bold text-primary">{number}</span>
        <div className="w-8 h-8 rounded-md bg-primary-light flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-ink-primary mb-1">{title}</h3>
      <p className="text-xs text-ink-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="card p-5">
      <div className="w-8 h-8 rounded-md bg-primary-light flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
      </div>
      <h3 className="text-sm font-semibold text-ink-primary mb-1">{title}</h3>
      <p className="text-xs text-ink-secondary leading-relaxed">{desc}</p>
    </div>
  );
}
