import React from 'react';
import FileCard from './FileCard';

const UploadProgress = ({ files, onRetry: _onRetry, onRemove }) => {
  if (!files || files.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
      {files.map((file, index) => (
        <FileCard
          key={`${file.name}-${index}`}
          file={file}
          onRemove={onRemove}
          progress={file.progress || 100}
          status={file.status || 'completed'}
        />
      ))}
    </div>
  );
};

export default UploadProgress;
