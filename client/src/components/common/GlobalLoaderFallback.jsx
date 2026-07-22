import React from 'react';
import { useGlobalLoader } from '../../context/LoaderContext';

const GlobalLoaderFallback = () => {
  useGlobalLoader(true);
  return null;
};

export default GlobalLoaderFallback;
