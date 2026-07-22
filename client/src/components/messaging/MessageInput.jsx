import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Paperclip, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageInput = ({ onSend, placeholder = 'Type a message...', disabled = false, onTypingStart, onTypingStop, onCancelEdit, isEditing = false, error }) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const typingSessionStartedRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const stopTypingSession = useCallback(() => {
    if (typingSessionStartedRef.current) {
      typingSessionStartedRef.current = false;
      onTypingStop?.();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [onTypingStop]);

  const handleSend = useCallback(() => {
    if (!content.trim() && attachments.length === 0) return;
    onSend({ content: content.trim(), attachments });
    setContent('');
    setAttachments([]);
    stopTypingSession();
    textareaRef.current?.focus();
  }, [content, attachments, onSend, stopTypingSession]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape' && isEditing && onCancelEdit) {
      onCancelEdit();
    }
  }, [handleSend, isEditing, onCancelEdit]);

  const handleChange = useCallback((e) => {
    setContent(e.target.value);
    if (onTypingStart && !typingSessionStartedRef.current) {
      typingSessionStartedRef.current = true;
      onTypingStart();
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTypingSession();
    }, 2000);
  }, [onTypingStart, stopTypingSession]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const isSendDisabled = disabled || (!content.trim() && attachments.length === 0);

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: '#fff',
        borderRadius: '0 0 16px 16px',
        alignItems: 'flex-end',
        position: 'relative' }}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: -36,
            left: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            backgroundColor: '#FEE2E2',
            color: '#991B1B' }}
          role="alert"
        >
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F3F4F6',
          color: '#4A5568',
          flexShrink: 0 }}
        aria-label="Attach file"
      >
        <Paperclip size={18} />
      </motion.button>

      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: 12,
            border: '1px solid var(--color-border)',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            maxHeight: 120,
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-heading)' }}
          aria-label="Message input"
          aria-invalid={!!error}
        />
      </div>

      {isEditing && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancelEdit}
          aria-label="Cancel editing"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#F3F4F6',
            color: '#4A5568',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0 }}
        >
          <X size={18} />
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        disabled={isSendDisabled}
        aria-label={isEditing ? 'Update message' : 'Send message'}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          cursor: isSendDisabled ? 'not-allowed' : 'pointer',
          backgroundColor: 'var(--primary-blue)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: isSendDisabled ? 0.5 : 1 }}
      >
        <Send size={18} />
      </motion.button>
    </div>
  );
};

export default MessageInput;
