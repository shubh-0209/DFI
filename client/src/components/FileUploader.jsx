// client/src/components/FileUploader.jsx
import React, { useCallback } from 'react';
import { safeSlice } from '../../utils/safeSlice';
import { useDropzone } from 'react-dropzone';

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const FileUploader = ({ files, setFiles }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = safeSlice([...files, ...acceptedFiles], 0, MAX_FILES);
      setFiles(newFiles);
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
  });

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  return (
    <div className="file-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`} style={{ border: '2px dashed #aaa', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag & drop up to {MAX_FILES} files (max {MAX_SIZE / (1024 * 1024)} MB each) or click to select</p>}
      </div>
      {files.length > 0 && (
        <ul className="file-list" style={{ marginTop: '10px' }}>
          {files.map((file, idx) => (
            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              <button type="button" onClick={() => removeFile(idx)} style={{ marginLeft: '10px' }}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
