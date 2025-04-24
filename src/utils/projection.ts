// Константы для проекции Ламберта
const R = 6371; // радиус Земли в километрах
const λ0 = 90 * Math.PI / 180; // центральный меридиан (90° в.д. - примерно центр России)
const φ1 = 50 * Math.PI / 180; // первая стандартная параллель
const φ2 = 70 * Math.PI / 180; // вторая стандартная параллель

const n = Math.log(Math.cos(φ1) * (1 / Math.cos(φ2))) /
         Math.log(Math.tan(Math.PI/4 + φ2/2) * (1 / Math.tan(Math.PI/4 + φ1/2)));
const F = (Math.cos(φ1) * Math.pow(Math.tan(Math.PI/4 + φ1/2), n)) / n;
const ρ0 = R * F * Math.pow(1 / Math.tan(Math.PI/4 + 60 * Math.PI/360), n); // для центральной точки России

export function lambertToXY(lat: number, lng: number): [number, number] {
  const φ = lat * Math.PI / 180;
  const λ = lng * Math.PI / 180;
  
  const ρ = R * F * Math.pow(1 / Math.tan(Math.PI/4 + φ/2), n);
  const θ = n * (λ - λ0);
  
  // Масштабируем координаты для SVG
  // Уменьшаем коэффициент масштабирования для более компактного отображения
  const x = ρ * Math.sin(θ) * 2;
  const y = (ρ0 - ρ * Math.cos(θ)) * 2;
  
  return [x, y];
}

export function coordsToXY(lat: number, lng: number): [number, number] {
  // Простое преобразование координат для отображения карты России
  // Масштабируем и смещаем координаты для центрирования карты
  const x = (lng - 80) * 15; // центрируем по долготе
  const y = -(lat - 60) * 15; // инвертируем широту для SVG и центрируем
  return [x, y];
} 