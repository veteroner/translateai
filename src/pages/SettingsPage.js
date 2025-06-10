import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES, APP_CONFIG } from '../config';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Styled Components
const PageContainer = styled.div`
  padding: 1rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const SettingsContainer = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SettingsSection = styled.section`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#2a2f45' : '#f3f4f6'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  
  span {
    font-weight: 500;
    color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#111827'};
    margin-bottom: 0.25rem;
  }
  
  small {
    color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
    font-size: 0.875rem;
  }
`;

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
  width: 180px;
  
  &:hover {
    border-color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
  }
  
  &:focus {
    border-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.checked 
      ? props.theme === 'dark' ? '#3b82f6' : '#2563eb'
      : props.theme === 'dark' ? '#4b5563' : '#d1d5db'
    };
    transition: .3s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
      transform: ${props => props.checked ? 'translateX(24px)' : 'translateX(0)'};
    }
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props => props.theme === 'dark' ? '#2563eb' : '#1d4ed8'};
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#065f46' : '#d1fae5'};
  color: ${props => props.theme === 'dark' ? '#d1fae5' : '#065f46'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
    fill: currentColor;
  }
`;

// Yeni abonelik yönetimi bölümü ekliyorum
const SubscriptionSection = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const SubscriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SubscriptionTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const SubscriptionBadge = styled.span`
  background-color: ${props => {
    if (props.type === 'premium') return props.theme === 'dark' ? '#3b82f6' : '#2563eb';
    if (props.type === 'free') return props.theme === 'dark' ? '#6b7280' : '#9ca3af';
    return props.theme === 'dark' ? '#10b981' : '#059669';
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const SubscriptionDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const SubscriptionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SubscriptionLabel = styled.span`
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const SubscriptionValue = styled.span`
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  font-weight: 500;
`;

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { 
    userProfile, 
    subscription, 
    subscriptionLoading, 
    toggleAutoRenew, 
    cancelSubscription,
    isPremium,
    updatePreferences
  } = useAuthContext();
  
  const [defaultSourceLang, setDefaultSourceLang] = useState(APP_CONFIG.defaultSourceLanguage);
  const [defaultTargetLang, setDefaultTargetLang] = useState(APP_CONFIG.defaultTargetLanguage);
  const [realTimeTranslation, setRealTimeTranslation] = useState(APP_CONFIG.realTimeTranslation);
  const [audioEnabled, setAudioEnabled] = useState(APP_CONFIG.audioEnabled);
  const [isDarkTheme, setIsDarkTheme] = useState(theme === 'dark');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Kullanıcı profili yüklendiğinde tercihleri güncelle
  useEffect(() => {
    if (userProfile && userProfile.preferences) {
      const { preferences } = userProfile;
      
      setDefaultSourceLang(preferences.defaultSourceLang || APP_CONFIG.defaultSourceLanguage);
      setDefaultTargetLang(preferences.defaultTargetLang || APP_CONFIG.defaultTargetLanguage);
      setRealTimeTranslation(preferences.realTimeTranslation !== undefined ? preferences.realTimeTranslation : APP_CONFIG.realTimeTranslation);
      setAudioEnabled(preferences.audioEnabled !== undefined ? preferences.audioEnabled : APP_CONFIG.audioEnabled);
    }
  }, [userProfile]);
  
  // Tema değişikliğini takip et
  useEffect(() => {
    setIsDarkTheme(theme === 'dark');
  }, [theme]);
  
  // Tema değişikliği
  const handleThemeChange = () => {
    setIsDarkTheme(!isDarkTheme);
    toggleTheme();
  };
  
  // Ayarları kaydet
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      await updatePreferences({
        defaultSourceLang,
        defaultTargetLang,
        realTimeTranslation,
        audioEnabled,
        theme: isDarkTheme ? 'dark' : 'light'
      });
      
      setSaveSuccess(true);
      
      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Abonelik işlemleri
  const handleAutoRenewToggle = async () => {
    if (subscriptionLoading) return;
    
    try {
      await toggleAutoRenew(!subscription.autoRenew);
      toast.success(
        subscription.autoRenew 
          ? 'Otomatik yenileme devre dışı bırakıldı' 
          : 'Otomatik yenileme etkinleştirildi'
      );
    } catch (error) {
      toast.error('Bir hata oluştu, lütfen tekrar deneyin');
    }
  };
  
  const handleCancelSubscription = async () => {
    if (subscriptionLoading) return;
    
    if (window.confirm('Aboneliğinizi iptal etmek istediğinizden emin misiniz? Mevcut abonelik süreniz sonuna kadar premium özellikler kullanımınızda kalacaktır.')) {
      try {
        const result = await cancelSubscription();
        toast.success(result.message);
      } catch (error) {
        toast.error('Bir hata oluştu, lütfen tekrar deneyin');
      }
    }
  };
  
  // Abonelik bilgilerini formatlamak için yardımcı fonksiyon
  const formatDate = (date) => {
    if (!date) return 'Belirtilmemiş';
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  return (
    <PageContainer>
      <PageTitle theme={theme}>Ayarlar</PageTitle>
      
      {saveSuccess && (
        <SuccessMessage theme={theme}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Ayarlarınız başarıyla kaydedildi.
        </SuccessMessage>
      )}
      
      <SettingsContainer theme={theme}>
        <SettingsSection theme={theme}>
          <SectionTitle theme={theme}>Çeviri Ayarları</SectionTitle>
          
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <span>Varsayılan Kaynak Dil</span>
              <small>Çevirilerinizde kullanılacak varsayılan kaynak dil</small>
            </SettingLabel>
            <Select 
              value={defaultSourceLang} 
              onChange={(e) => setDefaultSourceLang(e.target.value)}
              theme={theme}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </Select>
          </SettingRow>
          
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <span>Varsayılan Hedef Dil</span>
              <small>Çevirilerinizde kullanılacak varsayılan hedef dil</small>
            </SettingLabel>
            <Select 
              value={defaultTargetLang} 
              onChange={(e) => setDefaultTargetLang(e.target.value)}
              theme={theme}
            >
              {SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </Select>
          </SettingRow>
          
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <span>Gerçek Zamanlı Çeviri</span>
              <small>Yazarken otomatik olarak çeviri yap</small>
            </SettingLabel>
            <Toggle theme={theme} checked={realTimeTranslation}>
              <input 
                type="checkbox" 
                checked={realTimeTranslation} 
                onChange={() => setRealTimeTranslation(!realTimeTranslation)}
              />
              <span></span>
            </Toggle>
          </SettingRow>
          
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <span>Sesli Özellikler</span>
              <small>Metni sesli okuma özelliğini aktifleştir</small>
            </SettingLabel>
            <Toggle theme={theme} checked={audioEnabled}>
              <input 
                type="checkbox" 
                checked={audioEnabled} 
                onChange={() => setAudioEnabled(!audioEnabled)}
              />
              <span></span>
            </Toggle>
          </SettingRow>
        </SettingsSection>
        
        <SettingsSection theme={theme}>
          <SectionTitle theme={theme}>Görünüm Ayarları</SectionTitle>
          
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <span>Karanlık Tema</span>
              <small>Uygulamayı karanlık temada görüntüle</small>
            </SettingLabel>
            <Toggle theme={theme} checked={isDarkTheme}>
              <input 
                type="checkbox" 
                checked={isDarkTheme} 
                onChange={handleThemeChange}
              />
              <span></span>
            </Toggle>
          </SettingRow>
        </SettingsSection>
      </SettingsContainer>
      
      {/* Abonelik Bölümü */}
      <SectionTitle theme={theme}>Abonelik</SectionTitle>
      
      <SubscriptionSection theme={theme}>
        <SubscriptionHeader>
          <SubscriptionTitle theme={theme}>Abonelik Durumu</SubscriptionTitle>
          <SubscriptionBadge 
            theme={theme} 
            type={isPremium ? 'premium' : 'free'}
          >
            {isPremium ? 'Premium' : 'Ücretsiz'}
          </SubscriptionBadge>
        </SubscriptionHeader>
        
        {subscriptionLoading ? (
          <p>Yükleniyor...</p>
        ) : subscription && subscription.active ? (
          <>
            <SubscriptionDetails>
              <SubscriptionInfo theme={theme}>
                <SubscriptionLabel theme={theme}>Plan</SubscriptionLabel>
                <SubscriptionValue theme={theme}>
                  {subscription.plan === 'premium' ? 'Premium' : subscription.plan}
                </SubscriptionValue>
              </SubscriptionInfo>
              
              <SubscriptionInfo theme={theme}>
                <SubscriptionLabel theme={theme}>Bitiş Tarihi</SubscriptionLabel>
                <SubscriptionValue theme={theme}>
                  {formatDate(subscription.endDate)}
                </SubscriptionValue>
              </SubscriptionInfo>
              
              <SubscriptionInfo theme={theme}>
                <SubscriptionLabel theme={theme}>Otomatik Yenileme</SubscriptionLabel>
                <SubscriptionValue theme={theme}>
                  {subscription.autoRenew ? 'Açık' : 'Kapalı'}
                </SubscriptionValue>
              </SubscriptionInfo>
            </SubscriptionDetails>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button 
                onClick={handleAutoRenewToggle}
                disabled={subscriptionLoading}
                theme={theme}
                style={{
                  backgroundColor: 'transparent',
                  color: theme === 'dark' ? '#d1d5db' : '#4b5563',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
                }}
              >
                {subscription.autoRenew ? 'Otomatik Yenilemeyi Kapat' : 'Otomatik Yenilemeyi Aç'}
              </Button>
              
              <Button 
                onClick={handleCancelSubscription}
                disabled={subscriptionLoading}
                theme={theme}
                style={{
                  backgroundColor: theme === 'dark' ? '#ef4444' : '#dc2626',
                }}
              >
                Aboneliği İptal Et
              </Button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              Şu anda aktif bir aboneliğiniz bulunmuyor. Premium özelliklere erişmek için abonelik satın alabilirsiniz.
            </p>
            
            <Button
              as={Link}
              to="/pricing"
              theme={theme}
            >
              Premium'a Geç
            </Button>
          </>
        )}
      </SubscriptionSection>
      
      <ButtonContainer>
        <Button 
          className="primary" 
          onClick={handleSaveSettings} 
          disabled={loading}
          theme={theme}
        >
          {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </ButtonContainer>
    </PageContainer>
  );
};

export default SettingsPage; 