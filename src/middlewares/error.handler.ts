import { Response, Request, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("--- ERROR DETECTADO---");
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.menssage || "Error interno del servidor";

  res.status(status).json({
    error: true,
    mensaje: message
  })
}

