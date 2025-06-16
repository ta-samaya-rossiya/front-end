// MapComponent.tsx
// Этот компонент отображает интерактивную карту с регионами, поддерживает управление зумом, отображение подсказок и обработку кликов по регионам.
import React, { useMemo } from 'react';
import { MapContainer, Polygon, Tooltip, useMap, Polyline, Marker } from 'react-leaflet';
import { LatLngTuple, PathOptions } from 'leaflet';
import { Region } from '../../types/map';
import { ServerMarker } from '../../types/historicalLines';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import L from 'leaflet';

// Компонент ZoomControls: управляет кнопками приближения/отдаления на карте.
function ZoomControls() {
  const map = useMap(); // Хук для доступа к экземпляру карты Leaflet

  // Обработчик увеличения зума
  const handleZoomIn = () => {
    map.zoomIn();
  };

  // Обработчик уменьшения зума
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

// Интерфейс для пропсов компонента MapComponent
interface MapComponentProps {
  regions: Region[]; // Массив данных о регионах для отображения на карте
  onRegionClick?: (region: Region) => void; // Опциональный колбэк при клике на регион
  showIndicators?: boolean; // Флаг для отображения индикаторов региона в подсказке
  // Новые пропсы для визуализации исторической линии
  markers?: ServerMarker[];
  lineColor?: string;
  lineStyle?: string;
  onMarkerDrag?: (marker: ServerMarker, newCoords: [number, number]) => void; // Новый пропс для перетаскивания маркеров
  isDraggable?: boolean; // Флаг, определяющий возможность перетаскивания маркеров
}

// Функция splitPolygonByAntimeridian: разбивает полигон на части, если он пересекает антимеридиан (180° долготы).
function splitPolygonByAntimeridian(coords: [number, number][]): [number, number][][] {
  if (coords.length === 0) return [];
  const result: [number, number][][] = [];
  let current: [number, number][] = [coords[0]];

  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    // Если разница в долготе между соседними точками больше 180, значит, полигон пересекает антимеридиан
    if (Math.abs(curr[1] - prev[1]) > 180) {
      result.push(current); // Завершаем текущий полигон
      current = [curr]; // Начинаем новый полигон с текущей точки
    } else {
      current.push(curr); // Добавляем точку к текущему полигону
    }
  }
  if (current.length) result.push(current); // Добавляем последний полигон
  return result;
}

// Функция transformCoordinates: преобразует координаты и разбивает полигоны.
const transformCoordinates = (coords: [number, number][] | [number, number][][]): LatLngTuple[][] => {

  // Добавляем проверку на пустые или некорректные входные данные
  if (!coords || coords.length === 0 || !coords[0] || (Array.isArray(coords[0]) && coords[0].length === 0)) {
    return [];
  }

  // Вспомогательная функция для преобразования отрицательной долготы в положительную (0-360)
  const toPositiveLng = (lng: number) => lng < 0 ? 360 + lng : lng;

  // Проверяем, является ли входной массив массивом массивов (мультиполигон)
  if (Array.isArray(coords[0][0])) {
    return (coords as [number, number][][])
      .flatMap(splitPolygonByAntimeridian) // Разбиваем каждый внутренний полигон
      .map(
        polygon => polygon.map(([lat, lng]) => [lat, toPositiveLng(lng)] as LatLngTuple) // Преобразуем координаты
      );
  }
  // Если это одиночный полигон
  return splitPolygonByAntimeridian(coords as [number, number][])
    .map(
      polygon => polygon.map(([lat, lng]) => [lat, toPositiveLng(lng)] as LatLngTuple) // Преобразуем координаты
    );
};

// Определение стилей для полигонов регионов
const defaultStyle: PathOptions = {
  color: '#000000', // Цвет границы
  fill: true, // Заливка полигона
  weight: 1, // Толщина границы
  fillOpacity: 1, // Прозрачность заливки
  opacity: 1, // Прозрачность границы
  fillColor: '#7A7A78', // Цвет заливки по умолчанию
  fillRule: 'evenodd',
  lineCap: 'round',
  lineJoin: 'round',
};

const inactiveStyle: PathOptions = {
  ...defaultStyle,
  fillColor: '#CCCCCC', // Цвет заливки для неактивных регионов
  fillOpacity: 0.7,
};

const hoverStyle: PathOptions = {
  ...defaultStyle,
  weight: 5, // Увеличенная толщина границы при наведении
  fillOpacity: 0.5,
  opacity: 1,
};

