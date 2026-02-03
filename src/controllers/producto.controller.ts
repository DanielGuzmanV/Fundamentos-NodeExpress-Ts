import { Request, Response, NextFunction } from "express";
import ProductoModel from "../models/producto.model.js";
import { Producto } from "../types/index.js";

// Consulta 1: Obtener todos
export const obtenerProductos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await ProductoModel.getAll();

    const mensaje = rows.length > 0
      ? "Productos obtenidos" : "No se encontraron productos";

    res.status(200).json({
      nota: mensaje,
      producto: rows
    })
  } catch (err) {
    next(err);
  }
};

// Consulta 2: Obtener producto por ID
export const productoID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const idNumerico = Number(id);
  
    if(isNaN(idNumerico)) {
      return res.status(400).json({ error: 'El ID proporcionado no es un numero valido'})
    }

    const rows = await ProductoModel.getById(idNumerico);
  
    if(!rows) {
      return res.status(404).json({ mensaje: "Producto no encontrado"});
    }
    res.status(200).json({
      mensaje: "Producto encontrado",
      datos: rows
    });
  } catch (err) {
    next(err)
  }
}

// Consulta 3: 
export const crearProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const datosProducto: Producto = req.body;
    
    await ProductoModel.create(datosProducto);
    
    res.status(201).json({
      mensaje: "Producto guardado con exito",
      producto: datosProducto
    });

  } catch (err) {
    next(err)
  }
}


