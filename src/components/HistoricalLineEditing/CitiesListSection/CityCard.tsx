// CityCard.tsx
// Этот компонент представляет собой карточку для редактирования информации об историческом объекте (городе), включая его название, описание, видео, изображение и порядок.
import React, { useRef } from 'react';
// Импорт иконок
import trash from '../../../assets/trash-can30x30.png'
import placeholder from '../../../assets/cityCardPlaceholder.png'
import folderIcon from '../../../assets/folderIcon.png'
import up from '../../../assets/upArrow.png'
import down from '../../../assets/downArrow.png'
import burger from '../../../assets/burger-icon.png'

// Интерфейс для пропсов компонента CityCard
interface CityCardProps {
  title: string; // Заголовок/название города
  description: string; // Описание города
  videoUrl: string; // URL видео, связанного с городом
  image?: string; // Опциональная ссылка на изображение города
  order: number; // Порядок города в списке
  onChange: (field: string, value: string) => void; // Колбэк для изменения полей города
  onMoveUp: () => void; // Колбэк для перемещения города вверх
  onMoveDown: () => void; // Колбэк для перемещения города вниз
  onRemove: () => void; // Колбэк для удаления города
  onImageChange: (file: File) => void; // Колбэк для изменения изображения города
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void; // Колбэк для начала перетаскивания
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; // Колбэк для перетаскивания над элементом
  onDrop: () => void; // Колбэк для завершения перетаскивания
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
  // Ref для доступа к скрытому полю ввода файла
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Генерируем уникальный ID для поля ввода файла
  const inputId = `city-image-input-${Math.random()}`;

  // Обработчик клика по изображению-плейсхолдеру, который вызывает клик по скрытому полю ввода файла
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Обработчик изменения файла, выбранного через поле ввода
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]); // Вызываем колбэк с выбранным файлом
    }
  };

  return (
    <div className="city-card">
      {/* Элементы управления порядком и перетаскиванием карточки */}
      <div className='card-controls'>
        <img src={up} alt="Сдвинуть вверх" onClick={onMoveUp}/>
        <img
          src={burger}
          alt="Передвинуть"
          className='city-card-burger'
          draggable // Делает элемент перетаскиваемым
          onDragStart={onDragStart} // Обработчик начала перетаскивания
          onDragOver={onDragOver} // Обработчик перетаскивания над элементом
          onDrop={onDrop} // Обработчик завершения перетаскивания
        />
        <img src={down} alt="Сдвинуть вниз" onClick={onMoveDown} />
      </div>
      {/* Сетка полей ввода для информации о городе */}
      <div className="city-card-fields-grid">
        <div className="city-card-fields-col city-card-fields-main">
          <div>
            <label htmlFor='name' >Название</label>
            <input
              id='name'
              type="text"
              value={title}
              onChange={e => onChange('title', e.target.value)} // Обновление названия
            />
          </div>
          <div>
            <label htmlFor="url">Ссылка на видео</label>
            <input
              id='url'
              type="text"
              value={videoUrl}
              onChange={e => onChange('videoUrl', e.target.value)} // Обновление ссылки на видео
            />
          </div>
        </div>
        <div className="city-card-fields-col city-card-fields-video">
          <div>
            <label htmlFor="description">Описание</label>
            <textarea
              id='description'
              value={description}
              onChange={e => onChange('description', e.target.value)} // Обновление описания
            />
          </div>
        </div>
        {/* Раздел для управления изображением города */}
        <div className="city-card-fields-col city-card-fields-image">
          <div>
            <label htmlFor={inputId} className="city-card-image-label">
              Добавить изображение
              <img src={folderIcon} />
            </label>
            {/* Плейсхолдер для изображения, который также служит кнопкой для загрузки */}
            <div className="city-card-image-placeholder" onClick={handleImageClick}>
              {image ? (
                <img src={image} alt="Город" className="city-card-image" /> // Отображение загруженного изображения
              ) : (
                <img src={placeholder} alt='Загрузка фото' className="city-card-image" /> // Отображение плейсхолдера
              )}
            </div>
            {/* Скрытое поле ввода файла для выбора изображения */}
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
      {/* Кнопка удаления карточки города */}
      <div className="city-card-controls">
        <img src={trash} alt='Удалить' onClick={onRemove} />
      </div>
    </div>
  );
};

export default CityCard; 