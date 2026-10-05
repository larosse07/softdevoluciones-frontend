import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule,
  DecimalPipe
} from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  Devolucion,
  EstadoDevolucion
} from '../../../core/models/devolucion.model';

import {
  DevolucionesService
} from '../../../core/services/devoluciones';


@Component({
  selector: 'app-operador-detalle-devolucion',

  standalone: true,

  imports: [
    CommonModule,
    DecimalPipe,
    RouterLink
  ],

  templateUrl: './detalle-devolucion.html',

  styleUrl: './detalle-devolucion.scss'
})


export class DetalleDevolucion
  implements OnInit {


  private readonly route =
    inject(ActivatedRoute);


  private readonly devolucionesService =
    inject(DevolucionesService);


  private readonly changeDetector =
    inject(ChangeDetectorRef);


  devolucion: Devolucion | null = null;


  loading = true;

  error = '';


  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    if (!id) {

      this.error =
        'Solicitud no válida.';

      this.loading = false;

      return;
    }


    this.cargarDevolucion(id);
  }


  private cargarDevolucion(
    id: number
  ): void {

    this.devolucionesService
      .obtenerAdmin(id)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'DETALLE DEVOLUCIÓN:',
            respuesta
          );


          this.devolucion =
            respuesta;


          this.loading = false;


          this.changeDetector.detectChanges();
        },


        error: (error) => {

          console.error(
            'ERROR DETALLE DEVOLUCIÓN:',
            error
          );


          this.error =
            error?.error?.message ||
            'No se pudo cargar la devolución.';


          this.loading = false;


          this.changeDetector.detectChanges();
        }

      });
  }


  estadoTexto(
    estado: EstadoDevolucion
  ): string {

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


  claseEstado(
    estado: EstadoDevolucion
  ): string {

    switch (estado) {

      case 'SOLICITADA':
        return 'solicitada';

      case 'EN_REVISION':
        return 'revision';

      case 'APROBADA':
        return 'aprobada';

      case 'RECHAZADA':
        return 'rechazada';

      case 'COMPLETADA':
        return 'completada';

      default:
        return '';
    }
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
    ).format(
      new Date(fecha)
    );
  }


  formatearFechaHora(
    fecha: string
  ): string {

    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(fecha)
    );
  }


  urlImagen(
    imagenUrl?: string
  ): string {

    if (!imagenUrl) {
      return '';
    }


    return `http://localhost:8080${imagenUrl}`;
  }

}

