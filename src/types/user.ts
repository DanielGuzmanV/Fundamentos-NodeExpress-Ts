export interface User {
  id?: number;
  username: string;
  password: string;
  rol?: string;
};

export interface UserPayload {
  id: number;
  username: string;
  rol: string;
}