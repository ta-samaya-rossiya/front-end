import React, { useState, useEffect } from 'react';
import { Region } from '../../types/map';
import { Link } from 'react-router-dom';
import { MapComponent } from '../../components/MapComponent/MapComponent';
import { historicalLines } from '../../api/historicalLines';
import { regions } from '../../api/regions';
import './Map.css';

interface MapProps {
  onRegionClick?: (region: Region) => void;
  showIndicators?: boolean;
  linkTo: string;
  link: string;
}

export const Map: React.FC<MapProps> = ({
  onRegionClick,
  showIndicators = false,
  linkTo,
  link,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [briefHistoricalLines, setBriefHistoricalLines] = useState<{ id: string; title: string }[]>([]);
  const [regionsData, setRegionsData] = useState<Region[]>([]);

  useEffect(() => {
    const fetchBriefHistoricalLines = async () => {
      try {
        const data = await historicalLines.getBriefHistoricalLines(true); // Получаем только активные линии
        setBriefHistoricalLines(data.lines);
      } catch (error) {
        console.error('Ошибка при загрузке кратких исторических линий:', error);
      }
    };

    const fetchAllRegions = async () => {
      try {
        const data = await regions.getAllRegions();
        setRegionsData(data.regions);
      } catch (error) {
        console.error('Ошибка при загрузке всех регионов:', error);
      }
    };

    if (!showIndicators) {
      fetchBriefHistoricalLines();
    }
    fetchAllRegions();
  }, [showIndicators]);

  return (
    <div className="gui-map-wrapper">
      {/* Заголовок */}
      <div className="gui-header">
        <span className="gui-title">
          {showIndicators ? 'Карта показателей' : 'Историческая карта'}
        </span>
        <div className="gui-header-underline" />
      </div>
      
      {/* Кнопка перехода на другую страницу */}
      <Link to={link} className="gui-indicators-btn">{linkTo}</Link>
      
      {/* Левая стрелка и панель исторических линий */}
      {!showIndicators && (
        <div
          className={`gui-history-arrow${showHistory ? ' open' : ''}`}
          onMouseEnter={() => setShowHistory(true)}
          onMouseLeave={() => setShowHistory(false)}
        >
          <div className="gui-arrow-icon">▶</div>
          <div className={`gui-history-panel${showHistory ? ' open' : ''}`}>
            <div className="gui-history-title">Исторические линии</div>
            <ul className="gui-history-list">
              {briefHistoricalLines.map(line => (
                <li key={line.id}>{line.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Легенда */}
      <div className="gui-legend">
        {showIndicators ? null: (
          <>
            <div>Значок линии</div>
            <div>Историческая линия</div>
          </>
        )}
      </div>
      
      {/* Метка админ */}
      <Link to="/admin/historical-lines" className="gui-admin-label">Админ</Link>
      
      {/* Карта */}
      <MapComponent 
        regions={regionsData}
        onRegionClick={onRegionClick}
        showIndicators={showIndicators}
      />
    </div>
  );
}; 