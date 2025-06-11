// AddRegionsSection.tsx
// Этот компонент предоставляет функциональность поиска регионов и их добавления к исторической линии.
// Он использует debounce для оптимизации запросов к API поиска.
import React, { useState, useEffect, useCallback } from 'react';
import './AddRegionsSection.css';
import { adminRegions } from '@/api/adminRegions';

// Интерфейс для данных региона
export interface Region {
  title: string; // Название региона
  id: number; // ID региона
}

// Интерфейс для ответа от API поиска регионов
interface SearchRegionResponse {
  completed: boolean;
  message: string;
  results: Region[];
}

// Пропсы для компонента AddRegionsSection
interface AddRegionsSectionProps {
  handleAddRegion: (region: Region) => void; // Функция обратного вызова для добавления выбранного региона
}

const AddRegionsSection: React.FC<AddRegionsSectionProps> = ({
    handleAddRegion
  }) => {

  // Состояние для хранения поискового запроса
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Состояние для хранения результатов поиска регионов
  const [searchResults, setSearchResults] = useState<Region[]>([]);
  // Состояние для индикации загрузки данных
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Состояние для хранения ошибок при поиске
  const [error, setError] = useState<string | null>(null);

  // Функция для выполнения поиска регионов с использованием useCallback для мемоизации
  const searchRegions = useCallback(async (query: string) => {
    // Если запрос пустой, очищаем результаты и выходим
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    setIsLoading(true); // Устанавливаем состояние загрузки
    setError(null); // Сбрасываем ошибки
    try {
      // Выполняем поиск регионов через API
      const response = await adminRegions.searchRegionOPM(query) as unknown as SearchRegionResponse;
      setSearchResults(response.results); // Обновляем результаты поиска
    } catch (err) {
      console.error('Ошибка при поиске регионов:', err);
      setError('Не удалось выполнить поиск регионов.'); // Устанавливаем сообщение об ошибке
      setSearchResults([]); // Очищаем результаты при ошибке
    } finally {
      setIsLoading(false); // Сбрасываем состояние загрузки
    }
  }, []);

  // Эффект для реализации debounce при поиске
  useEffect(() => {
    const handler = setTimeout(() => {
      searchRegions(searchTerm); // Запускаем поиск после небольшой задержки
    }, 500); // Задержка 500мс

    // Очистка таймера при размонтировании компонента или изменении searchTerm/searchRegions
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, searchRegions]);

  // Обработчик изменения значения в поле поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Обновляем поисковый запрос
  };

  return (
    <div className="add-regions-section">
      <div className="add-regions-header">Добавить регион</div>
      <div>
        {/* Поле ввода для поиска региона */}
        <input 
          type="text" 
          placeholder="Найти регион..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="search-results">
        {/* Индикатор загрузки */}
        {isLoading && <p>Загрузка...</p>}
        {/* Сообщение об ошибке */}
        {error && <p className="error-message">{error}</p>}
        {/* Сообщение, если ничего не найдено и поиск был выполнен */}
        {!isLoading && !error && searchResults.length === 0 && searchTerm.length > 0 && (
          <p>Ничего не найдено.</p>
        )}
        {/* Отображение результатов поиска, если они есть и нет загрузки/ошибки */}
        {!isLoading && !error && searchResults.length > 0 && (
          <ul className="add-regions-list">
            {searchResults.map((region: Region) => (
              <li key={region.id} className="add-regions-list-item">
                <span className="region-title">{region.title}</span>
                {/* Кнопка для добавления региона */}
                <button className="add-region-btn" onClick={() => handleAddRegion(region)}>
                  Добавить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddRegionsSection; 