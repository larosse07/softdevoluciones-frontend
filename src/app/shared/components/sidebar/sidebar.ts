import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  menuAbierto = false;

  get rol(): string | null {
    return this.authService.getRol();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  logout(): void {
    this.cerrarMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}