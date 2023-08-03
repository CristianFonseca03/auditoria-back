import { Request, Response, NextFunction } from "express";
import fs from "fs";

// Función para crear una entrada de registro en el archivo
function logRequest(req: Request) {
  const logEntry = `${new Date().toISOString()} - ${req.method} ${
    req.originalUrl
  } - ${req.ip}\n`;
  fs.appendFile("requests.log", logEntry, (err: any) => {
    if (err) {
      console.error("Error al escribir en el archivo de registro:", err);
    }
  });
}

// Middleware personalizado para el registro de peticiones
export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logRequest(req);
  next();
};
