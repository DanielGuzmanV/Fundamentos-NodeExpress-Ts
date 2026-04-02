export interface FiltrosProducto {
  min_precio?: number | string;
  nombre?: string;
  orden?: 'caro' | 'barato' | 'nombre';
  limite?: number | string;
  pagina?: number | string;
}