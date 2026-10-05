import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Sesion } from '../../../core/models/auth.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  sesion: Sesion | null = this.authService.getSesion();

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  nombreRol(): string {
    switch (this.sesion?.rol) {
      case 'ADMIN':
        return 'Administrador';

      case 'OPERADOR':
        return 'Operador';

      case 'CLIENTE':
        return 'Cliente';

      default:
        return '-';
    }
  }
}