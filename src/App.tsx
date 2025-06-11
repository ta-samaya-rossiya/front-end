import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Map } from './pages/Map/Map';
import HistoricalLinesPage from './pages/HistoricalLinesPage/HistoricalLinesPage';
import './App.css';
import { Region } from './types/map';

interface MapPageProps {
  linkTo: string;
  link: string;
  showIndicators?: boolean;
  onRegionClick: (region: Region) => void;
}

const RenderMapPage: React.FC<MapPageProps> = ({ linkTo, link, showIndicators = false, onRegionClick }) => (
  <div className="page">
    <div className="app-content">
      <Map
        onRegionClick={onRegionClick}
        linkTo={linkTo}
        link={link}
        showIndicators={showIndicators}
      />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <RenderMapPage
                linkTo="Показатели"
                link="/indicators"
                onRegionClick={(region) => console.log('Region clicked:', region.title)}
              />
            }
          />
          <Route
            path="/indicators"
            element={
              <RenderMapPage
                linkTo="Историческая карта"
                link="/"
                showIndicators={true}
                onRegionClick={(region) => {
                  console.log('Region indicators:', region);
                }}
              />
            }
          />
          <Route path="/admin/historical-lines" element={<HistoricalLinesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
