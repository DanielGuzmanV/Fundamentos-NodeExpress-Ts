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

// Consulta 3: actualizar el nombre de una categoria
export const actualizarCategoria = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const {nombre} = req.body;

    if(!nombre) return res.status(400).json({ error: "El nuevo nombre es obligatorio"});
    await CategoriaModel.update(Number(id), nombre);

    res.json({
      mensaje: "Categoria actualizada correctamente",
      nuevo_nombre: nombre,
    })

  } catch (err) {
    next(err);
  }
}

// Consulta 4: Ocultar una categoria creada
export const ocultarCategoria = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await CategoriaModel.deleteLogical(Number(id));

    res.json({
      mensaje: "Categoria ocultada correctamente",
      id: id,
    })

  } catch (err: any) {
    if(err.message === "La categoria no existe o ya esta oculta") {
      return res.status(400).json({error: err.message});
    }
    next(err);
  }
}

// Consulta 5: Mostrar una categoria ocultada
export const mostrarCategoria = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await CategoriaModel.activarCategoria(Number(id));

    res.json({
      mensaje: "Categoria activada nuevamente",
      id: id,
    })

  } catch (err: any) {
    if(err.message === "La categoria ya esta activa o no existe") {
      return res.status(400).json({error: err.message});
    }
    next(err);
  }
}

// Consulta 6: Eliminar permanentemente una categoria por su ID
export const eliminarCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await CategoriaModel.deleteCategoria(Number(id));
    res.json({
      mensaje: "Categoria eliminada permanentemente",
      id_Cat: id
    })
  } catch (err: any) {
    if(err.message.includes("FOREIGN KEY")) {
      return res.status(409).json({ 
        error: "No puedes eliminarla, tiene productos asociados. Prueba ocultándola."
      })
    }
    if(err.message === "No se encontro la categoria para eliminar") {
      return res.status(404).json({error: err.message});
    }
  }
}

// Consulta 7: Eliminar todas las categorias
export const vaciarTablaCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CategoriaModel.deleteAll();
    res.json({mensaje: "Se han eliminado todas las categorias"});
  } catch (err: any) {
    if(err.message === "No se encontraron categorias para eliminar") {
      return res.status(404).json({error: err.message})
    }
    next(err);
  }
}