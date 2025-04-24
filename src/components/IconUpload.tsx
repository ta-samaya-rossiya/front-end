import React, { useRef } from 'react';
import './IconUpload.css';

interface IconUploadProps {
  onFileSelect: (file: File) => void;
}

export const IconUpload: React.FC<IconUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="icon-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <button type="button" className="button button-secondary" onClick={handleClick}>
        Загрузить иконку
      </button>
    </div>
  );
}; 