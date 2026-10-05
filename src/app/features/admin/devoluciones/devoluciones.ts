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
  selector: 'app-devoluciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  filtroEstado: EstadoDevolucion | '' = '';
  filtroMotivo = '';
  fechaDesde = '';
  fechaHasta = '';

  paginaActual = 0;
  tamanioPagina = 10;

  totalElementos = 0;
  totalPaginas = 0;

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {

    this.cargando = true;
    this.error = '';

    const estado =
      this.filtroEstado || undefined;

    const motivo =
      this.filtroMotivo.trim() || undefined;

    const fechaInicio =
      this.fechaDesde
        ? `${this.fechaDesde}T00:00:00`
        : undefined;

    const fechaFin =
      this.fechaHasta
        ? `${this.fechaHasta}T23:59:59`
        : undefined;

    this.devolucionesService.listarAdmin(
      estado,
      motivo,
      fechaInicio,
      fechaFin,
      this.paginaActual,
      this.tamanioPagina
    ).subscribe({

      next: (respuesta) => {

        this.devoluciones =
          respuesta.content ?? [];

        this.totalElementos =
          respuesta.totalElements ?? 0;

        this.totalPaginas =
          respuesta.totalPages ?? 0;

        this.cargando = false;

        this.changeDetector.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR AL CARGAR DEVOLUCIONES:',
          error
        );

        this.devoluciones = [];
        this.totalElementos = 0;
        this.totalPaginas = 0;
        this.cargando = false;

        this.error =
          error?.error?.message ||
          'No se pudieron cargar las devoluciones.';

        this.changeDetector.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual = 0;
    this.buscar();
  }

  limpiarFiltros(): void {

    this.filtroEstado = '';
    this.filtroMotivo = '';
    this.fechaDesde = '';
    this.fechaHasta = '';

    this.paginaActual = 0;

    this.buscar();
  }

  cambiarPagina(pagina: number): void {

    if (
      pagina < 0 ||
      pagina >= this.totalPaginas ||
      pagina === this.paginaActual
    ) {
      return;
    }

    this.paginaActual = pagina;

    this.buscar();
  }

  paginaAnterior(): void {
    this.cambiarPagina(
      this.paginaActual - 1
    );
  }

  paginaSiguiente(): void {
    this.cambiarPagina(
      this.paginaActual + 1
    );
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

  estadoClase(
    estado: EstadoDevolucion
  ): string {

    switch (estado) {

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

  formatearFecha(fecha: string): string {

    if (!fecha) {
      return '-';
    }

    return new Date(fecha).toLocaleDateString(
      'es-PE',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );
  }

  formatearHora(fecha: string): string {

    if (!fecha) {
      return '';
    }

    return new Date(fecha).toLocaleTimeString(
      'es-PE',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  formatearMoneda(
    importe: number
  ): string {

    return new Intl.NumberFormat(
      'es-PE',
      {
        style: 'currency',
        currency: 'PEN'
      }
    ).format(importe ?? 0);
  }

  nombreCliente(
    devolucion: Devolucion
  ): string {

    return devolucion.nombreCliente ||
      `Usuario #${devolucion.usuarioId ?? '-'}`;
  }

  trackById(
    index: number,
    devolucion: Devolucion
  ): number {

    return devolucion.id;
  }
}