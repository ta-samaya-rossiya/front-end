# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Endpoints

### Layers

#### GET /layers
Получение всех слоев карты

Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "type": "indicators" | "historical",
    "country": {
      "id": "string",
      "name": "string",
      "bounds": [[number, number], [number, number]],
      "regions": []
    },
    "points": [],
    "regions": [],
    "historicalEvents": []
  }
]
```

#### GET /layers/:id
Получение слоя по ID

#### POST /layers
Создание нового слоя

Request:
```json
{
  "name": "string",
  "type": "indicators" | "historical",
  "countryId": "string"
}
```

#### PATCH /layers/:id
Обновление слоя

#### DELETE /layers/:id
Удаление слоя

### Points

#### POST /layers/:layerId/points
Создание новой точки

Request:
```json
{
  "name": "string",
  "coordinates": [number, number],
  "type": "city" | "region",
  "icon": "string",
  "description": "string"
}
```

#### PATCH /layers/:layerId/points/:pointId
Обновление точки

#### DELETE /layers/:layerId/points/:pointId
Удаление точки

### Regions

#### POST /layers/:layerId/regions
Создание нового региона

Request:
```json
{
  "name": "string",
  "coordinates": [[number, number]],
  "color": "string",
  "isActive": boolean,
  "description": "string"
}
```

#### PATCH /layers/:layerId/regions/:regionId
Обновление региона

#### DELETE /layers/:layerId/regions/:regionId
Удаление региона

### Historical Events

#### POST /layers/:layerId/events
Создание нового исторического события

Request:
```json
{
  "date": "string",
  "description": "string",
  "points": ["string"],
  "connections": [["string", "string"]]
}
```

#### PATCH /layers/:layerId/events/:eventId
Обновление исторического события

#### DELETE /layers/:layerId/events/:eventId
Удаление исторического события

### Countries

#### GET /countries
Получение всех стран

Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "bounds": [[number, number], [number, number]],
    "regions": []
  }
]
```

#### POST /countries
Создание новой страны

Request:
```json
{
  "name": "string",
  "bounds": [[number, number], [number, number]]
}
```

#### PATCH /countries/:id
Обновление страны

### Upload

#### POST /upload/icon
Загрузка иконки

Request:
```
Content-Type: multipart/form-data
icon: File
```

Response:
```json
{
  "url": "string"
}
```

## Error Responses

```json
{
  "error": "string",
  "message": "string"
}
```

Status Codes:
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error 