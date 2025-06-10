import React from 'react';
import styled from 'styled-components';

// Styled Components
const Button = styled.button`
  background-color: ${props => 
    props.disabled 
      ? props.theme === 'dark' ? '#1e2130' : '#f3f4f6' 
      : props.isActive
        ? props.theme === 'dark' ? '#3b82f6' : '#2563eb'
        : 'transparent'
  };
  color: ${props => 
    props.disabled 
      ? props.theme === 'dark' ? '#4b5563' : '#9ca3af' 
      : props.isActive
        ? '#ffffff'
        : props.theme === 'dark' ? '#e5e7eb' : '#4b5563'
  };
  border: 1px solid ${props => 
    props.disabled 
      ? props.theme === 'dark' ? '#2a2f45' : '#e5e7eb'
      : props.isActive
        ? props.theme === 'dark' ? '#3b82f6' : '#2563eb'
        : props.theme === 'dark' ? '#3a3f55' : '#d1d5db'
  };
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 8px;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => 
      props.isActive
        ? props.theme === 'dark' ? '#2563eb' : '#1d4ed8'
        : props.theme === 'dark' ? '#2a2f45' : '#f3f4f6'
    };
    border-color: ${props => 
      props.isActive
        ? props.theme === 'dark' ? '#2563eb' : '#1d4ed8'
        : props.theme === 'dark' ? '#4b5563' : '#9ca3af'
    };
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

// Icon SVG paths
const icons = {
  translate: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
  </svg>,
  clear: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>,
  listen: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>,
  copy: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>,
  save: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>,
  history: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
  </svg>,
  favorite: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>,
  microphone: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
  </svg>
};

const IconButton = ({ icon, onClick, disabled, title, theme, isActive = false }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      theme={theme}
      isActive={isActive}
    >
      {icons[icon]}
    </Button>
  );
};

export default IconButton;