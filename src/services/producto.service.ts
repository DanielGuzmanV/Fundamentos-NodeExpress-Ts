import ProductoModel from "../models/producto.model.js";
import CategoriaModel from "../models/categoria.model.js";
import { Producto } from "../types/index.js";

const ProductoService = {

  // Obtener productos procesados
  listaProductos: async(filtros: any) => {
    const {min_precio, pagina, limite, orden} = filtros;

    // Validar precio minimo:
    if(min_precio) {
      const precioNum = Number(min_precio);
      if(isNaN(precioNum)) throw new Error("INVALID_PRICE_FORMAT");
      if(precioNum < 0) throw new Error("NEGATIVE_PRICE");
    }

    // Validar paginacion:
    if(pagina) {
      const pagNum = Number(pagina);
      if(isNaN(pagNum) || pagNum <= 0) throw new Error("INVALID_PAGE");
    }

    // Validar el limite de productos
    if(limite) {
      const limNum = Number(limite);
      if(isNaN(limNum) || limNum <= 0) throw new Error("INVALID_LIMIT");
      if(limNum > 50) throw new Error("LIMIT_TOO_HIGH");
    } 

    // Validar orden:
    const ordenesValidos = ['caro', 'barato', 'nombre'];
    if(orden && !ordenesValidos.includes(orden)) {
      throw new Error("INVALID_ORDER_TYPE");
    }

    const productos = await ProductoModel.getAll(filtros);
    if(productos.length <= 0) throw new Error("NOT_PRODUCTS")
    
    return productos.map(p => {
      const datos = p;

      return {
        ...datos,
        estado_stock: p.stock < 5 ? 'Bajo': 'Suficiente'
      }
    });
  },
  // Agregar validaciones para el nombre, orden y controlar si en los strings son strings y los numeros son numericos


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