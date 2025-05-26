import React from 'react';
import { HistoricalLineCardData } from '../../types/historicalLines';
import SideNavigation from './SideNavigation';

import GeneralInfoSection from './GeneralInfoSection';
import AddRegionsSection from './AddRegionsSection';
import RegionsListSection from './RegionsListSection';
import CitiesListSection from './CitiesListSection';
import MarkersListSection from './MarkersListSection';
import EventsListSection from './EventsListSection';

interface HistoricalLineEditingProps {
  selectedLine: HistoricalLineCardData | null;
  activeSideSection: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setActiveSideSection: (section: string) => void;
  handleAddRegion: () => void;
  handleRemoveRegion: (regionName: string) => void;
  handleSaveLine: () => void;
  handleCancelEdit: () => void;
  handleDeleteLine: () => void;
  handleMarkerChange: (file: File | null) => void;
}

const HistoricalLineEditing: React.FC<HistoricalLineEditingProps> = ({
  selectedLine,
  activeSideSection,
  handleInputChange,
  handleCheckboxChange,
  setActiveSideSection,
  handleAddRegion,
  handleRemoveRegion,
  handleSaveLine,
  handleCancelEdit,
  handleDeleteLine,
  handleMarkerChange,
}) => {
  return <>
    <div className="editing-section-container">
        <div className="editing-side-section-content-container">
          <div>
            {activeSideSection === 'general' && (
              <GeneralInfoSection
                selectedLine={selectedLine}
                handleInputChange={handleInputChange}
                handleSaveLine={handleSaveLine}
                handleCancelEdit={handleCancelEdit}
                handleDeleteLine={handleDeleteLine}
                handleCheckboxChange={handleCheckboxChange}
                handleMarkerChange={handleMarkerChange}
              />
            )}

            {activeSideSection === 'add-regions' && (
              <AddRegionsSection handleAddRegion={handleAddRegion} />
            )}

            {activeSideSection === 'regions' && (
              <RegionsListSection selectedLine={selectedLine} handleRemoveRegion={handleRemoveRegion} />
            )}

            {activeSideSection === 'cities' && (
              <CitiesListSection />
            )}

            {activeSideSection === 'markers' && (
              <MarkersListSection />
            )}

            {activeSideSection === 'events' && (
              <EventsListSection historicalEvents={selectedLine?.historicalEvents} />
            )}
          </div>
        </div>
    </div>
    <SideNavigation
          activeSideSection={activeSideSection}
          setActiveSideSection={setActiveSideSection}
        />
  </>
};

export default HistoricalLineEditing; 