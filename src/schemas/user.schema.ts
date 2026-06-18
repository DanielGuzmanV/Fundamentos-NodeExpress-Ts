import { z } from 'zod';

// Esquema para la validacion de un nuevo email
export const updateEmailSchema = z.object({
  email: z.string()
    .min(1, {message: "El email no puede estar vacio"})
    .email({message: "Formato de email invalido"}),
});

// Esquema para la validacion de cambio de contraseña
export const updatePasswordSchema = z.object({
  oldPassword: z.string()
    .min(1, {message: "La contraseña actual no puede estar vacia"}),
  newPassword: z.string()
    .min(8, {message: "La nueva contraseña debe tener al menos 8 caracteres"})
    .regex(/[A-Z]/, { message: "La nueva contraseña debe contener al menos una mayúscula" })
    .regex(/[a-z]/, { message: "La nueva contraseña debe contener al menos una minúscula" })
    .regex(/[0-9]/, { message: "La nueva contraseña debe contener al menos un número" })
    .regex(/[^a-zA-Z0-9]/, { message: "La nueva contraseña debe contener al menos un caracter especial" }),
}).refine((data) => data.newPassword !== data.oldPassword, {
  message: "La nueva contraseña debe ser diferente a la contraseña actual",
  path: ["newPassword"],
})

// Esquema para registrar un usuario
export const registrarUsuarioSchema = z.object({
  username: z.string()
    .min(1, {message: "El nombre del usuario es obligatorio"}),
  password: z.string()
    .min(8, {message: "La contraseña debe tener al menos 8 caracteres"})
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una mayúscula" })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una minúscula" })
    .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" })
    .regex(/[^a-zA-Z0-9]/, { message: "La contraseña debe contener al menos un caracter especial" }),
  nombre: z.string()
    .min(1, { message: "El nombre es obligatorio" }),
  apellido: z.string()
    .min(1, { message: "El apellido es obligatorio" }),
  email: z.string()
    .min(1, { message: "El email es obligatorio" })
    .email({ message: "Formato de email inválido" }),
  telefono: z.string()
    .min(7, { message: "El teléfono debe tener al menos 8 dígitos" })
    .regex(/^[0-9]+$/, { message: "El teléfono solo debe contener números" }),
  rol: z.enum(["admin", "vendedor"], {
    message: "El rol no es valido. Debe ser 'admin' o 'vendedor'."
  }).optional().default('vendedor'),
})
