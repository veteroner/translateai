import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import paymentService from '../services/paymentService';

// Styled Components
const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 0.375rem;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'dark' ? '#60a5fa' : '#3b82f6'};
    box-shadow: 0 0 0 1px ${props => props.theme === 'dark' ? '#60a5fa' : '#3b82f6'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 0.375rem;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'dark' ? '#60a5fa' : '#3b82f6'};
    box-shadow: 0 0 0 1px ${props => props.theme === 'dark' ? '#60a5fa' : '#3b82f6'};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#2563eb' : '#1d4ed8'};
  }
  
  &:disabled {
    background-color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme === 'dark' ? '#ef4444' : '#dc2626'};
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme === 'dark' ? '#10b981' : '#059669'};
  margin-top: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
  
  & > * {
    flex: 1;
  }
`;

const PaymentForm = ({ planType, onSuccess, onCancel }) => {
  const { theme } = useTheme();
  const { user, userProfile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    acceptTerms: false,
  });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const validateForm = () => {
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setError('Lütfen geçerli bir kart numarası girin');
      return false;
    }
    
    if (!formData.cardName.trim()) {
      setError('Kart üzerindeki isim boş olamaz');
      return false;
    }
    
    if (!formData.expiryMonth || !formData.expiryYear) {
      setError('Lütfen son kullanma tarihini seçin');
      return false;
    }
    
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      setError('Lütfen geçerli bir güvenlik kodu girin');
      return false;
    }
    
    if (!formData.acceptTerms) {
      setError('Devam etmek için şartları kabul etmelisiniz');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Kart numarasının son 4 hanesi
      const lastFour = formData.cardNumber.slice(-4);
      
      const result = await paymentService.purchasePremium(user.uid, {
        paymentMethod: 'card',
        lastFour: lastFour
      });
      
      setSuccess(result.message);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Ödeme hatası:', error);
      setError('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Yılları oluştur
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  
  return (
    <FormContainer theme={theme}>
      <FormTitle theme={theme}>
        {planType === 'premium' ? 'Premium Abonelik' : 'Kurumsal Plan'} Ödemesi
      </FormTitle>
      
      {success ? (
        <SuccessMessage theme={theme}>{success}</SuccessMessage>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Kart Numarası</Label>
            <Input
              type="text"
              name="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={formData.cardNumber}
              onChange={handleInputChange}
              maxLength={19}
              theme={theme}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Kart Üzerindeki İsim</Label>
            <Input
              type="text"
              name="cardName"
              placeholder="Ad Soyad"
              value={formData.cardName}
              onChange={handleInputChange}
              theme={theme}
              required
            />
          </FormGroup>
          
          <FlexRow>
            <FormGroup>
              <Label theme={theme}>Son Kullanma Tarihi</Label>
              <FlexRow>
                <Select
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  theme={theme}
                  required
                >
                  <option value="">Ay</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </Select>
                
                <Select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  theme={theme}
                  required
                >
                  <option value="">Yıl</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </FlexRow>
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>CVV</Label>
              <Input
                type="text"
                name="cvv"
                placeholder="000"
                value={formData.cvv}
                onChange={handleInputChange}
                maxLength={4}
                theme={theme}
                required
              />
            </FormGroup>
          </FlexRow>
          
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                style={{ marginRight: '0.5rem' }}
                required
              />
              <span>Ödeme koşullarını ve abonelik şartlarını kabul ediyorum</span>
            </label>
          </FormGroup>
          
          {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
          
          <FlexRow>
            <Button 
              type="button" 
              onClick={onCancel}
              theme={theme}
              style={{ 
                backgroundColor: 'transparent', 
                color: theme === 'dark' ? '#d1d5db' : '#4b5563',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
              }}
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              theme={theme}
            >
              {loading ? 'İşleniyor...' : 'Ödeme Yap'}
            </Button>
          </FlexRow>
        </form>
      )}
    </FormContainer>
  );
};

export default PaymentForm; 