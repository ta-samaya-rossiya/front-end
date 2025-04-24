import React, { useState } from 'react';
import {
  Box,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { HistoricalEvent, Point, MapLayer } from '../../types/map';
import { mapApi } from '../../services/api';

interface HistoricalTimelineProps {
  layer: MapLayer;
  onLayerUpdate: (layer: MapLayer) => void;
  isAdmin?: boolean;
}

export const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({
  layer,
  onLayerUpdate,
  isAdmin,
}) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

  const handleAddEvent = async (event: Omit<HistoricalEvent, 'id'>) => {
    try {
      const response = await mapApi.createHistoricalEvent(layer.id, event);
      onLayerUpdate({
        ...layer,
        historicalEvents: [...(layer.historicalEvents || []), response.data],
      });
      setIsEventDialogOpen(false);
    } catch (error) {
      console.error('Error adding historical event:', error);
    }
  };

  const handleEditEvent = async (eventId: string, event: Partial<HistoricalEvent>) => {
    try {
      const response = await mapApi.updateHistoricalEvent(layer.id, eventId, event);
      onLayerUpdate({
        ...layer,
        historicalEvents: layer.historicalEvents?.map((e) =>
          e.id === eventId ? response.data : e
        ),
      });
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating historical event:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {isAdmin && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsEventDialogOpen(true)}
          >
            Добавить историческое событие
          </Button>
        </Box>
      )}

      <Timeline>
        {layer.historicalEvents?.map((event) => (
          <TimelineItem key={event.id}>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6">{event.date}</Typography>
              <Typography>{event.description}</Typography>
              {isAdmin && (
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEventDialogOpen(true);
                  }}
                >
                  Редактировать
                </Button>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      <Dialog
        open={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        }}
      >
        <DialogTitle>
          {selectedEvent ? 'Редактировать событие' : 'Добавить новое событие'}
        </DialogTitle>
        <DialogContent>
          <EventForm
            event={selectedEvent}
            points={layer.points}
            onSubmit={(event) =>
              selectedEvent
                ? handleEditEvent(selectedEvent.id, event)
                : handleAddEvent(event as Omit<HistoricalEvent, 'id'>)
            }
            onCancel={() => {
              setIsEventDialogOpen(false);
              setSelectedEvent(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

interface EventFormProps {
  event?: HistoricalEvent | null;
  points: Point[];
  onSubmit: (event: Partial<HistoricalEvent>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, points, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<HistoricalEvent>>(
    event || {
      date: '',
      description: '',
      points: [],
      connections: [],
    }
  );

  const [selectedPoint1, setSelectedPoint1] = useState<string>('');
  const [selectedPoint2, setSelectedPoint2] = useState<string>('');

  const handleAddConnection = () => {
    if (selectedPoint1 && selectedPoint2 && selectedPoint1 !== selectedPoint2) {
      const newConnection: [string, string] = [selectedPoint1, selectedPoint2];
      if (!formData.connections?.some(
        ([p1, p2]) => (p1 === selectedPoint1 && p2 === selectedPoint2) ||
                     (p1 === selectedPoint2 && p2 === selectedPoint1)
      )) {
        setFormData({
          ...formData,
          connections: [...(formData.connections || []), newConnection],
        });
      }
      setSelectedPoint1('');
      setSelectedPoint2('');
    }
  };

  const handleRemoveConnection = (index: number) => {
    setFormData({
      ...formData,
      connections: formData.connections?.filter((_, i) => i !== index),
    });
  };

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Дата"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Описание"
        multiline
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Точка 1</InputLabel>
          <Select
            value={selectedPoint1}
            label="Точка 1"
            onChange={(e) => setSelectedPoint1(e.target.value as string)}
          >
            {points.map((point) => (
              <MenuItem key={point.id} value={point.id}>
                {point.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Точка 2</InputLabel>
          <Select
            value={selectedPoint2}
            label="Точка 2"
            onChange={(e) => setSelectedPoint2(e.target.value as string)}
          >
            {points.map((point) => (
              <MenuItem key={point.id} value={point.id}>
                {point.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleAddConnection}
          disabled={!selectedPoint1 || !selectedPoint2 || selectedPoint1 === selectedPoint2}
        >
          Добавить связь
        </Button>
      </Box>

      <List>
        {formData.connections?.map(([pointId1, pointId2], index) => {
          const point1 = points.find((p) => p.id === pointId1);
          const point2 = points.find((p) => p.id === pointId2);
          return (
            <ListItem
              key={`${pointId1}-${pointId2}`}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveConnection(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${point1?.name} ↔ ${point2?.name}`}
              />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Отмена</Button>
        <Button variant="contained" onClick={() => onSubmit(formData)}>
          {event ? 'Сохранить' : 'Добавить'}
        </Button>
      </Box>
    </Box>
  );
}; 