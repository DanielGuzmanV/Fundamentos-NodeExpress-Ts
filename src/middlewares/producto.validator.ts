import { Request, Response, NextFunction } from "express";

const validarProducto = (req: Request, res: Response, next: NextFunction) => {
  const {precio, stock, nombre, categoria_id} = req.body;

  // Verificacion de existencia de datos:
  if(!precio || stock === undefined || !nombre || !categoria_id) {
    return res.status(400).json({
      error: "Datos incompletos",
      esperando: {nombre: "string", precio: "number", stock: "number", categoria_id: "number"}
    })
  }

  // Verificacion de tipos
  if(typeof nombre !== 'string' || nombre.trim().length === 0) {
    return res.status(400).json({error: "El nombre debe ser un texto valido"});
  }

  if(isNaN(Number(precio)) || isNaN(Number(stock)) || isNaN(Number(categoria_id))) {
    return res.status(400).json({error: "Precio, stock y categoria_id deben ser numeros"});
  }

  // Verificacion de valores logicos
  if(precio < 0) return res.status(400).json({ error: "El precio no puede ser negativo"});
  if(stock < 0) return res.status(400).json({ error: "El stock no puede ser cero"});

  next();
}

export default validarProducto;