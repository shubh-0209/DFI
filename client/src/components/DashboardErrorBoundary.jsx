import React from 'react';

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DashboardErrorBoundary] caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEF2F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: '#DC2626', marginBottom: '1rem' }}>Dashboard failed to load</h2>
          {import.meta.env.MODE === 'development' && (
            <div style={{ textAlign: 'left', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #FCA5A5', maxWidth: '800px', overflow: 'auto' }}>
              <p style={{ color: '#991B1B' }}>{this.state.error?.toString()}</p>
              <pre style={{ color: '#7F1D1D', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default DashboardErrorBoundary;
