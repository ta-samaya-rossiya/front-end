import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Map } from './components/Map/Map';
import './App.css';

function HistoricalMapPage() {

  return (
    <div className="page">
      <div className="app-content">
          <Map
            onRegionClick={(region) => console.log('Region clicked:', region.title)}
            linkTo="Показатели"
            link="/indicators"
          />
      </div>
      
    </div>
  );
}

function IndicatorsMapPage() {

  return (
    <div className="page">
      <div className="app-content">
          <Map
            onRegionClick={(region) => {
              // Здесь будет логика отображения показателей региона
              console.log('Region indicators:', region);
            }}
            showIndicators={true}
            linkTo="Историческая карта"
            link="/"
          />
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
