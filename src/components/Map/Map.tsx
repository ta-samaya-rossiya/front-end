import React, { useMemo, useState } from 'react';
import { MapContainer, Polygon, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { LatLngTuple, PathOptions } from 'leaflet';
import { MapLayer, Point, Region } from '../../types/map';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { fourRegions } from '../../test/Four_regions_2_percents';
import L from 'leaflet';
import { Link } from 'react-router-dom';

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
  layers: MapLayer[];
  onPointClick?: (point: Point) => void;
  onRegionClick?: (region: Region) => void;
  isAdmin?: boolean;
  showIndicators?: boolean;
  linkTo: string;
  link: string;
}

export const Map: React.FC<MapProps> = ({ 
  layers, 
  onPointClick, 
  onRegionClick, 
  isAdmin,
  showIndicators = false ,
  linkTo,
  link,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const activeLayer = layers.length > 0 ? layers[0] : null;

  // Преобразование координат для Leaflet
  const transformCoordinates = (coords: [number, number][]): LatLngTuple[] => {
    return coords.map(([lat, lng]) => [lng, lat] as LatLngTuple);
  };

  const defaultStyle: PathOptions = {
    color: '#000000',
    weight: 1,
    fillOpacity: 0,
    opacity: 1,
    fillColor: '#7A7A78',
    fillRule: 'evenodd',
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: undefined,
    dashOffset: undefined,
    fill: true
  };

  const hoverStyle: PathOptions = {
    ...defaultStyle,
    weight: 2,
    fillOpacity: 0.1,
    opacity: 1
  };

  const fourRegionsWithTransformedCoords = useMemo(() => {
    return fourRegions.map(region => ({
      ...region,
      transformedCoordinates: transformCoordinates(region.border)
    }));
  }, []);

  if (!activeLayer) {
    return <div>Нет доступных слоев карты</div>;
  }

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
        {showIndicators ? (
          <>
            <div>Значок региона</div>
            <div>Показатели региона</div>
          </>
        ) : (
          <>
            <div>Значок линии</div>
            <div>Историческая линия</div>
          </>
        )}
      </div>
      {/* Метка админ */}
      {isAdmin && <div className="gui-admin-label">админ</div>}
      {/* Сама карта */}
      <div className="map-container">
        <MapContainer
          center={[65, 70]}
          zoom={5}
          className="map-container"
          zoomControl={false}
          attributionControl={false}
          maxBounds={[[35, 20], [85, 180]]}
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
          
          {fourRegionsWithTransformedCoords.map((region) => (
            <Polygon
              key={region.id}
              positions={region.transformedCoordinates}
              pathOptions={defaultStyle}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle(hoverStyle);
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle(defaultStyle);
                },
                click: () => {
                  console.log(`Clicked region: ${region.title}`);
                  onRegionClick?.(region);
                }
              }}
            >
              <Tooltip sticky>{renderRegionTooltip(region)}</Tooltip>
            </Polygon>
          ))}

          {activeLayer.points.map((point) => (
            <CircleMarker
              key={point.id}
              center={[point.coordinates[0], point.coordinates[1]]}
              radius={3}
              pathOptions={{
                color: '#000000',
                fillColor: '#000000',
                fillOpacity: 1
              }}
              eventHandlers={{
                click: () => onPointClick?.(point)
              }}
            >
              <Tooltip>{point.name}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}; 