import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: response => {

        this.loading = false;

        if (response.rol === 'CLIENTE') {
          this.router.navigate(['/cliente/inicio']);
          return;
        }

        if (response.rol === 'OPERADOR') {
          this.router.navigate(['/operador/inicio']);
          return;
        }

        if (response.rol === 'ADMIN') {
          this.router.navigate(['/admin/inicio']);
          return;
        }

        this.error = 'Rol de usuario no reconocido.';
      },

      error: error => {

        this.loading = false;

        if (error.status === 401 || error.status === 403) {
          this.error = 'Correo o contraseña incorrectos.';
        } else {
          this.error = 'No se pudo conectar con el servidor.';
        }
      }
    });
  }
}
