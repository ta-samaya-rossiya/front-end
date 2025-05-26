import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Map } from './components/Map/Map';
import HistoricalLinesPage from './pages/HistoricalLinesPage/HistoricalLinesPage';
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
      <div className="App">
        <Routes>
          <Route path="/" element={<HistoricalMapPage />} />
          <Route path="/indicators" element={<IndicatorsMapPage />} />
          <Route path="/admin/historical-lines" element={<HistoricalLinesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
