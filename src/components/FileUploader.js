import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { SUPPORTED_FILE_TYPES, isFileTypeSupported, validateFileSize } from '../services/documentTranslator';
import { useAuthContext } from '../context/AuthContext';

const FileUploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
  padding: 1.5rem;
  border: 2px dashed ${props => props.isDragActive ? '#4F46E5' : '#E5E7EB'};
  border-radius: 0.5rem;
  background-color: ${props => props.isDragActive ? '#EEF2FF' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4F46E5;
    background-color: #EEF2FF;
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #4F46E5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #4338CA;
  }
  
  &:disabled {
    background-color: #9CA3AF;
    cursor: not-allowed;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: #F3F4F6;
  width: 100%;
  max-width: 400px;
`;

const FileIcon = styled.div`
  margin-right: 0.75rem;
  color: #4F46E5;
`;

const FileDetails = styled.div`
  flex: 1;
  overflow: hidden;
  
  p {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-name {
    font-weight: 500;
  }
  
  .file-size {
    font-size: 0.875rem;
    color: #6B7280;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #EF4444;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #DC2626;
  }
`;

const Error = styled.div`
  color: #EF4444;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const SupportedFormats = styled.p`
  font-size: 0.875rem;
  color: #6B7280;
  margin-top: 0.75rem;
`;

// Dosya boyutunu formatla
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const FileUploader = ({ onFileLoad, isLoading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { userProfile } = useAuthContext();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };
  
  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    
    setError('');
    
    // Dosya tipi kontrolü
    if (!isFileTypeSupported(selectedFile)) {
      setError('Desteklenmeyen dosya formatı. Lütfen Word, PowerPoint veya PDF dosyası yükleyin.');
      return;
    }
    
    // Dosya boyutu kontrolü
    if (!validateFileSize(selectedFile, userProfile)) {
      const limit = userProfile?.premium ? 'premium' : 'ücretsiz';
      setError(`Dosya boyutu çok büyük. ${limit} hesap için maksimum dosya boyutunu aşıyor.`);
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleFileUpload = async () => {
    if (!file) return;
    
    try {
      await onFileLoad(file);
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <FileUploaderContainer 
      isDragActive={isDragActive}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {!file ? (
        <>
          <input
            type="file"
            onChange={handleFileChange}
            accept={SUPPORTED_FILE_TYPES.join(',')}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <UploadButton 
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading}
          >
            Dosya Seç
          </UploadButton>
          <SupportedFormats>
            Desteklenen formatlar: Word (.docx, .doc), PowerPoint (.pptx, .ppt), PDF
          </SupportedFormats>
        </>
      ) : (
        <>
          <FileInfo>
            <FileIcon>
              <i className={
                file.type.includes('word') ? 'fas fa-file-word' :
                file.type.includes('presentation') ? 'fas fa-file-powerpoint' :
                file.type.includes('pdf') ? 'fas fa-file-pdf' : 'fas fa-file'
              }></i>
            </FileIcon>
            <FileDetails>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatFileSize(file.size)}</p>
            </FileDetails>
            <RemoveButton onClick={handleRemoveFile} disabled={isLoading}>
              <i className="fas fa-times"></i>
            </RemoveButton>
          </FileInfo>
          
          <UploadButton 
            onClick={handleFileUpload} 
            style={{ marginTop: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'İşleniyor...' : 'Çevir'}
          </UploadButton>
        </>
      )}
      
      {error && <Error>{error}</Error>}
    </FileUploaderContainer>
  );
};

export default FileUploader; 