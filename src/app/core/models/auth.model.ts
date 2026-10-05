export type Rol = 'CLIENTE' | 'OPERADOR' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  nombre: string;
  rol: Rol;
}

export interface Sesion {
  token: string;
  id: number;
  nombre: string;
  rol: Rol;
}
