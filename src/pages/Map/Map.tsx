// Map.tsx
// Этот компонент представляет собой основную страницу карты, которая может отображать как исторические линии, так и показатели.
// Он управляет загрузкой данных, состоянием отображения боковой панели и передает необходимые пропсы компоненту MapComponent.
import React, { useState, useEffect } from 'react';
import { Region } from '../../types/map';
import { Link } from 'react-router-dom';
import { MapComponent } from '../../components/MapComponent/MapComponent';
import { historicalLines } from '../../api/historicalLines';
import { regions } from '../../api/regions';
import './Map.css';

// Определение пропсов для компонента Map
interface MapProps {
  onRegionClick?: (region: Region) => void; // Опциональный обработчик клика по региону
  showIndicators?: boolean; // Флаг для отображения карты показателей или исторической карты
  linkTo: string; // Текст ссылки для кнопки переключения карты
  link: string; // URL для кнопки переключения карты
}

export const Map: React.FC<MapProps> = ({
  onRegionClick,
  showIndicators = false,
  linkTo,
  link,
}) => {
  // Состояние для управления видимостью боковой панели с историческими линиями
  const [showHistory, setShowHistory] = useState(false);
  // Состояние для хранения краткой информации об исторических линиях
  const [briefHistoricalLines, setBriefHistoricalLines] = useState<{ id: string; title: string }[]>([]);
  // Состояние для хранения данных о регионах
  const [regionsData, setRegionsData] = useState<Region[]>([]);

  // Эффект для загрузки данных при монтировании компонента или изменении showIndicators
  useEffect(() => {
    // Функция для загрузки кратких исторических линий
    const fetchBriefHistoricalLines = async () => {
      try {
        const data = await historicalLines.getBriefHistoricalLines(true); // Получаем только активные линии
        setBriefHistoricalLines(data.lines);
      } catch (error) {
        console.error('Ошибка при загрузке кратких исторических линий:', error);
      }
    };

    // Функция для загрузки всех регионов
    const fetchAllRegions = async () => {
      try {
        const data = await regions.getAllRegions();
        setRegionsData(data.regions);
      } catch (error) {
        console.error('Ошибка при загрузке всех регионов:', error);
      }
    };

    // Загружаем исторические линии только если не показаны показатели
    if (!showIndicators) {
      fetchBriefHistoricalLines();
    }
    // Всегда загружаем все регионы
    fetchAllRegions();
  }, [showIndicators]); // Зависимость от showIndicators, чтобы перезагружать данные при переключении карты

  return (
    <div className="gui-map-wrapper">
      {/* Заголовок страницы */}
      <div className="gui-header">
        <span className="gui-title">
          {showIndicators ? 'Карта показателей' : 'Историческая карта'} // Динамический заголовок
        </span>
        <div className="gui-header-underline" />
      </div>
      
      {/* Кнопка для переключения между картой показателей и исторической картой */}
      <Link to={link} className="gui-indicators-btn">{linkTo}</Link>
      
      {/* Левая стрелка и панель исторических линий (отображается только для исторической карты) */}
      {!showIndicators && (
        <div
          className={`gui-history-arrow${showHistory ? ' open' : ''}`}
          onMouseEnter={() => setShowHistory(true)} // Показываем панель при наведении
          onMouseLeave={() => setShowHistory(false)} // Скрываем панель при уходе мыши
        >
          <div className="gui-arrow-icon">▶</div>
          <div className={`gui-history-panel${showHistory ? ' open' : ''}`}>
            <div className="gui-history-title">Исторические линии</div>
            <ul className="gui-history-list">
              {briefHistoricalLines.map(line => (
                <li key={line.id}>{line.title}</li> // Отображаем список исторических линий
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Легенда карты (отображается только для исторической карты) */}
      <div className="gui-legend">
        {showIndicators ? null: (
          <>
            <div>Значок линии</div>
            <div>Историческая линия</div>
          </>
        )}
      </div>
      
      {/* Ссылка на админ-панель */}
      <Link to="/admin/historical-lines" className="gui-admin-label">Админ</Link>
      
      {/* Компонент самой карты */}
      <MapComponent 
        regions={regionsData} // Передаем данные о регионах
        onRegionClick={onRegionClick} // Передаем обработчик клика по региону
        showIndicators={showIndicators} // Передаем флаг для MapComponent
      />
    </div>
  );
}; 