
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  Devolucion,
  EstadoDevolucion,
  EstadoDevolucionRequest
} from '../../../core/models/devolucion.model';

import {
  DevolucionesService
} from '../../../core/services/devoluciones';


@Component({
  selector: 'app-operador-devoluciones',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './devoluciones.html',

  styleUrl: './devoluciones.scss'
})


export class Devoluciones implements OnInit {

  private readonly devolucionesService =
    inject(DevolucionesService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);


  devoluciones: Devolucion[] = [];

  cargando = true;

  error = '';

  procesandoId: number | null = null;


  ngOnInit(): void {

    this.cargarDevoluciones();

  }


  cargarDevoluciones(): void {

    this.cargando = true;

    this.error = '';


    this.devolucionesService
      .listarAdmin(
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        100
      )
      .subscribe({

        next: (respuesta) => {

          this.devoluciones =
            respuesta.content ?? [];

          this.cargando = false;

          this.changeDetector.detectChanges();

        },

        error: (error) => {

          console.error(
            'ERROR AL CARGAR DEVOLUCIONES:',
            error
          );

          this.devoluciones = [];

          this.error =
            'No se pudieron cargar las devoluciones.';

          this.cargando = false;

          this.changeDetector.detectChanges();

        }

      });

  }


  obtenerPorEstado(
    estado: EstadoDevolucion
  ): Devolucion[] {

    return this.devoluciones.filter(
      devolucion =>
        devolucion.estado === estado
    );

  }


  cambiarEstado(
    devolucion: Devolucion,
    nuevoEstado: EstadoDevolucion
  ): void {

    if (this.procesandoId !== null) {
      return;
    }


    const request:
      EstadoDevolucionRequest = {

      estado: nuevoEstado

    };


    if (nuevoEstado === 'RECHAZADA') {

      const observacion =
        window.prompt(
          'Ingrese la observación del rechazo:'
        );


      if (!observacion?.trim()) {
        return;
      }


      request.observacion =
        observacion.trim();

    }


    this.procesandoId =
      devolucion.id;


    this.devolucionesService
      .cambiarEstado(
        devolucion.id,
        request
      )
      .subscribe({

        next: (actualizada) => {

          const index =
            this.devoluciones.findIndex(
              item =>
                item.id === actualizada.id
            );


          if (index !== -1) {

            this.devoluciones[index] =
              actualizada;

          }


          this.procesandoId = null;

          this.changeDetector.detectChanges();

        },

        error: (error) => {

          console.error(
            'ERROR AL CAMBIAR ESTADO:',
            error
          );

          this.procesandoId = null;


          window.alert(
            error?.error?.message ||
            'No se pudo cambiar el estado de la devolución.'
          );


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


  formatearFecha(
    fecha: string
  ): string {

    return new Date(
      fecha
    ).toLocaleDateString('es-PE');

  }


  estaProcesando(
    id: number
  ): boolean {

    return this.procesandoId === id;

  }

}

