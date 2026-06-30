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

// Reporte de ventas por usuarios
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

// Reporte de ventas por producto 
export interface VentaPorProducto {
  producto_id: number;
  producto_nombre: string;
  producto_precio: number;
  total_ventas_producto: number;
  cantidad_unidades_vendidas: number;
  cantidad_ventas_totales: number;
}