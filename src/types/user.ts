export interface User {
  id?: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string
  rol?: string;
  activo?: number;
  fecha_creacion?: string;
};

export interface UserPayload {
  id: number;
  username: string;
  rol: string;
}