import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Image, Play, FileArchive, Eye } from 'lucide-react';
import ImageViewer from './ImageViewer';
import PDFViewer from './PDFViewer';
import VideoViewer from './VideoViewer';

const ContributionFiles = ({ files = [], links = {} }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPoster, setVideoPoster] = useState('');

  const imageFiles = useMemo(() => files.filter(f => f?.type?.startsWith?.('image/')), [files]);
  const pdfFiles = useMemo(() => files.filter(f => f?.type?.includes?.('pdf') || f?.originalName?.toLowerCase?.()?.endsWith?.('.pdf')), [files]);
  const videoFiles = useMemo(() => files.filter(f => f?.type?.startsWith?.('video/')), [files]);
  const otherFiles = useMemo(() => files.filter(f => !f?.type?.startsWith?.('image/') && !f?.type?.includes?.('pdf') && !f?.type?.startsWith?.('video/')), [files]);

  const openLightbox = (file) => {
    const allImages = imageFiles.length ? imageFiles : [file];
    const idx = allImages.findIndex(f => f.publicUrl === file.publicUrl);
    setLightboxImages(allImages);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  const openPdf = (file) => {
    setPdfUrl(file.publicUrl || file.url || '');
    setPdfTitle(file.originalName || 'PDF Preview');
    setPdfOpen(true);
  };

  const openVideo = (file) => {
    setVideoUrl(file.publicUrl || file.url || '');
    setVideoTitle(file.originalName || 'Video Preview');
    setVideoPoster(file.thumbnailUrl || file.previewUrl || '');
    setVideoOpen(true);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <Image size={20} style={{ color: 'var(--color-secondary)' }} />;
    if (type?.startsWith('video/')) return <Play size={20} style={{ color: 'var(--color-purple)' }} />;
    if (type?.includes('pdf') || type === 'application/pdf') return <FileText size={20} style={{ color: 'var(--color-error)' }} />;
    return <FileArchive size={20} style={{ color: 'var(--color-primary)' }} />;
  };

  return (
    <>
      <div style={{ padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', marginBottom: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileArchive size={18} color="#2563eb" /> Files & Evidence
        </h4>
        {files.length === 0 && !Object.values(links).some(Boolean) && (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No files or links attached.</p>
        )}
        {files.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {files.map((file, index) => {
              const isImage = file?.type?.startsWith?.('image/');
              const isPdf = file?.type?.includes?.('pdf') || file?.originalName?.toLowerCase?.()?.endsWith?.('.pdf');
              const isVideo = file?.type?.startsWith?.('video/');

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#ffffff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                      {getFileIcon(file.type || file.mimeType)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.originalName || file.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.125rem' }}>{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flexShrink: 0 }}>
                    {isImage && (
                      <button
                        type="button"
                        onClick={() => openLightbox(file)}
                        style={{ padding: '0.375rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}
                      >
                        <Eye size={14} /> Preview
                      </button>
                    )}
                    {isPdf && (
                      <button
                        type="button"
                        onClick={() => openPdf(file)}
                        style={{ padding: '0.375rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}
                      >
                        <Eye size={14} /> Preview
                      </button>
                    )}
                    {isVideo && (
                      <button
                        type="button"
                        onClick={() => openVideo(file)}
                        style={{ padding: '0.375rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}
                      >
                        <Play size={14} /> Play
                      </button>
                    )}
                    <a
                      href={file.publicUrl || file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '0.375rem 0.75rem', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', textDecoration: 'none' }}
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {(links.githubUrl || links.figmaUrl || links.canvaUrl || links.googleDriveUrl) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
            {links.githubUrl && (
              <a href={links.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}>
                <ExternalLink size={16} /> GitHub Repository
              </a>
            )}
            {links.figmaUrl && (
              <a href={links.figmaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}>
                <ExternalLink size={16} /> Figma Design
              </a>
            )}
            {links.canvaUrl && (
              <a href={links.canvaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}>
                <ExternalLink size={16} /> Canva Design
              </a>
            )}
            {links.googleDriveUrl && (
              <a href={links.googleDriveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}>
                <ExternalLink size={16} /> Google Drive
              </a>
            )}
          </div>
        )}
      </div>

      <ImageViewer
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onNext={(idx) => setLightboxIndex(idx)}
        onPrev={(idx) => setLightboxIndex(idx)}
      />
      <PDFViewer
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        pdfUrl={pdfUrl}
        title={pdfTitle}
      />
      <VideoViewer
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={videoUrl}
        poster={videoPoster}
        title={videoTitle}
      />
    </>
  );
};

export default ContributionFiles;
