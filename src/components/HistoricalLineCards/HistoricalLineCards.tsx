// HistoricalLineCards.tsx
// Этот компонент отображает список исторических линий в виде карточек, позволяя фильтровать их по поисковому запросу и переходить к редактированию.
import React from 'react';
import '../../pages/HistoricalLinesPage/HistoricalLinesPage.css'; // Предполагается, что файл стилей будет доступен
import marker from '../../assets/marker_placeholder.png'
import edit from '../../assets/edit.png'
import { HistoricalLineCardData } from '../../types/historicalLines'

interface HistoricalLineCardsProps {
  historicalLines: HistoricalLineCardData[]; // Массив данных исторических линий для отображения
  searchTerm: string; // Строка поиска для фильтрации линий
  handleEditLine: (id: string) => void; // Функция для обработки редактирования линии
}

const HistoricalLineCards: React.FC<HistoricalLineCardsProps> = ({ historicalLines, searchTerm, handleEditLine }) => {
  return (
    <div className="historical-line-cards">
      {/* Фильтрация линий по поисковому запросу и их отображение */}
      {historicalLines
        .filter(line => line.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(line => (
        <div key={line.id} className="historical-line-card">
          <h3>
            {line.title}
            {/* Кнопка редактирования линии */}
            <img src={edit} alt='Редактировать' onClick={() => handleEditLine(line.id)} />
          </h3>
          <div className="card-content">
            <label>Маркер линии:</label>
            <div className="camera-placeholder">
              {/* Отображение изображения маркера или плейсхолдера */}
              <img src={line.markerImage ? line.markerImage : marker} alt="Маркер линии" />
            </div>
          </div>
          {/* Отображение статуса активности линии */}
          <div className="status">{line.isActive ? 'Активна' : 'Нективна'}</div>
        </div>
      ))}
    </div>
  );
};

export default HistoricalLineCards;