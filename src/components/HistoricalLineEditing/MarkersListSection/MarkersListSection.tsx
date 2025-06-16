// MarkersListSection.tsx
// Этот компонент предназначен для отображения списка маркеров, но в данный момент содержит только заглушку.
import React, { useState, useCallback } from 'react';
import { MapComponent } from '../../MapComponent/MapComponent';
import { ServerMarker, HistoricalObject, HistoricalLineCardData } from '@/types/historicalLines';
import { historicalLines } from '@/api/historicalLines';
import './MarkersListSection.css';

interface MarkersListSectionProps {
  selectedLine: HistoricalLineCardData | null; // Выбранная историческая линия
}

const MarkersListSection: React.FC<MarkersListSectionProps> = ({
  selectedLine,
}) => {
  const [draggedMarker, setDraggedMarker] = useState<ServerMarker | null>(null);

  // Обработчик перетаскивания маркера
  const handleMarkerDrag = useCallback((marker: ServerMarker, newCoords: [number, number]) => {
    setDraggedMarker({ ...marker, coords: newCoords });
  }, []);

  // Обработчик сохранения новых координат маркера
  const handleSaveMarker = useCallback(async () => {
    if (!selectedLine?.id || !draggedMarker) return;

    try {
      // Формируем полный объект для отправки
      const dataToSend: Partial<HistoricalObject> = {
        title: draggedMarker.title,
        coords: draggedMarker.coords,
        order: draggedMarker.order,
        description: draggedMarker.description,
        videoUrl: draggedMarker.videoUrl,
      };

      await historicalLines.updateObject(selectedLine?.id, draggedMarker.id, dataToSend);
      setDraggedMarker(null);
    } catch (error) {
      console.error('Ошибка при сохранении координат маркера:', error);
    }
  }, [selectedLine?.id, draggedMarker]);

  return (
    <div className="markers-list-section">
      <h3>Маркеры</h3>
      <div className="markers-map-container">
        <button 
          className="save-marker-button"
          onClick={handleSaveMarker}
          disabled={!draggedMarker}
        >
          Сохранить изменения
        </button>
        <MapComponent
          regions={selectedLine?.activeRegions || []} // Предоставляем пустой массив, если undefined
          markers={selectedLine?.markers || []} // Предоставляем пустой массив, если undefined
          lineColor={selectedLine?.lineColor}
          lineStyle={selectedLine?.lineStyle}
          onMarkerDrag={handleMarkerDrag}
          showIndicators={false}
          isDraggable={true}
        />
      </div>
    </div>
  );
};

export default MarkersListSection; 