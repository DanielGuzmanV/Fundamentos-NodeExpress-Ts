import ProductoModel from "../models/producto.model.js";
import CategoriaModel from "../models/categoria.model.js";
import { Producto } from "../types/index.js";

const ProductoService = {

  // Obtener productos procesados
  listaProductos: async() => {
    const productos = await ProductoModel.getAll();
    return productos.map(p => {
      const {activo, categoria_id, ...productosSinActivo} = p;

      return {
        ...productosSinActivo,
        estado_stock: p.stock < 5 ? 'Bajo': 'Suficiente'
      }
    });
  },

  // validacion y verificacion
  obtenerProductoID: async (id: string | string[] | undefined) => {
    const idNumerico = Number(id);

    if(isNaN(idNumerico)) throw new Error("NOT_FOUND_ID")

    const producto = await ProductoModel.getById(idNumerico);

    if(!producto) throw new Error("NOT_FOUND_PRODUCT")

    const {categoria_id, activo, ...productoId} = producto;

    return productoId;
  },

  // Creacion de producto con validacion de negocio
  crearNuevoProducto: async(datos: Producto) => {
    const categorias = await CategoriaModel.getAll();
    const existeCat = categorias.find(c => c.id === datos.categoria_id);

    if(!existeCat) throw new Error("CATEGORIA_NOT_FOUND");

    if(datos.precio <= 0) throw new Error("INVALID_PRICE");

    return await ProductoModel.create(datos);
  },

}

export default ProductoService;