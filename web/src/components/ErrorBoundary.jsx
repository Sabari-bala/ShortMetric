import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
          <div className="card max-w-md w-full p-8 text-center">
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-danger" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-base font-semibold text-ink-primary mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-ink-secondary leading-relaxed mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button onClick={this.handleReload} className="btn btn-primary btn-sm">
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
