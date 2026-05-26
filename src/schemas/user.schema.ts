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