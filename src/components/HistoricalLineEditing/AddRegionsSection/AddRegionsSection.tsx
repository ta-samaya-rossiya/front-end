import React, { useState } from 'react';
import './AddRegionsSection.css';
import { adminRegions } from '@/api/adminRegions';

export interface Region {
  title: string;
  id: number;
}

interface SearchRegionResponse {
  completed: boolean;
  message: string;
  results: Region[];
}

interface AddRegionsSectionProps {
  handleAddRegion: (regionName: Region) => void;
}

const AddRegionsSection: React.FC<AddRegionsSectionProps> = ({
    handleAddRegion
  }) => {

  const [regions, setRegions] = useState<Region[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSearch = async (value: string) => {
    try {
      const response = await adminRegions.searchRegionOPM(value) as unknown as SearchRegionResponse;
      setRegions(response.results);
    } catch (error) {
      console.error('Ошибка при поиске регионов:', error);
    }
  };

  return (
    <div className="add-regions-section">
      <div className="add-regions-header">Добавить регион</div>
      <div>
        <input 
          type="text" 
          placeholder="Поиск"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button onClick={() => handleSearch(inputValue)}>Найти</button>
      </div>
      <div>
        <ul className="add-regions-list">
          {regions.length > 0 ? (
            regions.map((region: Region) => (
              <li key={region.id} className="add-regions-list-item">
                <span className="region-title">{region.title}</span>
                <button className="add-region-btn" onClick={() => handleAddRegion(region)}>
                  Добавить
                </button>
              </li>
            ))
          ) : (
            <li className='add-regions-list-item'>
              <span className="region-title">Регионы с таким названием не найдены</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddRegionsSection; 