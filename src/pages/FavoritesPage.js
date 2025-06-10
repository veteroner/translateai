import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslationHistory } from '../context/TranslationHistoryContext';
import { useTheme } from '../context/ThemeContext';
import IconButton from '../components/ui/IconButton';

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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  p {
    color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
    margin-bottom: 1.5rem;
  }
`;

const TranslationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TranslationCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.theme === 'dark' ? '#2a2f45' : '#f3f4f6'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
`;

const LanguagePair = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#111827'};
  font-weight: 500;
  
  span {
    margin: 0 0.5rem;
    color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  }
`;

const CardDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const TranslationText = styled.div`
  margin-bottom: 1rem;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#111827'};
    line-height: 1.5;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 1rem 1rem;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#111827'};
  width: 300px;
  max-width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
    box-shadow: 0 0 0 2px ${props => props.theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
  }
`;

const FavoritesPage = () => {
  const { favorites, loading, toggleFavorite, deleteTranslation } = useTranslationHistory();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Arama filtreleme fonksiyonu
  const filteredFavorites = favorites.filter(translation => 
    translation.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    translation.translatedText.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Tarih formatlama fonksiyonu
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Dil kodu formatını dil adına çevirme
  const getLanguageName = (code) => {
    const languages = {
      'auto': 'Otomatik Algılama',
      'tr': 'Türkçe',
      'en': 'İngilizce',
      'de': 'Almanca',
      'fr': 'Fransızca',
      'es': 'İspanyolca',
      'it': 'İtalyanca',
      'pt': 'Portekizce',
      'ru': 'Rusça',
      'ja': 'Japonca',
      'zh': 'Çince',
      'ar': 'Arapça',
      'hi': 'Hintçe',
      'ko': 'Korece'
    };
    
    return languages[code] || code;
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageTitle theme={theme}>Favori Çevirilerim</PageTitle>
        <EmptyState theme={theme}>
          <p>Yükleniyor...</p>
        </EmptyState>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageTitle theme={theme}>Favori Çevirilerim</PageTitle>
      
      <FilterBar>
        <SearchInput 
          type="text"
          placeholder="Favorilerde ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          theme={theme}
        />
      </FilterBar>
      
      {filteredFavorites.length === 0 ? (
        <EmptyState theme={theme}>
          <p>Henüz favori çeviriniz bulunmuyor.</p>
        </EmptyState>
      ) : (
        <TranslationList>
          {filteredFavorites.map((translation) => (
            <TranslationCard key={translation.id} theme={theme}>
              <CardHeader theme={theme}>
                <LanguagePair theme={theme}>
                  {getLanguageName(translation.sourceLang)}
                  <span>→</span>
                  {getLanguageName(translation.targetLang)}
                </LanguagePair>
                <CardDate theme={theme}>
                  {formatDate(translation.timestamp)}
                </CardDate>
              </CardHeader>
              
              <CardContent>
                <TranslationText theme={theme}>
                  <h4>Kaynak Metin:</h4>
                  <p>{translation.sourceText}</p>
                </TranslationText>
                
                <TranslationText theme={theme}>
                  <h4>Çeviri:</h4>
                  <p>{translation.translatedText}</p>
                </TranslationText>
              </CardContent>
              
              <CardActions>
                <IconButton 
                  icon="favorite"
                  onClick={() => toggleFavorite(translation.id, false)}
                  title="Favorilerden Çıkar"
                  theme={theme}
                  isActive={true}
                />
                <IconButton 
                  icon="copy"
                  onClick={() => navigator.clipboard.writeText(translation.translatedText)}
                  title="Çeviriyi Kopyala"
                  theme={theme}
                />
                <IconButton 
                  icon="clear"
                  onClick={() => deleteTranslation(translation.id)}
                  title="Çeviriyi Sil"
                  theme={theme}
                />
              </CardActions>
            </TranslationCard>
          ))}
        </TranslationList>
      )}
    </PageContainer>
  );
};

export default FavoritesPage; 