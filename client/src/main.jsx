import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes global default — significantly improves client-side routing speed
      gcTime:    10 * 60 * 1000,  // keep unused cache in memory for 10 min
      retry: 1,
      refetchOnWindowFocus: false, // disabled to prevent heavy API calls on tab switch
    },
  },
});

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('[GlobalError]', event.error);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[UnhandledRejection]', event.reason);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);