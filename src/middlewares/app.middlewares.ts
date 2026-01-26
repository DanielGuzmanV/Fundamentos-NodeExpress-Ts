import { Request, Response, NextFunction } from "express";

// Middleware de registro global
export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const fecha = new Date().toLocaleString();
  console.log(
    `[${fecha}] Peticion recibida: ${req.method} en la ruta ${req.url}`
  );
  next();
}

// Middleware para capturar errores de sintaxis JSON
export const jsonSyntaxError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof SyntaxError && 'status' in err && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "JSON mal formado. Revisa las comillas dobles o comas"
    })
  }
  next(err);
}

// Middleware verificador de tipo de datos
export const validarContenido = (req: Request, res: Response, next: NextFunction) => {
  if(
    (req.method === "POST" || req.method === "PUT") &&
    (!req.body || Object.keys(req.body).length === 0)
  ) {
    return res.status(400).json({
      error: "El cuerpo de la peticion no puede estar vacio"
    });
  };
  next();
}
