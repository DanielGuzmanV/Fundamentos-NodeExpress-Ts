export interface Venta {
  id?: number;
  producto_id: number;
  usuario_id: number;
  cantidad: number;
  precio_unidad: number;
  total: number;
  fecha?: string;
  activo?: number;
}

export interface VentaUsuario {
  usuario_id: number;
  usuario_username: string;
  total_ventas_activas: number;
  cantidad_ventas_activas: number;
  total_ventas_canceladas: number;
  cantidad_ventas_canceladas: number;
  total_global_ventas: number;
  cantidad_global_ventas: number;
}