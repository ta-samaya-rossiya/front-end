import React from 'react';

interface RegionsListSectionProps {
  selectedLine: { regions?: string[] } | null;
  handleRemoveRegion: (regionName: string) => void;
}

const RegionsListSection: React.FC<RegionsListSectionProps> = ({
  selectedLine,
  handleRemoveRegion,
}) => {
  return (
    <div className="regions-list-section">
      <h3>Регионы</h3>
      {selectedLine?.regions && selectedLine.regions.length > 0 ? (
        <ul>
          {selectedLine.regions.map((regionName, index) => (
            <li key={index}>
              {regionName} <button onClick={() => handleRemoveRegion(regionName)}>Удалить</button>
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