import { Request, Response, NextFunction } from "express";
import CategoriaModel from "../models/categoria.model.js";

// Consulta 1: obtener todas las categorias
export const obtenerCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await CategoriaModel.getAll();
    const mensaje = rows.length > 0 
      ? "Las categorias son:" : "No hay ninguna categoria creada"
    
    res.json({
      mensaje: mensaje,
      cantidad_Cat: rows.length,
      datos: rows
    });

  } catch (err) {
    next(err)
  }
};

// Consulta 2: Crear una nueva categoria
export const crearCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {nombre} = req.body;
    if(!nombre) return res.status(400).json({ error: "El nombre es obligatorio"});
    
    await CategoriaModel.create(nombre);

    res.status(201).json({ 
      mensaje: "Categoria creada con exito",
      categoria: nombre,
    })
  } catch (err: any) {
    if(err.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Error al crear o categoria duplicada"});
    }
    next(err);
  }
}