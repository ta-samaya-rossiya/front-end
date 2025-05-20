import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Map } from './components/Map/Map';
import { MapLayer } from './types/map';
import { mockLayers } from './constants/mockData';
import './App.css';

function HistoricalMapPage() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [activeLayer, setActiveLayer] = useState<MapLayer | null>(null);
  const [isAdmin] = useState(true);

  useEffect(() => {
    setLayers(mockLayers);
    if (mockLayers.length > 0) {
      setActiveLayer(mockLayers[0]);
    }
  }, []);


  return (
    <div className="page">
      <div className="app-content">
        {activeLayer && (
          <Map
            layers={layers}
            onPointClick={(point) => console.log('Point clicked:', point.name)}
            onRegionClick={(region) => console.log('Region clicked:', region.title)}
            isAdmin={isAdmin}
            linkTo="Показатели"
            link="/indicators"
          />
        )}
      </div>
      
    </div>
  );
}

function IndicatorsMapPage() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [activeLayer, setActiveLayer] = useState<MapLayer | null>(null);
  const [isAdmin] = useState(true);

  useEffect(() => {
    setLayers(mockLayers);
    if (mockLayers.length > 0) {
      setActiveLayer(mockLayers[0]);
    }
  }, []);


  return (
    <div className="page">
      <div className="app-content">
        {activeLayer && (
          <Map
            layers={layers}
            onPointClick={(point) => console.log('Point clicked:', point.name)}
            onRegionClick={(region) => {
              // Здесь будет логика отображения показателей региона
              console.log('Region indicators:', region);
            }}
            isAdmin={isAdmin}
            showIndicators={true}
            linkTo="Историческая карта"
            link="/"
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HistoricalMapPage />} />
          <Route path="/indicators" element={<IndicatorsMapPage />} />
        </Routes>
    </Router>
  );
}

export default App;
