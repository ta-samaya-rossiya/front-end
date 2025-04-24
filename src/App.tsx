import { useState, useEffect } from 'react';
import { Map } from './components/Map/Map';
import { AdminPanel } from './components/Admin/AdminPanel';
import { MapLayer } from './types/map';
import { mockLayers } from './constants/mockData';
import './App.css';

function App() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [activeLayer, setActiveLayer] = useState<MapLayer | null>(null);
  const [isAdmin] = useState(true); // В реальном приложении это должно быть основано на аутентификации

  useEffect(() => {
    // Используем моковые данные вместо API
    setLayers(mockLayers);
    if (mockLayers.length > 0) {
      setActiveLayer(mockLayers[0]);
    }
  }, []);

  const handleLayerUpdate = (updatedLayer: MapLayer) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => (layer.id === updatedLayer.id ? updatedLayer : layer))
    );
    if (activeLayer?.id === updatedLayer.id) {
      setActiveLayer(updatedLayer);
    }
  };

  return (
    <div className="app">
      <div className="app-content">
        {activeLayer && (
          <Map
            layers={layers}
            onPointClick={(point) => console.log('Point clicked:', point.name)}
            onRegionClick={(region) => console.log('Region clicked:', region.title)}
            isAdmin={isAdmin}
          />
        )}
      </div>
      {isAdmin && activeLayer && (
        <div className="admin-panel-container">
          <div className="admin-panel-trigger" />
          <AdminPanel layer={activeLayer} onLayerUpdate={handleLayerUpdate} />
        </div>
      )}
    </div>
  );
}

export default App
