import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { DevolucionesService } from '../../../core/services/devoluciones';
import { Devolucion } from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-detalle-devolucion',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './detalle-devolucion.html',
  styleUrl: './detalle-devolucion.scss'
})
export class DetalleDevolucion implements OnInit {

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly devolucionesService =
    inject(DevolucionesService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);


  id: number | null = null;

  devolucion: Devolucion | null = null;

  loading = true;

  error = '';


  ngOnInit(): void {

    const idParam =
      this.route.snapshot.paramMap.get('id');

    const id = Number(idParam);

    console.log(
      'ID DE DEVOLUCIÓN:',
      id
    );

    if (!id) {

      this.error =
        'Devolución no válida.';

      this.loading = false;

      return;
    }

    this.id = id;

    this.cargarDevolucion(id);
  }


  private cargarDevolucion(id: number): void {

    console.log(
      'BUSCANDO DEVOLUCIÓN:',
      id
    );

    this.devolucionesService
      .obtenerDevolucion(id)
      .subscribe({

        next: (respuesta) => {

          console.log(
            '========== DEVOLUCIÓN RECIBIDA =========='
          );

          console.log(
            JSON.stringify(
              respuesta,
              null,
              2
            )
          );

          this.devolucion = respuesta;

          this.loading = false;

          this.changeDetector.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO DEVOLUCIÓN:',
            error
          );

          this.error =
            'No se pudo cargar el detalle de la devolución.';

          this.loading = false;

          this.changeDetector.detectChanges();
        }

      });
  }


  get total(): number {

    if (!this.devolucion) {
      return 0;
    }

    return this.devolucion.detalles.reduce(
      (total, detalle) =>
        total + detalle.importe,
      0
    );
  }


  volver(): void {

    this.router.navigate([
      '/cliente/devoluciones'
    ]);
  }


  estadoClase(): string {

    if (!this.devolucion) {
      return 'estado-default';
    }

    switch (this.devolucion.estado) {

      case 'SOLICITADA':
        return 'estado-solicitada';

      case 'EN_REVISION':
        return 'estado-revision';

      case 'APROBADA':
        return 'estado-aprobada';

      case 'RECHAZADA':
        return 'estado-rechazada';

      case 'COMPLETADA':
        return 'estado-completada';

      default:
        return 'estado-default';
    }
  }


  formatearEstado(
    estado: string
  ): string {

    const estados: Record<string, string> = {

      SOLICITADA:
        'Solicitada',

      EN_REVISION:
        'En revisión',

      APROBADA:
        'Aprobada',

      RECHAZADA:
        'Rechazada',

      COMPLETADA:
        'Completada'
    };

    return estados[estado] ?? estado;
  }


  formatearMotivo(
    motivo: string
  ): string {

    const motivos: Record<string, string> = {

      PRODUCTO_DEFECTUOSO:
        'Producto defectuoso',

      PRODUCTO_INCORRECTO:
        'Producto incorrecto',

      PRODUCTO_DANADO:
        'Producto dañado',

      NO_ESPERADO:
        'No era lo esperado',

      OTRO:
        'Otro'
    };

    return motivos[motivo] ?? motivo;
  }


  formatearFecha(
    fecha: string
  ): string {

    if (!fecha) {
      return '';
    }

    const fechaLocal =
      new Date(fecha);

    if (isNaN(fechaLocal.getTime())) {
      return fecha;
    }

    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ).format(fechaLocal);
  }

}