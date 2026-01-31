import { Request, Response, NextFunction } from "express";
import ProductoModel from "../models/producto.model.js";
import { Producto } from "../types/index.js";
import { error } from "node:console";

export const obtenerProductos = (req: Request, res: Response, next: NextFunction) => {
  ProductoModel.getAll((err, rows) => {
    if(err) return next(err);

    const mensaje = rows.length > 0
      ? "Productos obtenidos:"
      : "No se encontraron productos";
    
    res.status(200).json({
      nota: mensaje,
      producto: rows
    })
  })
};

export const productoID = (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const idNumerico = Number(id);

  if(isNaN(idNumerico)) {
    return res.status(400).json({ error: 'El ID proporcionado no es un numero valido'})
  }

  ProductoModel.getById(idNumerico, (err, rows) => {
    if(err) return next(err);

    if(!rows) {
      return res.status(404).json({ mensaje: "Producto no encontrado"});
    }

    res.status(200).json({
      mensaje: "Producto encontrado",
      datos: rows
    })
  })
}

export const crearProducto = (req: Request, res: Response, next: NextFunction) => {
  const datosProducto: Producto = req.body;

  ProductoModel.create(datosProducto, function(err) {
    if(err) return next(err);

    res.status(201).json({
      mensaje: "Producto guardado con exito",
      producto: datosProducto
    })
  }) 
}


