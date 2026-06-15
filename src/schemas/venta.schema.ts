import { z } from 'zod';

export const crearVentaSchema = z.object({
  producto_id: z.number({
    // Eliminado: required_error: "El ID del producto es obligatorio", 
    message: "El ID del producto debe ser un número"
  }).int("El ID del producto debe ser un número entero").positive("El ID del producto debe ser positivo"),
  
  cantidad: z.number({
    // Eliminado: required_error: "La cantidad es obligatoria", 
    message: "La cantidad debe ser un número"
  }).int("La cantidad debe ser un número entero").positive("La cantidad debe ser mayor que cero"),
  
});