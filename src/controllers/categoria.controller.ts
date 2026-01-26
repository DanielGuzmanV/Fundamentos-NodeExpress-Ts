import { Request, Response } from "express";
import CategoriaModel from "../models/categoria.model.js";

export const obtenerCategorias = (req: Request, res: Response) => {
  CategoriaModel.getAll((err, filas) => {
    if(err) return res.status(500).json({ error: err.message});
    res.json({
      mensaje: "Las categorias son:",
      categorias: filas
    });
  });
};

export const crearCategoria = (req: Request, res: Response) => {
  const {nombre} = req.body;
  if(!nombre) return res.status(400).json({ error: "El nombre es obligatorio"});

  CategoriaModel.create(nombre, (err) => {
    if(err) return res.status(400).json({error: "Error al crear o categoria duplicada"});
    res.status(201).json({ mensaje: "Categoria creada con exito"})
  })
}








