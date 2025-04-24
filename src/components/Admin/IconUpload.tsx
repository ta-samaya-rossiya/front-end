import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { mapApi } from '../../services/api';

interface IconUploadProps {
  onUploadComplete: (url: string) => void;
}

export const IconUpload: React.FC<IconUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите файл изображения');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await mapApi.uploadIcon(file);
      onUploadComplete(response.data.url);
    } catch (err) {
      setError('Ошибка при загрузке файла');
      console.error('Error uploading icon:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="icon-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="icon-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={isUploading}
        >
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            'Загрузить иконку'
          )}
        </Button>
      </label>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
}; 