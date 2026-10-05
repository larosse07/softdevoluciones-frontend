import { Rol } from './auth.model';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}
