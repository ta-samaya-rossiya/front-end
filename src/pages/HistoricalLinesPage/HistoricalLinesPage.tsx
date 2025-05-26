import React, { useState } from 'react';
import './HistoricalLinesPage.css'; // Создадим позже файл стилей
import HistoricalLineCards from '../../components/HistoricalLineCards/HistoricalLineCards'; // Импортируем новый компонент с правильным путем
import HistoricalLineEditing from '../../components/HistoricalLineEditing/HistoricalLineEditing'; // Импортируем новый компонент редактирования
import { HistoricalLineCardData } from '../../types/historicalLines';

const HistoricalLinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [historicalLines, setHistoricalLines] = useState<HistoricalLineCardData[]>([
    // Пример данных. В будущем эти данные будут загружаться с сервера и setHistoricalLines будет использоваться для их обновления.
    {
      id: '1',
      name: 'Линия 1',
      isActive: true,
      color: '#ff0000',
      style: 'solid',
      legend: 'Легенда 1',
      regions: ['Казахстан', 'Беларусь'],
      points: [],
      historicalEvents: [],
      description: 'Описание для Линии 1',
      videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: '2',
      name: 'Линия 2',
      isActive: false,
      color: '#00ff00',
      style: 'dashed',
      legend: 'Легенда 2',
      regions: [],
      points: [],
      historicalEvents: [],
      description: 'Описание для Линии 2',
      videoLink: '',
    },
    {
      id: '3',
      name: 'Линия 3',
      isActive: true,
    },
    {
      id: '4',
      name: 'Линия 4',
      isActive: true,
    },
    {
      id: '5',
      name: 'Линия 5',
      isActive: true,
    },
    {
      id: '6',
      name: 'Линия 6',
      isActive: false,
    },
    {
      id: '7',
      name: 'Линия 7',
      isActive: true,
    },
    {
      id: '8',
      name: 'Линия 8',
      isActive: true,
    },
  ]);
  const [selectedLine, setSelectedLine] = useState<HistoricalLineCardData | null>(null);
  const [activeSideSection, setActiveSideSection] = useState('general');

  const handleCreateLine = () => {
    // Создаем новую пустую линию для редактирования
    setSelectedLine({
      id: Date.now().toString(), // Временный ID
      name: '',
      isActive: false,
      color: '#000000',
      style: 'solid',
      legend: '',
      regions: [],
      points: [],
      historicalEvents: [],
      description: '',
      videoLink: '',
    });
  };

  const handleViewIndicators = () => {
    console.log('Перейти на страницу показателей');
    // Вероятно, использование react-router-dom для навигации
  };

  const handleEditLine = (id: string) => {
    const lineToEdit = historicalLines.find(line => line.id === id);
    if (lineToEdit) {
      setSelectedLine(lineToEdit);
    }
  };

  const handleSaveLine = () => {
    if (selectedLine) {
      const updatedLines = historicalLines.map(line => 
        line.id === selectedLine.id ? selectedLine : line
      );
      if (!historicalLines.find(line => line.id === selectedLine.id)) {
        updatedLines.push(selectedLine);
      }
      setHistoricalLines(updatedLines);
      setSelectedLine(null);
    }
  };

  const handleDeleteLine = () => {
    if (selectedLine) {
      const updatedLines = historicalLines.filter(line => line.id !== selectedLine.id);
      setHistoricalLines(updatedLines);
      setSelectedLine(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedLine(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedLine(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedLine(prev => (prev ? { ...prev, [name]: checked } : null));
  };

  const handleAddRegion = () => {
    // Реализация добавления региона
    console.log('Добавить регион');
  };

  const handleRemoveRegion = (regionName: string) => {
    if (selectedLine && selectedLine.regions) {
      const updatedRegions = selectedLine.regions.filter(region => region !== regionName);
      setSelectedLine({ ...selectedLine, regions: updatedRegions });
    }
  };

  const handleMarkerChange = (file: File | null) => {
    console.log('Marker file selected:', file);
    // Здесь будет логика обработки файла, например, загрузка на сервер и обновление selectedLine.marker
    if (selectedLine && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedLine(prev => prev ? { ...prev, marker: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    } else if (selectedLine && file === null) {
         setSelectedLine(prev => prev ? { ...prev, marker: undefined } : null);
    }
  };

  return (
    <div className="historical-lines-page">
      <div className="header">
        <div className="header-title" onClick={() => location.reload()}>Исторические линии</div>
        <div className="header-buttons">
          <button onClick={handleViewIndicators}>Показатели</button>
        </div>
        <div className="header-line"></div>
      </div>

      {!selectedLine ? (
        // Режим выбора линии
        <div className="selection-section">
          <div className="selection-header">
            <h2>Выбрать:</h2>
            <div>
              <input
                type="text"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={handleCreateLine}>Создать</button>
            </div>
          </div>
          
          {/* Используем компонент для отображения карточек */}
          <HistoricalLineCards 
            historicalLines={historicalLines}
            searchTerm={searchTerm}
            handleEditLine={handleEditLine}
          />
        </div>
      ) : (
        // Режим создания/редактирования линии - используем новый компонент
        <HistoricalLineEditing
          selectedLine={selectedLine}
          activeSideSection={activeSideSection}
          handleSaveLine={handleSaveLine}
          handleCancelEdit={handleCancelEdit}
          handleDeleteLine={handleDeleteLine}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
          setActiveSideSection={setActiveSideSection}
          handleAddRegion={handleAddRegion}
          handleRemoveRegion={handleRemoveRegion}
          handleMarkerChange={handleMarkerChange}
        />
      )}

    </div>
  );
};

export default HistoricalLinesPage; 