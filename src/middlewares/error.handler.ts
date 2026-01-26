import { Response } from "express";

export const errorHandler = (err: any, res: Response) => {
  console.error("--- ERROR DETECTADO---");
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: "Ocurrio un error en el servidor",
    mensaje: err.mensaje || "Error interno"
  })
}

