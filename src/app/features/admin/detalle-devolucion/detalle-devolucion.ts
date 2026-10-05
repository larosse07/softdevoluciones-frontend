
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DevolucionesService } from '../../../core/services/devoluciones';
import {
  Devolucion,
  EstadoDevolucion
} from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-detalle-devolucion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-devolucion.html',
  styleUrl: './detalle-devolucion.scss'
})
export class DetalleDevolucion implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly devolucionesService = inject(DevolucionesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  devolucion: Devolucion | null = null;

  cargando = true;
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'No se encontró el ID de la devolución.';
      this.cargando = false;
      return;
    }

    this.cargarDevolucion(id);
  }

  private cargarDevolucion(id: number): void {
    this.cargando = true;
    this.error = '';

    this.devolucionesService.obtenerAdmin(id).subscribe({
      next: (respuesta) => {
        this.devolucion = respuesta;
        this.cargando = false;
        this.changeDetector.detectChanges();
      },

      error: (error) => {
        this.devolucion = null;
        this.cargando = false;
        this.error =
          error?.error?.message ||
          'No se pudo cargar el detalle de la devolución.';

        this.changeDetector.detectChanges();
      }
    });
  }

  nombreCliente(): string {
    if (!this.devolucion) {
      return '-';
    }

    return this.devolucion.nombreCliente?.trim()
      || `Usuario #${this.devolucion.usuarioId ?? '-'}`;
  }

  formatearEstado(estado: EstadoDevolucion): string {
    switch (estado) {
      case 'SOLICITADA':
        return 'Solicitada';

      case 'EN_REVISION':
        return 'En revisión';

      case 'APROBADA':
        return 'Aprobada';

      case 'RECHAZADA':
        return 'Rechazada';

      case 'COMPLETADA':
        return 'Completada';

      default:
        return estado;
    }
  }

  claseEstado(estado: EstadoDevolucion): string {
    return estado.toLowerCase().replace('_', '-');
  }

  formatearFecha(fecha: string): string {
    if (!fecha) {
      return '-';
    }

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) {
      return fecha;
    }

    return valor.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearImporte(valor: number | undefined): string {
    return `S/ ${(valor ?? 0).toFixed(2)}`;
  }

  imagenProducto(url?: string): string {
    if (!url) {
      return '';
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `http://localhost:8080${url}`;
  }

  volver(): void {
    this.router.navigate(['/admin/devoluciones']);
  }
}

