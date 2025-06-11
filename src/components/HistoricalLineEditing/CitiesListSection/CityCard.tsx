import React, { useRef } from 'react';
import trash from '../../../assets/trash-can30x30.png'
import placeholder from '../../../assets/cityCardPlaceholder.png'
import folderIcon from '../../../assets/folderIcon.png'
import up from '../../../assets/upArrow.png'
import down from '../../../assets/downArrow.png'
import burger from '../../../assets/burger-icon.png'

interface CityCardProps {
  title: string;
  description: string;
  videoUrl: string;
  image?: string;
  order: number;
  onChange: (field: string, value: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onImageChange: (file: File) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const CityCard: React.FC<CityCardProps> = ({
  title,
  description,
  videoUrl,
  image,
  order,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  onImageChange,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = `city-image-input-${Math.random()}`;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="city-card">
      <div className='card-controls'>
        <img src={up} alt="Сдвинуть вверх" onClick={onMoveUp}/>
        <img
          src={burger}
          alt="Передвинуть"
          className='city-card-burger'
          draggable
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
        <img src={down} alt="Сдвинуть вниз" onClick={onMoveDown} />
      </div>
      <div className="city-card-fields-grid">
        <div className="city-card-fields-col city-card-fields-main">
          <div>
            <label htmlFor='name' >Название</label>
            <input
              id='name'
              type="text"
              value={title}
              onChange={e => onChange('title', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="url">Ссылка на видео</label>
            <input
              id='url'
              type="text"
              value={videoUrl}
              onChange={e => onChange('videoUrl', e.target.value)}
            />
          </div>
        </div>
        <div className="city-card-fields-col city-card-fields-video">
          <div>
            <label htmlFor="description">Описание</label>
            <textarea
              id='description'
              value={description}
              onChange={e => onChange('description', e.target.value)}
            />
          </div>
        </div>
        <div className="city-card-fields-col city-card-fields-image">
          <div>
            <label htmlFor={inputId} className="city-card-image-label" style={{cursor: 'pointer'}}>
              Добавить изображение
              <img src={folderIcon} />
            </label>
            <div className="city-card-image-placeholder" onClick={handleImageClick} style={{cursor: 'pointer'}}>
              {image ? (
                <img src={image} alt="Город" className="city-card-image" />
              ) : (
                <img src={placeholder} alt='Загрузка фото' className="city-card-image" />
              )}
            </div>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      <div className="city-card-controls">
        <img src={trash} alt='Удалить' onClick={onRemove} />
      </div>
    </div>
  );
};

export default CityCard; 