export const MapComponent: React.FC<MapComponentProps> = ({
  regions,
  onRegionClick,
  showIndicators = false,
  markers,      // Новый пропс
  lineColor,    // Новый пропс
  lineStyle,    // Новый пропс
  onMarkerDrag, // Новый пропс для перетаскивания маркеров
  isDraggable = false, // По умолчанию маркеры не перетаскиваемы
}) => {
  // Мемоизированные transformedCoordinates для предотвращения ненужных пересчетов
  const regionsWithTransformedCoords = useMemo(() => {
    return regions.map(region => ({
      ...region,
      transformedCoordinates: transformCoordinates(region.border) // Преобразование координат границ региона
    }));
  }, [regions]); // Зависимость от массива регионов

  // Подготавливаем позиции для линии, если маркеры предоставлены
  const linePositions = useMemo(() => {
    if (!markers || markers.length < 2) return [];
    // Сортируем маркеры по полю 'order'
    const sortedMarkers = [...markers].sort((a, b) => a.order - b.order);
    return sortedMarkers.map(marker => marker.coords as LatLngTuple);
  }, [markers]);

  // Определяем опции для линии
  const polylineOptions: PathOptions = {
    color: lineColor || 'blue', // По умолчанию синий, если цвет не предоставлен
    weight: 3,
    dashArray: lineStyle === 'dashed' ? '10, 10' : undefined,
  };

  // Функция для рендеринга содержимого подсказки (Tooltip) для региона
  const renderRegionTooltip = (region: Region) => {
    if (showIndicators) {
      // Если showIndicators true, отображаем подробные показатели
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
    // Иначе отображаем только название региона
    return region.title;
  };

  // Универсальный обработчик событий мыши для полигонов (mouseover, mouseout)
  const handlePolygonEvent = (region: Region, isHover: boolean) => (e: L.LeafletMouseEvent) => {
    const layer = e.target; // Целевой слой Leaflet
    // Определяем стиль в зависимости от состояния наведения и активности региона
    const style = isHover ? hoverStyle : (region.isActive ? defaultStyle : inactiveStyle);
    // Определяем цвет заливки
    const fillColor = region.isActive ? (region.color || defaultStyle.fillColor) : inactiveStyle.fillColor;
    layer.setStyle({ ...style, fillColor }); // Применяем стиль к слою
  };

  // Обработчик перетаскивания маркера
  const handleMarkerDragEnd = (marker: ServerMarker) => (e: L.DragEndEvent) => {
    const newCoords: [number, number] = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    onMarkerDrag?.(marker, newCoords);
  };

  // Создаем кастомную иконку маркера
  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [20, 20], // Устанавливаем размер иконки 20x20
    iconAnchor: [10, 20], // Точка привязки иконки
    popupAnchor: [0, -20], // Точка привязки всплывающего окна
  });

  // Центр карты для маркеров с координатами [0,0]
  const mapCenter: LatLngTuple = [65, 100]; 

  return (
    <div className="map-container">
      <MapContainer
        center={[65, 100]} // Начальный центр карты
        zoom={3.23} // Начальный уровень зума
        className="map-container"
        zoomControl={false} // Отключаем стандартный контроль зума
        attributionControl={false} // Отключаем стандартный контроль атрибуции
        maxBounds={[[25, 10], [85, 200]]} // Максимальные границы карты
        maxBoundsViscosity={1.0} // Вязкость границ
        minZoom={3.23} // Минимальный уровень зума
        maxZoom={10} // Максимальный уровень зума
        crs={L.CRS.EPSG3857} // Система координат
        dragging={true} // Разрешить перетаскивание карты
        keyboard={true} // Разрешить управление с клавиатуры
        bounceAtZoomLimits={true} // Отскок при достижении лимитов зума
        scrollWheelZoom={true} // Разрешить зум колесом мыши
        doubleClickZoom={true} // Разрешить зум по двойному клику
        touchZoom={true} // Разрешить сенсорный зум
      >
        {/* Компонент управления зумом */}
        <ZoomControls />
        
        {/* Рендеринг полигонов регионов */}
        {regionsWithTransformedCoords.map((region) =>
          region.transformedCoordinates.map((polygon, idx) => (
            <Polygon
              key={region.id + '-' + idx} // Уникальный ключ для каждого полигона
              positions={polygon} // Координаты полигона
              pathOptions={{
                // Динамическое применение стилей в зависимости от активности региона
                ...(region.isActive ? defaultStyle : inactiveStyle),
                fillColor: region.isActive ? (region.color || defaultStyle.fillColor) : inactiveStyle.fillColor
              }}
              eventHandlers={{
                mouseover: handlePolygonEvent(region, true), // Обработчик наведения мыши
                mouseout: handlePolygonEvent(region, false), // Обработчик ухода мыши
                click: () => onRegionClick?.(region) // Обработчик клика на полигон
              }}
            >
              {/* Подсказка (Tooltip) для региона */}
              <Tooltip sticky>{renderRegionTooltip(region)}</Tooltip>
            </Polygon>
          ))
        )}

        {/* Рендеринг линии между маркерами */}
        {linePositions.length > 1 && (
          <Polyline pathOptions={polylineOptions} positions={linePositions} />
        )}

        {/* Отображение маркеров */}
        {markers && markers.map((marker) => {
          // Если координаты [0,0], используем центр карты, иначе - координаты маркера
          const markerPosition: LatLngTuple = 
            (marker.coords && marker.coords[0] === 0 && marker.coords[1] === 0)
              ? mapCenter
              : [marker.coords[0], marker.coords[1]];

          return (
            <Marker
              key={marker.id}
              position={markerPosition}
              draggable={isDraggable} // Маркер перетаскиваемый, если isDraggable true
              eventHandlers={{
                dragend: isDraggable ? handleMarkerDragEnd(marker) : undefined, // Обработчик перетаскивания только если draggable
              }}
              icon={customMarkerIcon} // Используем кастомную иконку
            >
              <Tooltip>{marker.title}</Tooltip>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
};

export default MapComponent; 