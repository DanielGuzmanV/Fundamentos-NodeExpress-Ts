export interface Users {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password_hash: string;
  rol?: string;
  activo?: number;
  fecha_creacion?: string;
}

export interface UserPayload {
  id: number;
  username: string;
  rol: string;
}