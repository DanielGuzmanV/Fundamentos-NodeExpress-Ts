export interface Categoria {
  id?: number;
  nombre: string;
  activo: number;
}

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  activo?: number;
  categoria_id: number;
}