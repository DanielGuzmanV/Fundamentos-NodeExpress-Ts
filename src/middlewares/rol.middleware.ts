import { Request, Response, NextFunction } from "express";

export const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Si el usuario no está logueado o su rol no coincide, bloqueamos
    if (!req.user || req.user.rol !== role) {
      return res.status(403).json({ 
        error: "Acceso denegado: Se requieren permisos de " + role 
      });
    }
    next();
  };
};