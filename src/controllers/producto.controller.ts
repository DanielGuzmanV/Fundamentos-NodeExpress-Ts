import { Request, Response, NextFunction } from "express";
import { Producto } from "../types/index.js";
import ProductoService from "../services/producto.service.js";

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
    next(err);
  }
}

// Consulta 5: actualizamos parcialmente un producto
export const actualizarParcial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const campos: Partial<Producto> = req.body;

    await ProductoService.actualizarParcial(Number(id), campos);

    res.status(200).json({
      mensaje: "Producto actualizado parcialmente",
      id_producto: id,
      campos_cambiados: campos,
    });

  } catch (err: any) {
    next(err);
  }
}

// Consulta 6: ocultar un producto logicamente
export const ocultarProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const productoOcultado = await ProductoService.ocultarProducto(Number(id))

    res.status(200).json({
      mensaje: "Producto ocultado con exito",
      id_ocultado: id,
      detalles: {
        nombre: productoOcultado.nombre,
        precio: productoOcultado.precio,
        stock: productoOcultado.stock,
        categoria_id: productoOcultado.categoria_id,
      }
    })
  } catch (err: any) {
    next(err);
  }
}

// Consulta 7: mostrar un producto ocultado
export const restaurarProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const productoRestaurado = await ProductoService.restaurarProducto(Number(id));

    res.status(200).json({
      mensaje: "Producto restaurado con exito",
      id: id,
      producto: {
        nombre: productoRestaurado.nombre,
        precio: productoRestaurado.precio,
        stock: productoRestaurado.stock,
      }
    })

  } catch (err: any) {
    next(err);
  }
}

// Consulta 8: Eliminar un producto
export const eliminarProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const productoEliminado = await ProductoService.eliminarProducto(Number(id))

    res.status(200).json({
      mensaje: "Producto eliminado de la base de datos",
      id_eliminado: id,
      datos_eliminados: productoEliminado,
    })
  } catch (err: any) {
    next(err);
  }
}

// Consulta 9: eliminar todos los productos
export const eliminarTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await ProductoService.eliminarTodo();
    res.status(200).json({
      mensaje: "Limpieza total de la DB",
      cantidad_eliminada: total,
    })
  } catch (err: any) {
    next(err);
  }
}