import { Request, Response, NextFunction } from "express";

const validarProducto = (req: Request, res: Response, next: NextFunction) => {
  const {precio, stock, nombre, categoria_id} = req.body;

  if(!precio || stock === undefined || !nombre || !categoria_id) {
    return res.status(400).json({
      error: "Datos incompletos",
      esperando: {nombre: "string", precio: "number", stock: "number", categoria_id: "number"}
    })
  }

  if(precio <= 0) return res.status(400).json({ error: "El tiene que ser mayor a cero"});
  if(stock < 0) return res.status(400).json({ error: "El stock no puede ser cero"});

  next();
}

export default validarProducto;