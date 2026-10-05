import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  Devolucion,
  EstadoDevolucion
} from '../../../core/models/devolucion.model';

import { DevolucionesService } from '../../../core/services/devoluciones';

@Component({
  selector: 'app-operador-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {

  private readonly devolucionesService =
    inject(DevolucionesService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);


  devoluciones: Devolucion[] = [];

  totalSolicitadas = 0;
  totalEnRevision = 0;
  totalAprobadas = 0;
  totalRechazadas = 0;
  totalCompletadas = 0;

  cargando = true;
  error = '';


  // FILTROS

  filtroEstado: EstadoDevolucion | '' = '';

  fechaDesde = '';

  fechaHasta = '';


  ngOnInit(): void {

    console.log(
      'INICIANDO COMPONENTE OPERADOR'
    );

    this.buscar();
  }

buscar(): void {

  this.cargando = true;
  this.error = '';

  const estado =
    this.filtroEstado || undefined;

  let fechaInicio: string | undefined;
  let fechaFin: string | undefined;

  if (this.fechaDesde) {
    fechaInicio = `${this.fechaDesde}T00:00:00`;
  }

  if (this.fechaHasta) {
    fechaFin = `${this.fechaHasta}T23:59:59`;
  }

  console.log('FILTRO ESTADO:', estado);
  console.log('FECHA DESDE:', fechaInicio);
  console.log('FECHA HASTA:', fechaFin);

  this.devolucionesService.listarAdmin(
    estado,
    undefined,
    fechaInicio,
    fechaFin,
    0,
    100
  ).subscribe({

    next: (respuesta) => {

      console.log('RESPUESTA FILTRADA:', respuesta);

      this.devoluciones =
        respuesta.content ?? [];

      this.actualizarContadores();

      this.cargando = false;

      this.changeDetector.detectChanges();
    },

    error: (error) => {

      console.error('ERROR AL FILTRAR:', error);

      this.devoluciones = [];

      this.totalSolicitadas = 0;
      this.totalEnRevision = 0;
      this.totalAprobadas = 0;
      this.totalRechazadas = 0;
      this.totalCompletadas = 0;

      this.error =
        error?.error?.message ||
        'No se pudieron filtrar las devoluciones.';

      this.cargando = false;

      this.changeDetector.detectChanges();
    }

  });
}
  private actualizarContadores(): void {

    this.totalSolicitadas =
      this.contarEstado('SOLICITADA');

    this.totalEnRevision =
      this.contarEstado('EN_REVISION');

    this.totalAprobadas =
      this.contarEstado('APROBADA');

    this.totalRechazadas =
      this.contarEstado('RECHAZADA');

    this.totalCompletadas =
      this.contarEstado('COMPLETADA');

  }


  private contarEstado(
    estado: EstadoDevolucion
  ): number {

    return this.devoluciones.filter(
      devolucion =>
        devolucion.estado === estado
    ).length;

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

    return new Date(fecha)
      .toLocaleDateString('es-PE');

  }

}