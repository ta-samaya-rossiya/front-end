import React from 'react';
import './HistoricalLineEditing.css';
import { HistoricalLineCardData } from '../../../types/historicalLines';
import SideNavigation from '../SideNavigation/SideNavigation';
import type { Region } from '../AddRegionsSection/AddRegionsSection';

import GeneralInfoSection from '../GeneralInfoSection/GeneralInfoSection';
import AddRegionsSection from '../AddRegionsSection/AddRegionsSection';
import RegionsListSection from '../RegionsListSection/RegionsListSection';
import CitiesListSection from '../CitiesListSection/CitiesListSection';
import MarkersListSection from '../MarkersListSection/MarkersListSection';
import RegionActivation from '../RegionActivation/RegionActivation';

interface HistoricalLineEditingProps {
  selectedLine: HistoricalLineCardData | null;
  activeSideSection: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setActiveSideSection: (section: string) => void;
  handleRemoveRegion: (regionName: string) => void;
  handleSaveLine: () => void;
  handleCancelEdit: () => void;
  handleDeleteLine: () => void;
  handleMarkerChange: (file: File | null) => void;
  handleAddRegion: (region: Region) => void;
  onUpdateActiveRegions: (activeRegionIds: string[]) => void;
}

const HistoricalLineEditing: React.FC<HistoricalLineEditingProps> = ({
  selectedLine,
  activeSideSection,
  handleInputChange,
  handleCheckboxChange,
  setActiveSideSection,
  handleRemoveRegion,
  handleSaveLine,
  handleCancelEdit,
  handleDeleteLine,
  handleMarkerChange,
  handleAddRegion,
  onUpdateActiveRegions,
}) => {

  const sectionComponents: { [key: string]: React.ReactNode } = {
    general: (
      <GeneralInfoSection
        selectedLine={selectedLine}
        handleInputChange={handleInputChange}
        handleSaveLine={handleSaveLine}
        handleCancelEdit={handleCancelEdit}
        handleDeleteLine={handleDeleteLine}
        handleCheckboxChange={handleCheckboxChange}
        handleMarkerChange={handleMarkerChange}
      />
    ),
    'add-regions': (
      <div className="regions-editing-main">
        <div className="regions-editing-header">
          <span className="regions-editing-title">{selectedLine?.title || ''}</span>
          <button className="regions-editing-save-btn" onClick={handleSaveLine}>Сохранить</button>
        </div>
        <div className="regions-editing-content">
          <AddRegionsSection handleAddRegion={handleAddRegion} />
          <RegionsListSection selectedLine={selectedLine} handleRemoveRegion={handleRemoveRegion} />
        </div>
      </div>
    ),
    regions: (
      <RegionActivation 
        selectedLine={selectedLine}
        onUpdateActiveRegions={onUpdateActiveRegions}
      />
    ),
    cities: (
      <CitiesListSection lineId={selectedLine?.id || null} />
    ),
    markers: (
      <MarkersListSection />
    ),
  };

  return (
    <>
      <div className="editing-section-container">
        <div className="editing-side-section-content-container">
          {sectionComponents[activeSideSection]}
        </div>
      </div>
      <SideNavigation
        activeSideSection={activeSideSection}
        setActiveSideSection={setActiveSideSection}
      />
    </>
  );
};

export default HistoricalLineEditing; 