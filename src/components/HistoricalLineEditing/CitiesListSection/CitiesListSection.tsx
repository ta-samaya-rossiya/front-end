import React, { useState, useRef, useEffect } from 'react';
import './CitiesListSection.css';
import CityCard from './CityCard';
import { historicalLines } from '@/api/historicalLines';
import { HistoricalObject } from '@/types/historicalLines';

interface CitiesListSectionProps {
  lineId: string | null;
}

const getNextOrder = (cities: HistoricalObject[]) =>
  cities.length > 0 ? Math.max(...cities.map(c => c.order)) + 1 : 0;

const CitiesListSection: React.FC<CitiesListSectionProps> = ({ lineId }) => {
  const [cities, setCities] = useState<HistoricalObject[]>([]);
  const dragItem = useRef<number | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      if (lineId) {
        try {
          const response = await historicalLines.getObjects(lineId);
          setCities(response.objects.sort((a, b) => a.order - b.order));
        } catch (error) {
          console.error('Ошибка при загрузке городов:', error);
          setCities([]);
        }
      } else {
        setCities([]);
      }
    };
    fetchCities();
  }, [lineId]);

  const handleAddCity = async () => {
    if (!lineId) return;
    const newCityData: Partial<HistoricalObject> = {
      title: '',
      description: '',
      videoUrl: '',
      order: getNextOrder(cities),
      coords: [0, 0],
    };
    try {
      const createdCity = await historicalLines.addObject(lineId, newCityData);
      setCities(prev => [...prev, createdCity].sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Ошибка при добавлении города:', error);
    }
  };

  const handleChange = async (idx: number, field: keyof HistoricalObject, value: string) => {
    if (!lineId) return;
    const updatedCities = cities.map((city, i) =>
      i === idx ? { ...city, [field]: value } : city
    );
    setCities(updatedCities);

    const cityToUpdate = updatedCities[idx];
    if (cityToUpdate && cityToUpdate.id) {
      try {
        await historicalLines.updateObject(lineId, cityToUpdate.id, { [field]: value });
      } catch (error) {
        console.error(`Ошибка при обновлении поля ${field} города:`, error);
      }
    }
  };

  const handleRemove = async (idx: number) => {
    if (!lineId) return;
    const cityToRemove = cities[idx];
    if (cityToRemove && cityToRemove.id) {
      try {
        await historicalLines.deleteObject(lineId, cityToRemove.id);
        setCities(prev => prev.filter((_, i) => i !== idx));
      } catch (error) {
        console.error('Ошибка при удалении города:', error);
      }
    }
  };

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    if (!lineId) return;
    const newCities = [...cities];
    let firstAffectedCity: HistoricalObject | undefined;
    let secondAffectedCity: HistoricalObject | undefined;

    if (dir === 'up' && idx > 0) {
      firstAffectedCity = newCities[idx - 1];
      secondAffectedCity = newCities[idx];
      [newCities[idx - 1], newCities[idx]] = [newCities[idx], newCities[idx - 1]];
    } else if (dir === 'down' && idx < newCities.length - 1) {
      firstAffectedCity = newCities[idx];
      secondAffectedCity = newCities[idx + 1];
      [newCities[idx], newCities[idx + 1]] = [newCities[idx + 1], newCities[idx]];
    } else {
      return;
    }

    const updatedCitiesWithOrder = newCities.map((city, i) => ({ ...city, order: i }));
    setCities(updatedCitiesWithOrder);

    try {
        if (firstAffectedCity && firstAffectedCity.id) {
            await historicalLines.updateObject(lineId, firstAffectedCity.id, { order: updatedCitiesWithOrder.find(c => c.id === firstAffectedCity?.id)?.order });
        }
        if (secondAffectedCity && secondAffectedCity.id) {
            await historicalLines.updateObject(lineId, secondAffectedCity.id, { order: updatedCitiesWithOrder.find(c => c.id === secondAffectedCity?.id)?.order });
        }
        const response = await historicalLines.getObjects(lineId);
        setCities(response.objects.sort((a, b) => a.order - b.order));
    } catch (error) {
        console.error('Ошибка при перемещении города:', error);
        const response = await historicalLines.getObjects(lineId);
        setCities(response.objects.sort((a, b) => a.order - b.order));
    }
  };

  const handleImageChange = (idx: number, file: File) => {
    // This is for local preview only, as there's no dedicated API for object images yet.
    const reader = new FileReader();
    reader.onload = e => {
      setCities(prev => prev.map((city, i) =>
        i === idx ? { ...city, image: e.target?.result as string } : city
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (idx: number) => () => {
    dragItem.current = idx;
  };
  const handleDragOver = (idx: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === idx) return;
    const newCities = [...cities];
    const [dragged] = newCities.splice(dragItem.current!, 1);
    newCities.splice(idx, 0, dragged);
    setCities(newCities.map((city, i) => ({ ...city, order: i })));
    dragItem.current = idx;
  };
  const handleDrop = async () => {
    dragItem.current = null;
    if (lineId) {
        try {
            await Promise.all(cities.map(async (city, i) => {
                if (city.order !== i) {
                    await historicalLines.updateObject(lineId, city.id, { order: i });
                }
            }));
            const response = await historicalLines.getObjects(lineId);
            setCities(response.objects.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Ошибка при обновлении порядка городов:', error);
            const response = await historicalLines.getObjects(lineId);
            setCities(response.objects.sort((a, b) => a.order - b.order));
        }
    }
  };

  return (
    <div className="cities-list-section">
      <h3>Города</h3>
      {cities.map((city, idx) => (
        <CityCard
          key={city.id || idx}
          title={city.title}
          description={city.description}
          videoUrl={city.videoUrl}
          image={city.image}
          order={city.order}
          onChange={(field, value) => handleChange(idx, field as keyof HistoricalObject, value)}
          onMoveUp={() => handleMove(idx, 'up')}
          onMoveDown={() => handleMove(idx, 'down')}
          onRemove={() => handleRemove(idx)}
          onImageChange={file => handleImageChange(idx, file)}
          onDragStart={handleDragStart(idx)}
          onDragOver={handleDragOver(idx)}
          onDrop={handleDrop}
        />
      ))}
      <div className="cities-list-add" onClick={handleAddCity}>
        <span className="cities-list-add-plus">+</span>
      </div>
    </div>
  );
};

export default CitiesListSection; 