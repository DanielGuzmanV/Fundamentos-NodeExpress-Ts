import { Request, Response, NextFunction } from "express";
import CategoriaService from "../services/categoria.service.js";

// Consulta 1: obtener todas las categorias
export const obtenerCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await CategoriaService.listarCategorias();
    
    res.json({
      mensaje: rows.length > 0 ? "Las categorias son:" : "No hay ninguna categoria creada",
      cantidad_Cat: rows.length,
      datos: rows
    });

  } catch (err) {
    next(err)
  }
};

export const obtenerUnaCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const categoria = await CategoriaService.ObtenerUnCategoria(id);

    res.status(200).json({
      mensaje: "Categoria encontrada",
      categoria: categoria
    })
  } catch (err: any) {
    next(err);
  }
}

// Consulta 2: Crear una nueva categoria
export const crearCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {nombre} = req.body;
    await CategoriaService.crearNuevaCategoria(nombre)

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

    await CategoriaService.actualizarCategoria(id, nombre);

    res.json({
      mensaje: "Categoria actualizada correctamente",
      nuevo_nombre: nombre,
    })

  } catch (err: any) {
    next(err);
  }
}

// Consulta 4: Ocultar una categoria creada
export const ocultarCategoria = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await CategoriaService.OcultarCategoriaId(id);

    res.json({
      mensaje: "Categoria ocultada correctamente",
      id: id,
    })

  } catch (err: any) {
    next(err);
  }
}

// Consulta 5: Mostrar una categoria ocultada
export const mostrarCategoria = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await CategoriaService.mostrarCategoriaId(id);

    res.json({
      mensaje: "Categoria activada nuevamente",
      id: id,
    })

  } catch (err: any) {
    next(err);
  }
}

// Consulta 6: Eliminar permanentemente una categoria por su ID
export const eliminarCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await CategoriaService.eliminarCategoriaId(id);
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
    next(err);
  }
}

// Consulta 7: Eliminar todas las categorias
export const vaciarTablaCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CategoriaService.eliminarTablaCat();
    res.json({mensaje: "Se han eliminado todas las categorias"});
  } catch (err: any) {
    next(err);
  }
}