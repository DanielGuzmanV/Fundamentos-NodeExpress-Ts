import ProductoModel from "../models/producto.model.js";
import CategoriaModel from "../models/categoria.model.js";
import { Producto } from "../types/index.js";

const ProductoService = {

  // Service 1: obtener productos procesados
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

  // Service 2: obtener productos por el ID
  obtenerProductoID: async (id: string | string[] | undefined) => {
    const idNumerico = Number(id);
    if(isNaN(idNumerico)) throw new Error("NOT_FOUND_ID")

    const producto = await ProductoModel.getById(idNumerico);
    if(!producto) throw new Error("NOT_FOUND_PRODUCT")

    return producto;
  },

  // Creacion de producto con validacion de negocio
  crearNuevoProducto: async(datos: Producto) => {
    // Verificamos si la categoria existe:
    const existeCat = await CategoriaModel.getById(datos.categoria_id);
    if(!existeCat) throw new Error("CATEGORIA_NOT_FOUND");

    // Verificamos si el nombre ya existe:
    const productoExiste = await ProductoModel.getByName(datos.nombre);
    if(productoExiste) throw new Error("PRODUCT_NAME_EXISTS");

    return await ProductoModel.create(datos);
  },

  actualizarProducto: async(id: number, datos: Producto) => {
    // Verificamos si el producto existe:
    const productoActual = await ProductoModel.getById(id);
    if(!productoActual) throw new Error("PRODUCT_NOT_FOUND");

    // Verificamos si el nombre ya existe:
    if(datos.nombre !== productoActual.nombre) {
      const duplicado = await ProductoModel.getByName(datos.nombre);
      if(duplicado) throw new Error("PRODUCT_NAME_EXISTS");
    }

    // Verificamos que la categoria actualizada exista:
    const existeCat = await CategoriaModel.getById(datos.categoria_id);
    if(!existeCat) throw new Error("CATEGORIA_NOT_FOUND");

    return await ProductoModel.update(id, datos);
  },

  // Services para validar y actualizar parcialmente un producto
  actualizarParcial: async (id: number, campos: Partial<Producto>) => {
    const productoActual = await ProductoModel.getById(id);
    if(!productoActual) throw new Error("PRODUCT_NOT_FOUND");

    if(campos.nombre && campos.nombre !== productoActual.nombre) {
      const duplicado = await ProductoModel.getByName(campos.nombre);
      if(duplicado) throw new Error("PRODUCT_NAME_EXISTS");
    }

    if(campos.categoria_id) {
      const existeCat = await CategoriaModel.getById(campos.categoria_id);
      if(!existeCat) throw new Error("CATEGORIA_NOT_FOUND");
    }

    return await ProductoModel.updatePartial(id, campos);
  },

  // Services para ocultar un producto al cliente pero no en la db
  ocultarProducto: async (id: number) => {
    const producto =await ProductoModel.getById(id);
    if(!producto) {
      throw new Error("PRODUCT_NOT_FOUND_OR_ALREADY_HIDDEN");
    }

    await ProductoModel.updateState(id);
    return producto;
  },
  
  // Services para mostrar un producto ocultado
  restaurarProducto: async (id: number) => {
    const producto = await ProductoModel.getAnyById(id)
    if(!producto) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    if(producto.activo === 1) {
      throw new Error("PRODUCT_ALREADY_ACTIVE");
    }

    await ProductoModel.restoreState(id);

    return producto;
  },

  // Services para eliminar un solo producto
  eliminarProducto: async (id: number) => {
    const producto = await ProductoModel.getAnyById(id);
    if(!producto) throw new Error("PRODUCT_NOT_FOUND");

    await ProductoModel.delete(id);
    return producto;
  },

  // Services para eliminar todos los productos
  eliminarTodo: async () => {
    const cantidadBorrada = await ProductoModel.deleteAll();
    if(cantidadBorrada === 0) throw new Error("NO_PRODUCTS_TO_DELETE");

    return cantidadBorrada;
  }
}

export default ProductoService;