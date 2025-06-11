// CitiesListSection.tsx
// Этот компонент отвечает за отображение, добавление, изменение, удаление и изменение порядка исторических объектов (городов) для конкретной исторической линии.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CitiesListSection.css';
import CityCard from './CityCard';
import { historicalLines } from '@/api/historicalLines';
import { HistoricalObject } from '@/types/historicalLines';

// Интерфейс для пропсов компонента CitiesListSection
interface CitiesListSectionProps {
  lineId: string | null; // ID исторической линии, к которой привязаны города
}

// Вспомогательная функция для определения следующего порядка для нового города
const getNextOrder = (cities: HistoricalObject[]) =>
  cities.length > 0 ? Math.max(...cities.map(c => c.order)) + 1 : 0;

const CitiesListSection: React.FC<CitiesListSectionProps> = ({ lineId }) => {
  // Состояние для хранения списка городов
  const [cities, setCities] = useState<HistoricalObject[]>([]);
  // Ref для отслеживания элемента, который перетаскивается
  const dragItem = useRef<number | null>(null);

  // Вспомогательная функция для получения и сортировки городов с сервера
  const fetchAndSetCities = useCallback(async (id: string) => {
    try {
      const response = await historicalLines.getObjects(id);
      // Сортировка городов по полю 'order'
      setCities(response.objects.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Ошибка при загрузке городов:', error);
      setCities([]); // Сброс состояния при ошибке
    }
  }, []);

  // Эффект для загрузки городов при изменении lineId
  useEffect(() => {
    if (lineId) {
      fetchAndSetCities(lineId);
    } else {
      setCities([]); // Очистка списка, если lineId отсутствует
    }
  }, [lineId, fetchAndSetCities]);

  // Обработчик добавления нового города
  const handleAddCity = async () => {
    if (!lineId) return; // Если lineId нет, выходим
    const newCityData: Partial<HistoricalObject> = {
      title: '', // Инициализация полей нового города
      description: '',
      videoUrl: '',
      order: getNextOrder(cities), // Определение следующего порядка
      coords: [0, 0],
    };
    try {
      await historicalLines.addObject(lineId, newCityData);
      // Повторная загрузка городов для получения актуального отсортированного списка с сервера
      fetchAndSetCities(lineId);
    } catch (error) {
      console.error('Ошибка при добавлении города:', error);
    }
  };

  // Обработчик изменения поля города
  const handleChange = async (idx: number, field: keyof HistoricalObject, value: string) => {
    if (!lineId) return;
    const cityToUpdate = cities[idx];
    if (!cityToUpdate || !cityToUpdate.id) return;

    // Оптимистичное обновление состояния UI
    setCities(prev => prev.map((city, i) =>
      i === idx ? { ...city, [field]: value } : city
    ));

    try {
      // Обновление города на сервере
      await historicalLines.updateObject(lineId, cityToUpdate.id, { [field]: value });
    } catch (error) {
      console.error(`Ошибка при обновлении поля ${field} города:`, error);
      // Откат изменений в UI, если вызов API не удался
      fetchAndSetCities(lineId);
    }
  };

  // Обработчик удаления города
  const handleRemove = async (idx: number) => {
    if (!lineId) return;
    const cityToRemove = cities[idx];
    if (!cityToRemove || !cityToRemove.id) return;

    // Оптимистичное удаление из состояния UI
    setCities(prev => prev.filter((_, i) => i !== idx));

    try {
      // Удаление города на сервере
      await historicalLines.deleteObject(lineId, cityToRemove.id);
      // Повторная загрузка для обеспечения согласованности списка с сервером
      fetchAndSetCities(lineId);
    } catch (error) {
      console.error('Ошибка при удалении города:', error);
      // Откат изменений в UI, если вызов API не удался
      fetchAndSetCities(lineId);
    }
  };

  // Обработчик перемещения города вверх/вниз в списке
  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    if (!lineId) return;
    const newCities = [...cities];
    let targetIdx: number;

    // Определение индекса для обмена
    if (dir === 'up' && idx > 0) {
      targetIdx = idx - 1;
    } else if (dir === 'down' && idx < newCities.length - 1) {
      targetIdx = idx + 1;
    } else {
      return;
    }

    // Локальный обмен элементами
    [newCities[idx], newCities[targetIdx]] = [newCities[targetIdx], newCities[idx]];

    // Назначение новых значений 'order' на основе нового индекса в массиве
    const updatedCitiesWithOrder = newCities.map((city, i) => ({ ...city, order: i }));
    setCities(updatedCitiesWithOrder); // Оптимистичное обновление UI

    try {
      // Обновление порядка двух перемещенных городов на сервере
      const updates = [];
      const city1 = updatedCitiesWithOrder[idx];
      const city2 = updatedCitiesWithOrder[targetIdx];

      if (city1 && city1.id) {
        updates.push(historicalLines.updateObject(lineId, city1.id, { order: city1.order }));
      }
      if (city2 && city2.id) {
        updates.push(historicalLines.updateObject(lineId, city2.id, { order: city2.order }));
      }
      
      await Promise.all(updates); // Ожидание выполнения всех запросов на обновление
      // Повторная загрузка для обеспечения согласованности состояний клиента и сервера
      fetchAndSetCities(lineId);
    } catch (error) {
      console.error('Ошибка при перемещении города:', error);
      // Откат изменений в UI, если вызов API не удался
      fetchAndSetCities(lineId);
    }
  };

  // Обработчик изменения изображения города (только для локального предпросмотра)
  const handleImageChange = (idx: number, file: File) => {
    // Это только для локального предпросмотра, так как выделенного API для изображений объектов пока нет.
    // Если в будущем появится выделенный API, эту функцию нужно будет обновить,
    // чтобы вызывать API и потенциально повторно загружать список городов.
    const reader = new FileReader();
    reader.onload = e => {
      setCities(prev => prev.map((city, i) =>
        i === idx ? { ...city, image: e.target?.result as string } : city
      ));
    };
    reader.readAsDataURL(file);
  };

  // Обработчики для функциональности Drag and Drop
  const handleDragStart = (idx: number) => () => {
    dragItem.current = idx;
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Разрешает перетаскивание
  };
  const handleDrop = async (newIndex: number) => {
    // Проверка условий для отмены операции drop
    if (dragItem.current === null || dragItem.current === newIndex || !lineId) {
      dragItem.current = null;
      return;
    }

    const newCities = [...cities];
    // Извлечение перетаскиваемого элемента
    const [draggedItem] = newCities.splice(dragItem.current, 1);
    // Вставка элемента на новую позицию
    newCities.splice(newIndex, 0, draggedItem);

    // Назначение новых значений 'order' на основе нового индекса в массиве
    const updatedCitiesWithOrder = newCities.map((city, i) => ({ ...city, order: i }));
    setCities(updatedCitiesWithOrder); // Оптимистичное обновление UI

    dragItem.current = null; // Сброс dragItem сразу после обновления состояния

    try {
        const updates = [];
        // Отправляем обновления только для городов, порядок которых изменился.
        // Находим соответствующий исходный город по id для сравнения порядка.
        for (let i = 0; i < updatedCitiesWithOrder.length; i++) {
          const originalCity = cities.find(c => c.id === updatedCitiesWithOrder[i].id);
          if (originalCity && originalCity.order !== updatedCitiesWithOrder[i].order) {
            updates.push(historicalLines.updateObject(lineId, updatedCitiesWithOrder[i].id, { order: updatedCitiesWithOrder[i].order }));
          }
        }
        await Promise.all(updates); // Ожидание выполнения всех запросов на обновление
        // Повторная загрузка для обеспечения согласованности состояний клиента и сервера
        fetchAndSetCities(lineId);
    } catch (error) {
      console.error('Ошибка при обновлении порядка городов:', error);
      // Откат изменений в UI, если вызов API не удался
      fetchAndSetCities(lineId);
    }
  };

  return (
    <div className="cities-list-section">
      <h3>Города</h3>
      {/* Отображение списка городов */}
      {cities.map((city, idx) => (
        <CityCard
          key={city.id}
          title={city.title}
          description={city.description}
          videoUrl={city.videoUrl}
          image={city.image}
          order={city.order}
          // Пропсы для обработки изменений и взаимодействия с CityCard
          onChange={(field, value) => handleChange(idx, field as keyof HistoricalObject, value)}
          onMoveUp={() => handleMove(idx, 'up')}
          onMoveDown={() => handleMove(idx, 'down')}
          onRemove={() => handleRemove(idx)}
          onImageChange={file => handleImageChange(idx, file)}
          onDragStart={handleDragStart(idx)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(idx)}
        />
      ))}
      {/* Кнопка добавления нового города */}
      <div className="cities-list-add" onClick={handleAddCity}>
        <span className="cities-list-add-plus">+</span>
      </div>
    </div>
  );
};

export default CitiesListSection; 