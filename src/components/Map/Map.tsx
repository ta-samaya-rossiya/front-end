import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Tooltip } from 'react-leaflet';
import { LatLngTuple, PathOptions } from 'leaflet';
import { MapLayer, Point, Region } from '../../types/map';
// import { russiaRegions } from '../../constants/russiaRegions';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { fourRegions } from '../../test/Four_regions_2_percents';
import L from 'leaflet';

interface MapProps {
  layers: MapLayer[];
  onPointClick?: (point: Point) => void;
  onRegionClick?: (region: Region) => void;
  isAdmin?: boolean;
}

export const Map: React.FC<MapProps> = ({ layers, onPointClick, onRegionClick }) => {
  const activeLayer = layers.length > 0 ? layers[0] : null;

  // Преобразование координат для Leaflet
  const transformCoordinates = (coords: [number, number][]): LatLngTuple[] => {
    return coords.map(([lat, lng]) => [lng, lat] as LatLngTuple);
  };

  const defaultStyle: PathOptions = {
    color: '#FFFFFF',
    weight: 1,
    fillOpacity: 0,
    opacity: 1,
    fillColor: '#FFFFFF',
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

  return (
    <div className="map-container">
      <MapContainer
        center={[65, 70]}
        zoom={5}
        className="map-container"
        zoomControl={true}
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
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          className="map-tiles"
        />
        
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
            <Tooltip sticky>{region.title}</Tooltip>
          </Polygon>
        ))}

        {activeLayer.points.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.coordinates[0], point.coordinates[1]]}
            radius={3}
            pathOptions={{
              color: '#FFFFFF',
              fillColor: '#FFFFFF',
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
  );
}; 