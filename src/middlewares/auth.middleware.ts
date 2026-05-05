import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Extencion de la interfaz request para agregar "user"
declare module 'express' {
  interface Request {
    user?: {
      id: number;
      username: string;
      rol: string;
    };
  }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Obtenemos el token del encabezado de autorizacion
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null) {
    return res.status(401).json({error: "Acceso denegado: Token no proporcionado"});
  };

  // Verificamos el token
  const secret = process.env.JWT_SECRET;
  
  if(!secret) {
    console.error("JWT_SECRET no está definido en las variables de entorno.");
    return res.status(500).json({error: "Error de configuración del servidor"})
  }

  jwt.verify(token, secret, (err: any, user: any) => {
    if(err) {
      console.error("Error al verificar token:", err.message);
      return res.status(403).json({error: "Token inválido o expirado"});
    }

    req.user = user;
    next();
  })

}




