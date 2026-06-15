export interface Venta {
  id?: number;
  producto_id: number;
  usuario_id: number;
  cantidad: number;
  precio_unidad: number;
  total: number;
  fecha?: string;
}