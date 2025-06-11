import React, { useState, useEffect } from 'react';
import './HistoricalLinesPage.css'; // Создадим позже файл стилей
import HistoricalLineCards from '../../components/HistoricalLineCards/HistoricalLineCards'; // Импортируем новый компонент с правильным путем
import HistoricalLineEditing from '../../components/HistoricalLineEditing/HistoricalLineEditing/HistoricalLineEditing'; // Импортируем новый компонент редактирования
import { HistoricalLineCardData, ServerRegionInfo } from '../../types/historicalLines';
import { historicalLines } from '../../api/historicalLines';
import { adminRegions } from '../../api/adminRegions';
import { regions } from '../../api/regions';
import { Region } from '../../types/map';

const HistoricalLinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [historicalLinesList, setHistoricalLinesList] = useState<HistoricalLineCardData[]>([]);
  const [selectedLine, setSelectedLine] = useState<HistoricalLineCardData | null>(null);
  const [activeSideSection, setActiveSideSection] = useState('general');

  useEffect(() => {
    const fetchHistoricalLines = async () => {
      try {
        const response = await historicalLines.getAllHistoricalLines();
        setHistoricalLinesList(response.lines);
      } catch (error) {
        console.error('Ошибка при загрузке исторических линий:', error);
      }
    };

    fetchHistoricalLines();
  }, []);

  const handleCreateLine = () => {
    // Создаем новую пустую линию для редактирования
    setSelectedLine({
      id: Date.now().toString(), // Временный ID
      title: '',
      isActive: false,
      lineColor: '#000000',
      lineStyle: 'solid',
      markerLegend: '',
      markerImage: undefined,
      markers: [],
      addedRegions: [],
      activeRegions: [],
      description: '',
      videoLink: '',
    });
  };

  const handleViewIndicators = () => {
    console.log('Перейти на страницу показателей');
    // Вероятно, использование react-router-dom для навигации
  };

  const handleEditLine = async (id: string) => {
    try {
      const lineToEdit = await historicalLines.getHistoricalLineById(id);
      setSelectedLine(lineToEdit);
    } catch (error) {
      console.error('Ошибка при загрузке линии для редактирования:', error);
    }
  };

  const handleSaveLine = async () => {
    if (selectedLine) {
      // Подготовка данных для отправки на сервер
      const dataToSend = {
        ...selectedLine,
        markers: selectedLine.markers || [],
        addedRegions: selectedLine.addedRegions || [],
        activeRegions: selectedLine.activeRegions || [],
        markerImage: selectedLine.markerImage || '',
        lineColor: selectedLine.lineColor || '',
        lineStyle: selectedLine.lineStyle || '',
        markerLegend: selectedLine.markerLegend || '',
        description: selectedLine.description || '',
        videoLink: selectedLine.videoLink || '',
      };

      console.log('Данные, отправляемые на сервер:', JSON.stringify(dataToSend, null, 2));

      const isNew = !historicalLinesList.find(line => line.id === selectedLine.id);
      if (isNew) {
        try {
          const created = await historicalLines.addHistoricalLine(dataToSend);
          setHistoricalLinesList(prev => [...prev, created]);
        } catch (e) {
          console.error('Ошибка при создании линии:', e);
        }
      } else {
        try {
          const updated = await historicalLines.updateHistoricalLine(selectedLine.id, dataToSend);
          const updatedLines = historicalLinesList.map(line => 
            line.id === selectedLine.id ? updated : line
          );
          setHistoricalLinesList(updatedLines);
        } catch (e) {
          console.error('Ошибка при обновлении линии:', e);
        }
      }
      setSelectedLine(null);
    }
  };

  const handleDeleteLine = async () => {
    if (selectedLine) {
      try {
        await historicalLines.deleteHistoricalLine(selectedLine.id);
        const updatedLines = historicalLinesList.filter(line => line.id !== selectedLine.id);
        setHistoricalLinesList(updatedLines);
        setSelectedLine(null);
      } catch (e) {
        console.error('Ошибка при удалении линии:', e);
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedLine(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Маппинг для полей, которые изменили название
    const newName = name === 'name' ? 'title' : 
                    name === 'color' ? 'lineColor' : 
                    name === 'style' ? 'lineStyle' : 
                    name === 'legend' ? 'markerLegend' : name;
    setSelectedLine(prev => (prev ? { ...prev, [newName]: value } : null));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedLine(prev => (prev ? { ...prev, [name]: checked } : null));
  };

  const handleAddRegion = async (region: { title: string; id: number }) => {
    if (selectedLine && selectedLine.id) {
      try {
        await adminRegions.addNewRegion(region.id, selectedLine.id);
        const updatedLine = { ...selectedLine };
        if (!updatedLine.addedRegions) {
          updatedLine.addedRegions = [];
        }
        // Добавляем новый регион в формате ServerRegionInfo
        const newRegionInfo: ServerRegionInfo = {
          id: region.id.toString(), // Предполагаем, что id из adminRegions.searchRegionOPM подходит
          title: region.title,
          displayTitle: { text: region.title, position: [0, 0], fontSize: 12 }, // Заглушка
          color: '#000000', // Заглушка
        };

        // Проверяем, что региона нет в списке, прежде чем добавить
        if (!updatedLine.addedRegions.some(ar => ar.id === newRegionInfo.id)) {
            updatedLine.addedRegions.push(newRegionInfo);
        }
        setSelectedLine(updatedLine);
      } catch (error) {
        console.error('Ошибка при добавлении региона:', error);
      }
    }
  };

  const handleRemoveRegion = async (regionName: string) => {
    if (selectedLine && selectedLine.id && selectedLine.addedRegions) {
      try {
        // Удаляем регион по названию из локального списка addedRegions
        const updatedRegions = selectedLine.addedRegions.filter(region => region.title !== regionName);
        setSelectedLine({ ...selectedLine, addedRegions: updatedRegions });
        // Сохранение изменений произойдет при общем сохранении линии через handleSaveLine
      } catch (error) {
        console.error('Ошибка при удалении региона:', error);
      }
    }
  };

  const handleMarkerChange = async (file: File | null) => {
    console.log('Marker file selected:', file);
    if (selectedLine && file) {
      const isNew = !historicalLinesList.find(line => line.id === selectedLine.id);
      if (!isNew) {
        try {
          const res = await historicalLines.uploadMarkerImage(selectedLine.id, file);
          setSelectedLine(prev => prev ? { ...prev, markerImage: res.image } : null); // Обновляем markerImage
        } catch (e) {
          console.error('Ошибка при загрузке маркера:', e);
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedLine(prev => prev ? { ...prev, markerImage: reader.result as string } : null); // Обновляем markerImage
        };
        reader.readAsDataURL(file);
      }
    } else if (selectedLine && file === null) {
      setSelectedLine(prev => prev ? { ...prev, markerImage: undefined } : null); // Обновляем markerImage
    }
  };

  const handleUpdateActiveRegions = async (activeRegionIds: string[]) => {
    if (selectedLine) {
      const activeRegionsFullInfo: ServerRegionInfo[] = [];
      try {
        const allRegionsResponse = await regions.getAllRegions(); // Returns { regions: Region[] }
        const allAvailableRegions: Region[] = allRegionsResponse.regions; // Access the .regions property

        activeRegionIds.forEach(id => {
          const foundRegion = allAvailableRegions.find(r => r.id === id);
          if (foundRegion) {
            activeRegionsFullInfo.push({
              id: foundRegion.id,
              title: foundRegion.title,
              displayTitle: foundRegion.displayTitle,
              color: foundRegion.color,
            });
          } else {
            // Если регион не найден, добавляем заглушку
            activeRegionsFullInfo.push({
              id: id,
              title: 'Unknown Region',
              displayTitle: { text: 'Unknown', position: [0, 0], fontSize: 12 },
              color: '#CCCCCC',
            });
          }
        });
        setSelectedLine(prev => prev ? { ...prev, activeRegions: activeRegionsFullInfo } : null);
        // Сохраняем изменения после обновления активных регионов
        await handleSaveLine();
      } catch (error) {
        console.error('Ошибка при получении всех регионов для обновления активных регионов:', error);
      }
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
            historicalLines={historicalLinesList}
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
          handleRemoveRegion={handleRemoveRegion}
          handleMarkerChange={handleMarkerChange}
          handleAddRegion={handleAddRegion}
          onUpdateActiveRegions={handleUpdateActiveRegions}
        />
      )}

    </div>
  );
};

export default HistoricalLinesPage; 