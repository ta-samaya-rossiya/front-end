import React, { useRef } from 'react';
import { HistoricalLineCardData } from '../../../types/historicalLines';
import marker from '../../../assets/marker_placeholder.png';
import './GeneralInfoSection.css';

interface GeneralInfoSectionProps {
  selectedLine: HistoricalLineCardData | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSaveLine: () => void;
  handleCancelEdit: () => void;
  handleDeleteLine: () => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMarkerChange: (file: File | null) => void;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  selectedLine,
  handleInputChange,
  handleSaveLine,
  handleCancelEdit,
  handleDeleteLine,
  handleCheckboxChange,
  handleMarkerChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStatusButtonClick = () => {
    // Симулируем объект события для handleCheckboxChange
    const simulatedEvent = {
      target: {
        name: 'isActive',
        checked: !selectedLine?.isActive,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleCheckboxChange(simulatedEvent);
  };

  const handleMarkerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleMarkerChange(file);
  };

  return <div className='general-editing'>
        <div className="editing-form">
          <label>
            Название линии:
            <input
              type="text"
              name="name"
              value={selectedLine?.title || ''}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Цвет линии:
            <input
              type="color"
              name="color"
              value={selectedLine?.lineColor || '#000000'}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Стиль линии:
            <select
              name="style"
              value={selectedLine?.lineStyle || ''}
              onChange={handleInputChange}
            >
              {/* Пример опций. Замените на реальные стили при необходимости */}
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </label>

          <label>
            Легенда маркера:
            <input
              type="text"
              name="legend"
              value={selectedLine?.markerLegend || ''}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Маркер линии:
            <div className="marker-preview" onClick={handleMarkerClick}>
              <img src={selectedLine?.markerImage || marker} alt="Маркер линии" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className="editing-header">
            <div className='action-buttons'>
                <button onClick={handleSaveLine} className='important-button'>Сохранить</button>
                <button onClick={handleCancelEdit}>Отмена</button>
                {selectedLine?.id !== undefined && selectedLine?.id !== null && 
                <button onClick={handleDeleteLine} className='important-button'>Удалить</button>}
                <button
                className={`status-button ${selectedLine?.isActive ? 'active' : ''}`}
                onClick={handleStatusButtonClick}
                >
                {selectedLine?.isActive ? 'Активна' : 'Нективна'}
                </button>
            </div>
        </div>
  </div>
};

export default GeneralInfoSection; 