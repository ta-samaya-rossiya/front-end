import React from 'react';
import './RegionsListSection.css';
import trashCanIcon from '../../../assets/trash-can10x10.png';
import { HistoricalLineCardData } from '../../../types/historicalLines';

interface RegionsListSectionProps {
  selectedLine: HistoricalLineCardData | null;
  handleRemoveRegion: (regionName: string) => void;
}

const RegionsListSection: React.FC<RegionsListSectionProps> = ({
  selectedLine,
  handleRemoveRegion,
}) => {
  return (
    <div className="regions-list-section">
      <h3>Регионы</h3>
      {selectedLine?.addedRegions && selectedLine.addedRegions.length > 0 ? (
        <ul>
          {selectedLine.addedRegions.map((region, index) => (
            <li key={index}>
              {region.title}
              <img onClick={() => handleRemoveRegion(region.title)}
              src={trashCanIcon} alt="Удалить" className="trash-icon" />
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет добавленных регионов</p>
      )}
    </div>
  );
};

export default RegionsListSection; 