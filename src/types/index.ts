export interface Categoria {
  id?: number;
  nombre: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria_id: number;
}