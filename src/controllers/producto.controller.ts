import { Request, Response, NextFunction } from "express";
import { Producto } from "../types/index.js";
import ProductoService from "../services/producto.service.js";
import { error } from "console";

// Consulta 1: Obtener todos
export const obtenerProductos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filtros = req.query;
    const rows = await ProductoService.listaProductos(filtros);

    res.status(200).json({
      nota: "Productos obtenidos",
      pagina_actual: parseInt(req.query.pagina as string) || 1,
      cantidad_en_pagina: rows.length,
      productos: rows,
    })

  } catch (err: any) {
    if(err.message === "NOT_PRODUCTS") {
      return res.status(404).json({
        error: "No se encontraron productos",
        formato_producto: {
          nombre: "string",
          precio: "number",
          stock: "number",
          categoria_id: "number",
        }
      })
    }

    const errorMap: Record<string, {status: number, msg: string}> = {
      "INVALID_PRICE_FORMAT": { status: 400, msg: "El precio mínimo debe ser un número válido." },
      "NEGATIVE_PRICE":       { status: 400, msg: "El precio no puede ser negativo." },
      "INVALID_PAGE":         { status: 400, msg: "La página debe ser un número mayor a 0." },
      "INVALID_LIMIT":        { status: 400, msg: "El límite debe ser un número positivo." },
      "LIMIT_TOO_HIGH":       { status: 400, msg: "No puedes solicitar más de 50 productos por página." },
      "INVALID_ORDER_TYPE":   { status: 400, msg: "El tipo de orden no es válido. Usa: caro, barato o nombre." },
    }
    const error = errorMap[err.message];
    if(error) return res.status(error.status).json({error: error.msg})
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
    const nuevoID = await ProductoService.crearNuevoProducto(datosProducto);
    
    res.status(201).json({
      mensaje: "Producto guardado con exito",
      id: nuevoID,
      producto: datosProducto
    });

  } catch (err: any) {
    const erroresNegocio: Record<string, string> = {
      "CATEGORIA_NOT_FOUND": "La categoria especificada no existe en el sistema",
      "PRODUCT_NAME_EXISTS": "El nombre del producto ya existe",
    };

    if(erroresNegocio[err.message]) {
      return res.status(400).json({error: erroresNegocio[err.message]})
    }
  
    next(err)
  }
}

// Consulta 4: actualizar un producto existente
export const editarProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const datos: Producto = req.body;

    await ProductoService.actualizarProducto(Number(id), datos);
    
    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      id: id,
      datos_actualizados: datos,
    })
  } catch (err: any) {
    const errorMap: Record<string, {status: number, msg: string}> = {
      "PRODUCT_NOT_FOUND":   {status: 400, msg: "El producto que intentas editar no existe."},
      "PRODUCT_NAME_EXISTS": {status: 400, msg: "No puedes usar ese nombre, ya pertenece a otro producto."},
      "CATEGORIA_NOT_FOUND": {status: 400, msg: "La categoría especificada no es válida."}
    };

    const error = errorMap[err.message];
    if(error) return res.status(error.status).json({error: error.msg});

    next(err);
  }
}