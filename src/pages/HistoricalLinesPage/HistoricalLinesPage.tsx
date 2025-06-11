// HistoricalLinesPage.tsx
// Этот компонент управляет отображением списка исторических линий, их созданием, редактированием и удалением.
// Он также интегрирует логику работы с регионами и маркерами, связанными с линиями.
import React, { useState, useEffect } from 'react';
import './HistoricalLinesPage.css'; // Создадим позже файл стилей
import HistoricalLineCards from '../../components/HistoricalLineCards/HistoricalLineCards'; // Импортируем новый компонент с правильным путем
import HistoricalLineEditing from '../../components/HistoricalLineEditing/HistoricalLineEditing/HistoricalLineEditing'; // Импортируем новый компонент редактирования
import { HistoricalLineCardData, ServerRegionInfo } from '../../types/historicalLines';
import { historicalLines } from '../../api/historicalLines';
import { adminRegions } from '../../api/adminRegions';
import { regions } from '../../api/regions';

const HistoricalLinesPage: React.FC = () => {
  // Состояние для поискового запроса
  const [searchTerm, setSearchTerm] = useState('');
  // Состояние для хранения списка исторических линий
  const [historicalLinesList, setHistoricalLinesList] = useState<HistoricalLineCardData[]>([]);
  // Состояние для хранения выбранной исторической линии для редактирования
  const [selectedLine, setSelectedLine] = useState<HistoricalLineCardData | null>(null);
  // Состояние для активной боковой секции редактирования
  const [activeSideSection, setActiveSideSection] = useState('general');

  // Эффект для загрузки всех исторических линий при монтировании компонента
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
  }, []); // Пустой массив зависимостей означает, что эффект запустится один раз при монтировании

  // Обработчик для создания новой пустой линии
  const handleCreateLine = () => {
    // Создаем новую пустую линию для редактирования
    setSelectedLine({
      id: Date.now().toString(), // Временный ID
      title: '',
      isActive: false,
      lineColor: '#000000',
      lineStyle: 'solid',
      markerLegend: '',
      markerImage: '', // Инициализируем пустой строкой
      markers: [],
      addedRegions: [],
      activeRegions: [],
      description: '',
      videoLink: '',
    });
  };

  // Обработчик для перехода на страницу показателей (заглушка)
  const handleViewIndicators = () => {
    console.log('Перейти на страницу показателей');
    // Вероятно, использование react-router-dom для навигации
  };

  // Обработчик для загрузки и редактирования существующей линии
  const handleEditLine = async (id: string) => {
    try {
      const lineToEdit = await historicalLines.getHistoricalLineById(id);
      setSelectedLine(lineToEdit);
    } catch (error) {
      console.error('Ошибка при загрузке линии для редактирования:', error);
    }
  };

  // Обработчик сохранения изменений в линии (создание или обновление)
  const handleSaveLine = async () => {
    if (selectedLine) {
      // Данные уже соответствуют HistoricalLineCardData благодаря useState и инициализации
      const dataToSend = selectedLine;

      console.log('Данные, отправляемые на сервер:', JSON.stringify(dataToSend, null, 2));

      // Проверяем, является ли линия новой или существующей
      const isNew = !historicalLinesList.some(line => line.id === selectedLine.id);
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
      setSelectedLine(null); // Закрываем режим редактирования после сохранения
    }
  };

  // Обработчик удаления линии
  const handleDeleteLine = async () => {
    if (selectedLine) {
      try {
        await historicalLines.deleteHistoricalLine(selectedLine.id);
        const updatedLines = historicalLinesList.filter(line => line.id !== selectedLine.id);
        setHistoricalLinesList(updatedLines);
        setSelectedLine(null); // Закрываем режим редактирования после удаления
      } catch (e) {
        console.error('Ошибка при удалении линии:', e);
      }
    }
  };

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    setSelectedLine(null); // Сбрасываем выбранную линию
  };

  // Универсальный обработчик изменения полей ввода (input, textarea, select)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Маппинг для полей, которые изменили название
    const newName = name === 'name' ? 'title' : 
                    name === 'color' ? 'lineColor' : 
                    name === 'style' ? 'lineStyle' : 
                    name === 'legend' ? 'markerLegend' : name;
    setSelectedLine(prev => (prev ? { ...prev, [newName]: value } : null));
  };

  // Обработчик изменения состояния чекбокса
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedLine(prev => (prev ? { ...prev, [name]: checked } : null));
  };

  // Обработчик добавления региона к линии
  const handleAddRegion = async (region: { title: string; id: number }) => {
    if (selectedLine && selectedLine.id) {
      try {
        await adminRegions.addNewRegion(region.id, selectedLine.id);
        const fullRegionInfo = await regions.getRegionById(region.id);

        const updatedLine = { ...selectedLine };
        
        const newRegionInfo: ServerRegionInfo = {
          id: fullRegionInfo.id,
          title: fullRegionInfo.title,
          displayTitle: fullRegionInfo.displayTitle,
          color: fullRegionInfo.color,
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

  // Обработчик удаления региона из линии (локально)
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

  // Обработчик изменения изображения маркера линии
  const handleMarkerChange = async (file: File | null) => {
    console.log('Marker file selected:', file);
    if (selectedLine && file) {
      // Если линия уже существует на сервере, загружаем маркер через API
      const isNew = !historicalLinesList.find(line => line.id === selectedLine.id);
      if (!isNew) {
        try {
          const res = await historicalLines.uploadMarkerImage(selectedLine.id, file);
          setSelectedLine(prev => prev ? { ...prev, markerImage: res.image } : null); // Обновляем markerImage
        } catch (e) {
          console.error('Ошибка при загрузке маркера:', e);
        }
      } else {
        // Для новой линии - локальный предпросмотр изображения
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedLine(prev => prev ? { ...prev, markerImage: reader.result as string } : null); // Обновляем markerImage
        };
        reader.readAsDataURL(file);
      }
    } else if (selectedLine && file === null) {
      // Если файл удален, сбрасываем markerImage
      setSelectedLine(prev => prev ? { ...prev, markerImage: undefined } : null); // Обновляем markerImage
    }
  };

  // Обработчик обновления активных регионов для линии
  const handleUpdateActiveRegions = async (activeRegionIds: string[]) => {
    if (selectedLine) {
      const activeRegionsFullInfo: ServerRegionInfo[] = [];
      try {
        // Получаем полную информацию для каждого активного региона
        const regionPromises = activeRegionIds.map(id => regions.getRegionById(parseInt(id)));
        const fetchedRegions = await Promise.allSettled(regionPromises);

        // Обрабатываем результаты запросов
        fetchedRegions.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            const foundRegion = result.value;
            activeRegionsFullInfo.push({
              id: foundRegion.id,
              title: foundRegion.title,
              displayTitle: foundRegion.displayTitle,
              color: foundRegion.color,
            });
          } else if (result.status === 'rejected') {
            console.error(`Ошибка при получении информации для региона с ID ${activeRegionIds[index]}:`, result.reason);
          }
        });
        setSelectedLine(prev => prev ? { ...prev, activeRegions: activeRegionsFullInfo } : null);
        // Сохраняем изменения на сервере после обновления активных регионов
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