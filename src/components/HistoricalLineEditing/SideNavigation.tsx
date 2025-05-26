import React from 'react';

interface SideNavigationProps {
  activeSideSection: string;
  setActiveSideSection: (section: string) => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  activeSideSection,
  setActiveSideSection,
}) => {
  const sections = [
    { name: 'general', label: 'Общая информация' },
    { name: 'add-regions', label: 'Добавление регионов' },
    { name: 'regions', label: 'Регионы' },
    { name: 'cities', label: 'Города' },
    { name: 'markers', label: 'Маркеры' },
    { name: 'events', label: 'События' },
  ];

  return (
    <div className="side-navigation">
      {sections.map((section) => (
        <button
          key={section.name}
          className={activeSideSection === section.name ? 'active' : ''}
          onClick={() => setActiveSideSection(section.name)}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
};

export default SideNavigation; 