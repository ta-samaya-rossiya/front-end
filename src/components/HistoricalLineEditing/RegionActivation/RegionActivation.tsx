// RegionActivation.tsx
// Этот компонент позволяет пользователю активировать/деактивировать регионы для выбранной исторической линии, отображая их на карте.
import React, { useState, useEffect, useCallback } from 'react';
import './RegionActivation.css';
import { MapComponent } from '../../MapComponent/MapComponent';
import { HistoricalLineCardData } from '../../../types/historicalLines';
import { Region } from '../../../types/map';
import { regions } from '../../../api/regions';

// Интерфейс для пропсов компонента RegionActivation
interface RegionActivationProps {
  selectedLine: HistoricalLineCardData | null; // Выбранная историческая линия
  onUpdateActiveRegions: (activeRegionIds: string[]) => void; // Колбэк для обновления активных регионов
}

const RegionActivation: React.FC<RegionActivationProps> = ({ selectedLine, onUpdateActiveRegions }) => {
  // Состояние для хранения всех данных о регионах
  const [regionsData, setRegionsData] = useState<Region[]>([]);
  // Состояние для хранения ID активных регионов
  const [activeRegionIds, setActiveRegionIds] = useState<string[]>([]);

  // Получение регионов и установка их начального состояния (активны/неактивны) на основе selectedLine
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data: { regions: Region[] } = await regions.getAllRegions();
        setRegionsData(data.regions); // Устанавливаем все полученные регионы
        // Инициализируем activeRegionIds на основе активных регионов в selectedLine
        setActiveRegionIds(selectedLine?.activeRegions?.map(r => r.id) || []);
      } catch (error) {
        console.error('Ошибка при получении регионов:', error);
      }
    };
    fetchRegions(); // Вызываем функцию получения регионов
  }, [selectedLine]); // Зависимость от selectedLine для повторной загрузки при его изменении

  // Мемоизированная функция для проверки, активен ли регион
  const isRegionActive = useCallback((regionId: string) => activeRegionIds.includes(regionId), [activeRegionIds]);

  // Обработчик клика по региону на карте
  const handleRegionClick = (region: Region) => {
    setActiveRegionIds(prev =>
      prev.includes(region.id) // Если регион уже активен, удаляем его из списка
        ? prev.filter(id => id !== region.id)
        : [...prev, region.id] // Если регион неактивен, добавляем его в список
    );
  };

  // Обработчик сохранения активных регионов
  const handleSave = () => {
    onUpdateActiveRegions(activeRegionIds); // Вызываем колбэк с обновленными активными ID регионов
  };

  // Создаем новый массив регионов с флагом isActive для передачи в MapComponent
  const regionsWithActiveFlag = regionsData.map(region => ({ ...region, isActive: isRegionActive(region.id) }));

  return (
    <div className="region-activation-wrapper">
      <div className="region-activation-title">
        {/* Отображаем заголовок выбранной линии */}
        {selectedLine?.title}
        {/* Кнопка сохранения активных регионов */}
        <button className="region-activation-save-btn" onClick={handleSave}>
          Сохранить
        </button>
      </div>
      <div className="region-activation-map-container">
        {/* Компонент карты для отображения регионов и взаимодействия с ними */}
        <MapComponent
          regions={regionsWithActiveFlag} // Передаем регионы с флагом активности
          onRegionClick={handleRegionClick} // Колбэк для обработки кликов по регионам
          showIndicators={false} // Отключаем показ индикаторов на карте
        />
      </div>
    </div>
  );
};

export default RegionActivation; 