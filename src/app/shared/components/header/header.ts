import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {

  readonly authService = inject(AuthService);

}
