import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F1EA', padding: '2rem' }}>
          <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1rem', color: '#dc2626' }}>Something went wrong</h1>
            <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
              We hit an unexpected error while loading this page. Please refresh or go back to the dashboard.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
              <button className="btn btn-secondary" onClick={() => (window.location.href = '/dashboard')}>Go to Dashboard</button>
            </div>
            {this.state.error && (
              <details style={{ marginTop: '1.5rem', textAlign: 'left', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Error details</summary>
                <pre style={{ color: '#dc2626', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error?.message}
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
