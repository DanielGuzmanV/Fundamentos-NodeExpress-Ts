export interface Venta {
  id?: number;
  producto_id: number;
  usuario_id: number;
  cantidad: number;
  precio_unidad: number;
  total: number;
  fecha?: string;
}

export interface VentaUsuario {
  usuario_id: number;
  usuario_username: string;
  total_ventas: number;
  cantidad_ventas: number;
}