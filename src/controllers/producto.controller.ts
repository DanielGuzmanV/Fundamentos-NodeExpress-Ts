import { Request, Response, NextFunction } from "express";
import { Producto } from "../types/index.js";
import ProductoService from "../services/producto.service.js";

// Consulta 1: Obtener todos
export const obtenerProductos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await ProductoService.listaProductos();

    res.status(200).json({
      nota: rows.length > 0 ? "Productos obtenidos" : "No se encontraron productos",
      cantidad: rows.length,
      productos: rows.length > 0 ? rows : {
        formato_producto: {
          nombre: "string",
          precio: "number",
          stock: "number",
          categoria_id: "number",
        }
      } 
    })
  } catch (err) {
    next(err);
  }
};

// Consulta 2: Obtener producto por ID
export const productoID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const producto = await ProductoService.obtenerProductoID(id)

    res.status(200).json({
      mensaje: "Producto encontrado",
      datos: producto
    });

  } catch (err: any) {
    if(err.message === "NOT_FOUND_ID") {
      return res.status(400).json({error: "ID no valido"})
    }
    if(err.message === "NOT_FOUND_PRODUCT") {
      return res.status(404).json({mensaje: "Producto no encontrado"})
    }
    next(err)
  }
}

// Consulta 3: crear un nuevo producto
export const crearProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const datosProducto: Producto = req.body;
    await ProductoService.crearNuevoProducto(datosProducto);
    
    res.status(201).json({
      mensaje: "Producto guardado con exito",
      producto: datosProducto
    });

  } catch (err: any) {
    if(err.message === "CATEGORIA_NOT_FOUND") {
      return res.status(400).json({error: "La categoria especificada no existe"});
    }
    if(err.message === "INVALID_PRICE") {
      return res.status(400).json({error: "El precio debe ser un numero valido"})
    }
    next(err)
  }
}