
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DevolucionesService } from '../../../core/services/devoluciones';
import { Devolucion } from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-mis-devoluciones',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './mis-devoluciones.html',
  styleUrl: './mis-devoluciones.scss'
})
export class MisDevoluciones implements OnInit {

  private readonly devolucionesService =
    inject(DevolucionesService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  devoluciones: Devolucion[] = [];

  loading = true;
  error = '';

  ngOnInit(): void {
    this.cargarDevoluciones();
  }

  cargarDevoluciones(): void {

    this.loading = true;
    this.error = '';

    this.devolucionesService
      .listarMisDevoluciones()
      .subscribe({

        next: (respuesta) => {

          this.devoluciones =
            [...respuesta].sort(
              (a, b) =>
                new Date(b.fechaSolicitud).getTime() -
                new Date(a.fechaSolicitud).getTime()
            );

          this.loading = false;

          this.changeDetector.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO DEVOLUCIONES:',
            error
          );

          this.error =
            'No se pudieron cargar tus solicitudes de devolución.';

          this.loading = false;

          this.changeDetector.detectChanges();
        }
      });
  }

  cantidadProductos(
    devolucion: Devolucion
  ): number {

    return devolucion.detalles.reduce(
      (total, detalle) =>
        total + detalle.cantidad,
      0
    );
  }

  productosResumen(
    devolucion: Devolucion
  ): string {

    return devolucion.detalles
      .map(detalle =>
        detalle.productoNombre
      )
      .join(', ');
  }

  formatearFecha(
    fecha: string
  ): string {

    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ).format(new Date(fecha));
  }

  formatearEstado(
    estado: string
  ): string {

    const estados: Record<string, string> = {

      SOLICITADA: 'Solicitada',

      EN_REVISION: 'En revisión',

      APROBADA: 'Aprobada',

      RECHAZADA: 'Rechazada',

      COMPLETADA: 'Completada'
    };

    return estados[estado] ?? estado;
  }

  claseEstado(
    estado: string
  ): string {

    const clases: Record<string, string> = {

      SOLICITADA: 'requested',

      EN_REVISION: 'review',

      APROBADA: 'approved',

      RECHAZADA: 'rejected',

      COMPLETADA: 'completed'
    };

    return clases[estado] ?? 'requested';
  }
}

