import SimpleLoader from '../components/common/SimpleLoader';
import React, { createContext, useContext, useState, useLayoutEffect, useCallback } from 'react';

const LoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {}
});

export const LoaderProvider = ({ children }) => {
  const [requests, setRequests] = useState(0);

  const showLoader = useCallback(() => {
    setRequests(r => r + 1);
  }, []);

  const hideLoader = useCallback(() => {
    setRequests(r => Math.max(0, r - 1));
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {requests > 0 && <SimpleLoader />}
    </LoaderContext.Provider>
  );
};

export const useGlobalLoader = (isLoading = true) => {
  const { showLoader, hideLoader } = useContext(LoaderContext);

  useLayoutEffect(() => {
    if (isLoading) {
      showLoader();
      return () => hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);
};
