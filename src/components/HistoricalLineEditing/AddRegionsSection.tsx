import React from 'react';

interface AddRegionsSectionProps {
  handleAddRegion: () => void;
}

const AddRegionsSection: React.FC<AddRegionsSectionProps> = ({
  handleAddRegion,
}) => {
  return (
    <div className="add-regions-section">
      <h3>Добавление регионов</h3>
      <div>
        <input type="text" placeholder="Поиск региона" />
        <button onClick={handleAddRegion}>Найти</button>
      </div>
      <p>Результаты поиска...</p>
    </div>
  );
};

export default AddRegionsSection; 