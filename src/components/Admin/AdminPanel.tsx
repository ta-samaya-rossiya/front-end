import React, { useState } from 'react';
import { Point, Region, MapLayer } from '../../types/map';
import { mapApi } from '../../services/api';
import { IconUpload } from '../../components/IconUpload';
import './AdminPanel.css';

interface AdminPanelProps {
  layer: MapLayer;
  onLayerUpdate: (layer: MapLayer) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ layer, onLayerUpdate }) => {
  const [isPointDialogOpen, setIsPointDialogOpen] = useState(false);
  const [isRegionDialogOpen, setIsRegionDialogOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const handleAddPoint = async (point: Omit<Point, 'id'>) => {
    try {
      const response = await mapApi.createPoint(layer.id, point);
      onLayerUpdate({
        ...layer,
        points: [...layer.points, response.data],
      });
      setIsPointDialogOpen(false);
    } catch (error) {
      console.error('Error adding point:', error);
    }
  };

  const handleEditPoint = async (pointId: string, point: Partial<Point>) => {
    try {
      const response = await mapApi.updatePoint(layer.id, pointId, point);
      onLayerUpdate({
        ...layer,
        points: layer.points.map((p) => (p.id === pointId ? response.data : p)),
      });
      setIsPointDialogOpen(false);
      setSelectedPoint(null);
    } catch (error) {
      console.error('Error updating point:', error);
    }
  };

  const handleAddRegion = async (region: Omit<Region, 'id'>) => {
    try {
      const response = await mapApi.createRegion(layer.id, region);
      onLayerUpdate({
        ...layer,
        regions: [...layer.regions, response.data],
      });
      setIsRegionDialogOpen(false);
    } catch (error) {
      console.error('Error adding region:', error);
    }
  };

  const handleEditRegion = async (regionId: string, region: Partial<Region>) => {
    try {
      const response = await mapApi.updateRegion(layer.id, regionId, region);
      onLayerUpdate({
        ...layer,
        regions: layer.regions.map((r) => (r.id === regionId ? response.data : r)),
      });
      setIsRegionDialogOpen(false);
      setSelectedRegion(null);
    } catch (error) {
      console.error('Error updating region:', error);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-section">
        <button className="button button-primary" onClick={() => setIsPointDialogOpen(true)}>
          <span className="icon">+</span>
          Добавить точку
        </button>
      </div>

      <div className="admin-panel-section">
        <button className="button button-primary" onClick={() => setIsRegionDialogOpen(true)}>
          <span className="icon">+</span>
          Добавить регион
        </button>
      </div>

      {isPointDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsPointDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog-title">
              {selectedPoint ? 'Редактировать точку' : 'Добавить новую точку'}
            </h2>
            <div className="dialog-content">
              <PointForm
                point={selectedPoint}
                onSubmit={(point) =>
                  selectedPoint
                    ? handleEditPoint(selectedPoint.id, point)
                    : handleAddPoint(point as Omit<Point, 'id'>)
                }
                onCancel={() => {
                  setIsPointDialogOpen(false);
                  setSelectedPoint(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isRegionDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsRegionDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog-title">
              {selectedRegion ? 'Редактировать регион' : 'Добавить новый регион'}
            </h2>
            <div className="dialog-content">
              <RegionForm
                region={selectedRegion}
                onSubmit={(region) =>
                  selectedRegion
                    ? handleEditRegion(selectedRegion.id, region)
                    : handleAddRegion(region as Omit<Region, 'id'>)
                }
                onCancel={() => {
                  setIsRegionDialogOpen(false);
                  setSelectedRegion(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PointFormProps {
  point?: Point | null;
  onSubmit: (point: Partial<Point>) => void;
  onCancel: () => void;
}

const PointForm: React.FC<PointFormProps> = ({ point, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Point>>(
    point || {
      name: '',
      coordinates: [0, 0],
      type: 'city',
      description: '',
    }
  );

  const handleIconUpload = (url: string) => {
    setFormData({ ...formData, icon: url });
  };

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="form-field">
        <label className="form-label">Название</label>
        <input
          className="form-input"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Широта</label>
        <input
          className="form-input"
          type="number"
          step="0.000001"
          value={formData.coordinates?.[0]}
          onChange={(e) =>
            setFormData({
              ...formData,
              coordinates: [parseFloat(e.target.value), formData.coordinates?.[1] || 0],
            })
          }
        />
      </div>

      <div className="form-field">
        <label className="form-label">Долгота</label>
        <input
          className="form-input"
          type="number"
          step="0.000001"
          value={formData.coordinates?.[1]}
          onChange={(e) =>
            setFormData({
              ...formData,
              coordinates: [formData.coordinates?.[0] || 0, parseFloat(e.target.value)],
            })
          }
        />
      </div>

      <div className="form-field">
        <label className="form-label">Тип</label>
        <select
          className="form-select"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'city' | 'region' })}
        >
          <option value="city">Город</option>
          <option value="region">Регион</option>
        </select>
      </div>

      <div className="form-field">
        <label className="form-label">Описание</label>
        <textarea
          className="form-input"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Иконка</label>
        <IconUpload onFileSelect={handleIconUpload} />
      </div>

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="button button-primary">
          {point ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};

interface RegionFormProps {
  region?: Region | null;
  onSubmit: (region: Partial<Region>) => void;
  onCancel: () => void;
}

const RegionForm: React.FC<RegionFormProps> = ({ region, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Region>>(
    region || {
      name: '',
      coordinates: [],
      color: '#ff0000',
      isActive: true,
      description: '',
    }
  );

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="form-field">
        <label className="form-label">Название</label>
        <input
          className="form-input"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Цвет</label>
        <input
          className="color-picker"
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Описание</label>
        <textarea
          className="form-input"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="button button-primary">
          {region ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}; 