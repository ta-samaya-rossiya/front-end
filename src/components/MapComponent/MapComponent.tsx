import React, { useMemo } from 'react';
import { MapContainer, Polygon, Tooltip, useMap } from 'react-leaflet';
import { LatLngTuple, PathOptions } from 'leaflet';
import { Region } from '../../types/map';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import L from 'leaflet';

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

interface MapComponentProps {
  regions: Region[];
  onRegionClick?: (region: Region) => void;
  showIndicators?: boolean;
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
      result.push(current);
      current = [curr];
    } else {
      current.push(curr);
    }
  }
  if (current.length) result.push(current);
  return result;
}

// Функция трансформации координат
const transformCoordinates = (coords: [number, number][] | [number, number][][]): LatLngTuple[][] => {
  const toPositiveLng = (lng: number) => lng < 0 ? 360 + lng : lng;

  if (Array.isArray(coords[0][0])) {
    return (coords as [number, number][][]).flatMap(splitPolygonByAntimeridian).map(
      polygon => polygon.map(([lat, lng]) => [lat, toPositiveLng(lng)] as LatLngTuple)
    );
  }
  return splitPolygonByAntimeridian(coords as [number, number][]).map(
    polygon => polygon.map(([lat, lng]) => [lat, toPositiveLng(lng)] as LatLngTuple)
  );
};

export const MapComponent: React.FC<MapComponentProps> = ({
  regions,
  onRegionClick,
  showIndicators = false,
}) => {
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
  };

  const inactiveStyle: PathOptions = {
    ...defaultStyle,
    fillColor: '#CCCCCC',
    fillOpacity: 0.7,
  };

  const hoverStyle: PathOptions = {
    ...defaultStyle,
    weight: 5,
    fillOpacity: 0.5,
    opacity: 1,
  };

  const regionsWithTransformedCoords = useMemo(() => {
    return regions.map(region => ({
      ...region,
      transformedCoordinates: transformCoordinates(region.border)
    }));
  }, [regions]);

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
    <div className="map-container">
      <MapContainer
        center={[65, 100]}
        zoom={3.23}
        className="map-container"
        zoomControl={false}
        attributionControl={false}
        maxBounds={[[25, 10], [85, 200]]}
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
                ...(region.isActive ? defaultStyle : inactiveStyle),
                fillColor: region.isActive ? (region.color || defaultStyle.fillColor) : inactiveStyle.fillColor
              }}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    ...hoverStyle,
                    fillColor: region.isActive ? (region.color || defaultStyle.fillColor) : inactiveStyle.fillColor,
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    ...(region.isActive ? defaultStyle : inactiveStyle),
                    fillColor: region.isActive ? (region.color || defaultStyle.fillColor) : inactiveStyle.fillColor,
                  });
                },
                click: () => {
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
  );
}; 