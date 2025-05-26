import React from 'react';
import '../../pages/HistoricalLinesPage/HistoricalLinesPage.css'; // Предполагается, что файл стилей будет доступен
import marker from '../../assets/marker_placeholder.png'
import edit from '../../assets/edit.png'
import { HistoricalLineCardData } from '../../types/historicalLines'

interface HistoricalLineCardsProps {
  historicalLines: HistoricalLineCardData[];
  searchTerm: string;
  handleEditLine: (id: string) => void;
}

const HistoricalLineCards: React.FC<HistoricalLineCardsProps> = ({ historicalLines, searchTerm, handleEditLine }) => {
  return (
    <div className="historical-line-cards">
      {historicalLines
        .filter(line => line.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(line => (
        <div key={line.id} className="historical-line-card">
          <h3>
            {line.name}
            <img src={edit} alt='Редактировать' onClick={() => handleEditLine(line.id)} />
          </h3>
          <div className="card-content">
            <label>Маркер линии:</label>
            <div className="camera-placeholder">
              <img src={line.marker ? line.marker : marker} alt="Маркер линии" />
            </div>
          </div>
          <div className="status">{line.isActive ? 'Активна' : 'Нективна'}</div>
        </div>
      ))}
    </div>
  );
};

export default HistoricalLineCards;