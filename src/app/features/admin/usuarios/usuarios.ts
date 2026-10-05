import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {

  private readonly http = inject(HttpClient);
  private readonly changeDetector = inject(ChangeDetectorRef);

  private readonly apiUrl =
    'http://localhost:8080/api/admin/usuarios';

  usuarios: Usuario[] = [];

  cargando = true;
  error = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {

    this.cargando = true;
    this.error = '';

    this.http.get<Usuario[]>(this.apiUrl).subscribe({

      next: (respuesta) => {

        this.usuarios = respuesta ?? [];
        this.cargando = false;

        this.changeDetector.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR AL CARGAR USUARIOS:',
          error
        );

        this.usuarios = [];
        this.cargando = false;

        this.error =
          error?.error?.message ||
          'No se pudieron cargar los usuarios.';

        this.changeDetector.detectChanges();
      }
    });
  }

  rolTexto(rol: string): string {

    switch (rol) {

      case 'ADMIN':
        return 'Administrador';

      case 'OPERADOR':
        return 'Operador';

      case 'CLIENTE':
        return 'Cliente';

      default:
        return rol;
    }
  }

  rolClase(rol: string): string {

    switch (rol) {

      case 'ADMIN':
        return 'rol-admin';

      case 'OPERADOR':
        return 'rol-operador';

      case 'CLIENTE':
        return 'rol-cliente';

      default:
        return 'rol-default';
    }
  }

  trackById(
    index: number,
    usuario: Usuario
  ): number {

    return usuario.id;
  }
}