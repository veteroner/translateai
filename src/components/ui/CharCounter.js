import React from 'react';
import styled from 'styled-components';

// Styled Components
const CounterWrapper = styled.div`
  font-size: 12px;
  color: ${props => {
    const percentage = (props.current / props.max) * 100;
    if (percentage > 90) {
      return '#ef4444'; // Kırmızı
    } else if (percentage > 75) {
      return '#f59e0b'; // Turuncu
    }
    return props.theme === 'dark' ? '#a0a3b1' : '#6b7280';
  }};
`;

const CharCounter = ({ current, max, theme }) => {
  return (
    <CounterWrapper current={current} max={max} theme={theme}>
      {current} / {max}
    </CounterWrapper>
  );
};

export default CharCounter; 