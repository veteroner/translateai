import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  padding: 2rem;
  width: ${props => props.width || '500px'};
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  
  &:hover {
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  }
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  width,
  showCloseButton = true,
  closeOnEsc = true,
  closeOnOverlayClick = true
}) => {
  const { theme } = useTheme();
  
  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEsc = (event) => {
      if (closeOnEsc && event.keyCode === 27) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Body scroll kilidini kontrol et
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <ModalOverlay onClick={closeOnOverlayClick ? onClose : undefined}>
      <ModalContainer 
        theme={theme} 
        width={width}
        onClick={e => e.stopPropagation()}
      >
        {showCloseButton && (
          <CloseButton 
            onClick={onClose}
            theme={theme}
            aria-label="Kapat"
          >
            ×
          </CloseButton>
        )}
        {children}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default Modal; 