import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * Bir fonksiyonun belirli bir süre içinde tekrar çağrılmasını önleyen debounce hooku
 * @param {Function} callback - Debounce uygulanacak fonksiyon
 * @param {number} delay - Gecikme süresi (ms)
 * @returns {Function} - Debounce uygulanmış fonksiyon
 */
export const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

/**
 * Bir değerin belirli bir süre içinde değişmezse güncelleyen debounce hooku
 * @param {any} value - Debounce uygulanacak değer
 * @param {number} delay - Gecikme süresi (ms)
 * @returns {any} - Debounce uygulanmış değer
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

export default useDebouncedCallback; 