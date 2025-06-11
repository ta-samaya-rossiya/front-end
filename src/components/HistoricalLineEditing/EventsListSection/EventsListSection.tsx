import React from 'react';
import { HistoricalEventData } from '../../types/historicalLines';

interface EventsListSectionProps {
  historicalEvents: HistoricalEventData[] | undefined;
}

const EventsListSection: React.FC<EventsListSectionProps> = ({
  historicalEvents,
}) => {
  return (
    <div className="events-list-section">
      <h3>События</h3>
      {historicalEvents && historicalEvents.length > 0 ? (
        <ul>
          {historicalEvents.map((event) => (
            <li key={event.id}>
              {event.date}: {event.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>События не добавлены.</p>
      )}
      <button>Добавить событие</button>
    </div>
  );
};

export default EventsListSection; 