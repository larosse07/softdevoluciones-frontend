import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  Rol,
  Sesion
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly storageKey = 'softdevoluciones_sesion';

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    ).pipe(
      tap(response => {
        const sesion: Sesion = {
          token: response.token,
          id: response.id,
          nombre: response.nombre,
          rol: response.rol
        };

        localStorage.setItem(
          this.storageKey,
          JSON.stringify(sesion)
        );
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getSesion(): Sesion | null {
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as Sesion;
    } catch {
      this.logout();
      return null;
    }
  }

  getToken(): string | null {
    return this.getSesion()?.token ?? null;
  }

  getRol(): Rol | null {
    return this.getSesion()?.rol ?? null;
  }

  getNombre(): string {
    return this.getSesion()?.nombre ?? '';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(...roles: Rol[]): boolean {
    const rol = this.getRol();

    return rol !== null && roles.includes(rol);
  }
}
