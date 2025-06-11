import React, { useState, useEffect } from 'react';
import './RegionActivation.css';
import { MapComponent } from '../../MapComponent/MapComponent';
import { HistoricalLineCardData } from '../../../types/historicalLines';
import { Region } from '../../../types/map';
import { regions } from '../../../api/regions';

interface RegionActivationProps {
  selectedLine: HistoricalLineCardData | null;
  onUpdateActiveRegions: (activeRegionIds: string[]) => void;
}

const RegionActivation: React.FC<RegionActivationProps> = ({ selectedLine, onUpdateActiveRegions }) => {
  const [regionsData, setRegionsData] = useState<Region[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await regions.getAllRegions();
        // Устанавливаем isActive на основе selectedLine.activeRegionsIds
        const initialRegions = data.regions.map((region: Region) => ({
          ...region,
          isActive: selectedLine?.activeRegions?.some(ar => ar.id === region.id) || false,
        }));
        setRegionsData(initialRegions);
      } catch (error) {
        console.error('Ошибка при получении регионов:', error);
      }
    };

    fetchRegions();
  }, [selectedLine]);

  const handleRegionClick = (region: Region) => {
    const updatedRegions = regionsData.map(r => 
      r.id === region.id ? { ...r, isActive: !r.isActive } : r
    );
    setRegionsData(updatedRegions);
  };

  const handleSave = () => {
    const activeRegionIds = regionsData.filter(r => r.isActive).map(r => r.id);
    onUpdateActiveRegions(activeRegionIds);
  };

  return (
    <div className="region-activation-wrapper">
      <div className="region-activation-title">
        {selectedLine?.title} 
        <button className="region-activation-save-btn" onClick={handleSave}>
          Сохранить
        </button>
      </div>
      <div className="region-activation-map-container">
        <MapComponent 
          regions={regionsData}
          onRegionClick={handleRegionClick}
          showIndicators={false}
        />
      </div>
    </div>
  );
};

export default RegionActivation; 