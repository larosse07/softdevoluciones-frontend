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
  EstadoDevolucion
} from '../../../core/models/devolucion.model';

import { Compra } from '../../../core/models/compra.model';

import { DevolucionesService } from '../../../core/services/devoluciones';
import { ComprasService } from '../../../core/services/compras';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {

  private readonly comprasService =
    inject(ComprasService);

  private readonly devolucionesService =
    inject(DevolucionesService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  compras: Compra[] = [];
  devoluciones: Devolucion[] = [];

  cargando = true;
  error = '';

  totalCompras = 0;
  comprasEnTransito = 0;
  comprasEntregadas = 0;

  totalDevoluciones = 0;
  devolucionesSolicitadas = 0;
  devolucionesEnRevision = 0;
  devolucionesAprobadas = 0;
  devolucionesRechazadas = 0;
  devolucionesCompletadas = 0;

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {

    this.cargando = true;
    this.error = '';

    let comprasListas = false;
    let devolucionesListas = false;

    this.comprasService.listarTodas().subscribe({

      next: (compras) => {

        this.compras = compras ?? [];

        this.calcularCompras();

        comprasListas = true;

        this.finalizarCarga(
          comprasListas,
          devolucionesListas
        );
      },

      error: () => {

        this.error =
          'No se pudieron cargar todos los datos del panel.';

        comprasListas = true;

        this.finalizarCarga(
          comprasListas,
          devolucionesListas
        );
      }
    });

    this.devolucionesService.listarAdmin(
      undefined,
      undefined,
      undefined,
      undefined,
      0,
      100
    ).subscribe({

      next: (respuesta) => {

        this.devoluciones =
          respuesta.content ?? [];

        this.calcularDevoluciones();

        devolucionesListas = true;

        this.finalizarCarga(
          comprasListas,
          devolucionesListas
        );
      },

      error: () => {

        this.error =
          'No se pudieron cargar todos los datos del panel.';

        devolucionesListas = true;

        this.finalizarCarga(
          comprasListas,
          devolucionesListas
        );
      }
    });
  }

  private finalizarCarga(
    comprasListas: boolean,
    devolucionesListas: boolean
  ): void {

    if (
      comprasListas &&
      devolucionesListas
    ) {

      this.cargando = false;

      this.changeDetector.detectChanges();
    }
  }

  private calcularCompras(): void {

    this.totalCompras =
      this.compras.length;

    this.comprasEnTransito =
      this.compras.filter(
        compra =>
          compra.estado === 'EN_TRANSITO'
      ).length;

    this.comprasEntregadas =
      this.compras.filter(
        compra =>
          compra.estado === 'ENTREGADO'
      ).length;
  }

  private calcularDevoluciones(): void {

    this.totalDevoluciones =
      this.devoluciones.length;

    this.devolucionesSolicitadas =
      this.contarEstado('SOLICITADA');

    this.devolucionesEnRevision =
      this.contarEstado('EN_REVISION');

    this.devolucionesAprobadas =
      this.contarEstado('APROBADA');

    this.devolucionesRechazadas =
      this.contarEstado('RECHAZADA');

    this.devolucionesCompletadas =
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

  nombreCliente(
    devolucion: Devolucion
  ): string {

    return devolucion.nombreCliente ||
      `Usuario #${devolucion.usuarioId ?? '-'}`;
  }

  formatearFecha(
    fecha: string
  ): string {

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

  trackById(
    index: number,
    devolucion: Devolucion
  ): number {

    return devolucion.id;
  }
}