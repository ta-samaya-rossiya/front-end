import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, Polygon, Tooltip, useMap } from 'react-leaflet';
import { LatLngTuple, PathOptions } from 'leaflet';
import { Region } from '../../types/map';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { regions } from '../../api/regions';

// Компонент для управления зумом
function ZoomControls() {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="gui-zoom-controls">
      <button className="gui-zoom-btn" onClick={handleZoomIn}>+</button>
      <button className="gui-zoom-btn" onClick={handleZoomOut}>−</button>
    </div>
  );
}

interface MapProps {
  onRegionClick?: (region: Region) => void;
  showIndicators?: boolean;
  linkTo: string;
  link: string;
}

// Разбивает полигон по антимеридиану
function splitPolygonByAntimeridian(coords: [number, number][]): [number, number][][] {
  if (coords.length === 0) return [];
  const result: [number, number][][] = [];
  let current: [number, number][] = [coords[0]];

  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    if (Math.abs(curr[1] - prev[1]) > 180) {
      // Разрыв 
      result.push(current);
      current = [curr];
    } else {
      current.push(curr);
    }
  }
  if (current.length) result.push(current);
  return result;
}

// Модифицированная функция трансформации
const transformCoordinates = (coords: [number, number][] | [number, number][][]): LatLngTuple[][] => {
  // Функция для перевода отрицательных долгот в положительные
  const toPositiveLng = (lng: number) => lng < 0 ? 360 + lng : lng;

  // Если мультиполигон
  if (Array.isArray(coords[0][0])) {
    return (coords as [number, number][][]).flatMap(splitPolygonByAntimeridian).map(
      polygon => polygon.map(([lat, lng]) => [lat, toPositiveLng(lng)] as LatLngTuple)
    );
  }
  // Если один полигон
  return splitPolygonByAntimeridian(coords as [number, number][]).map(
    polygon => polygon.map(([lat, lng]) => [lat, toPositiveLng(lng)] as LatLngTuple)
  );
};

export const Map: React.FC<MapProps> = ({
  onRegionClick,
  showIndicators = false,
  linkTo,
  link,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [regionsData, setRegionsData] = useState<Region[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await regions.getAllRegions();
        setRegionsData(data.regions);
      } catch (error) {
        console.error('Ошибка при получении регионов:', error);
      }
    };

    fetchRegions();
  }, []);

  const defaultStyle: PathOptions = {
    color: '#000000',
    fill: true,
    weight: 1,
    fillOpacity: 1,
    opacity: 1,
    fillColor: '#7A7A78',
    fillRule: 'evenodd',
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: undefined,
    dashOffset: undefined,
  };

  const hoverStyle: PathOptions = {
    ...defaultStyle,
    weight: 5,
    fillOpacity: 0.5,
    opacity: 1,
  };

  const regionsWithTransformedCoords = useMemo(() => {
    return regionsData.map(region => ({
      ...region,
      transformedCoordinates: transformCoordinates(region.border)
    }));
  }, [regionsData]);

  const renderRegionTooltip = (region: Region) => {
    if (showIndicators) {
      return (
        <div className="region-indicators">
          <h4>{region.title}</h4>
          <div className="indicators-list">
            <div>Количество экскурсий: {region.indicators?.excursions || 0}</div>
            <div>Количество туристов: {region.indicators?.tourists || 0}</div>
            <div>Доход: {region.indicators?.revenue || 0} ₽</div>
          </div>
        </div>
      );
    }
    return region.title;
  };

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
              <li>Историческая линия 1</li>
              <li>Историческая линия 2</li>
              <li>Историческая линия 3</li>
            </ul>
          </div>
        </div>
      )}
      {/* Легенда */}
      <div className="gui-legend">
        {showIndicators ? null : (
          <>
            <div>Значок линии</div>
            <div>Историческая линия</div>
          </>
        )}
      </div>
      {/* Метка админ */}
      <div className="gui-admin-label">админ</div>
      {/* Сама карта */}
      <div className="map-container">
        <MapContainer
          center={[65, 100]}
          zoom={3.23}
          className="map-container"
          zoomControl={false}
          attributionControl={false}
          maxBounds={[[35, 20], [85, 200]]}
          maxBoundsViscosity={1.0}
          minZoom={3.23}
          maxZoom={10}
          crs={L.CRS.EPSG3857}
          dragging={true}
          keyboard={true}
          bounceAtZoomLimits={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
        >
          <ZoomControls />
          
          {regionsWithTransformedCoords.map((region) =>
            region.transformedCoordinates.map((polygon, idx) => (
              <Polygon
                key={region.id + '-' + idx}
                positions={polygon}
                pathOptions={{
                  ...defaultStyle,
                  fillColor: region.color || defaultStyle.fillColor
                }}
                eventHandlers={{
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      ...hoverStyle,
                      fillColor: defaultStyle.fillColor,
                    });
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      ...defaultStyle,
                      fill: true,
                      fillColor: region.color || defaultStyle.fillColor,
                      fillOpacity: defaultStyle.fillOpacity,
                      color: defaultStyle.color,
                      weight: defaultStyle.weight,
                      opacity: defaultStyle.opacity,
                    });
                  },
                  click: () => {
                    console.log(`Clicked region: ${region.title}`);
                    onRegionClick?.(region);
                  }
                }}
              >
                <Tooltip sticky>{renderRegionTooltip(region)}</Tooltip>
              </Polygon>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
}; 