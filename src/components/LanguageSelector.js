import React from 'react';
import styled from 'styled-components';

// Styled Components
const Select = styled.select`
  appearance: none;
  background-color: ${props => props.theme === 'dark' ? '#2a2f45' : '#f3f4f6'};
  border: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
  border-radius: 8px;
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#111827'};
  cursor: pointer;
  font-size: 14px;
  padding: 8px 32px 8px 12px;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 16px;
  width: 150px;
  
  &:hover {
    border-color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
  }
  
  &:focus {
    border-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
  }
  
  @media (max-width: 768px) {
    width: 120px;
    font-size: 13px;
  }
`;

const LanguageSelector = ({ value, onChange, languages, theme, multiple, hideHighlight }) => {
  return (
    <Select
      value={value}
      onChange={e => {
        if (multiple) {
          const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
          onChange(selected);
        } else {
          onChange(e.target.value);
        }
      }}
      theme={theme}
      multiple={multiple}
      size={multiple ? 4 : undefined}
      style={hideHighlight ? { border: 'none', boxShadow: 'none', background: 'transparent' } : {}}
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.name}
        </option>
      ))}
    </Select>
  );
};

export default LanguageSelector; 