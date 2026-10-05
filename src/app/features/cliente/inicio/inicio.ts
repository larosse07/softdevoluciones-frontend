import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ComprasService } from '../../../core/services/compras';
import { DevolucionesService } from '../../../core/services/devoluciones';

import { Compra } from '../../../core/models/compra.model';
import { Devolucion } from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {

  private readonly comprasService = inject(ComprasService);
  private readonly devolucionesService = inject(DevolucionesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  compras: Compra[] = [];
  devoluciones: Devolucion[] = [];

  loadingCompras = true;
  loadingDevoluciones = true;

  errorCompras = '';
  errorDevoluciones = '';

  ngOnInit(): void {
    console.log('INICIO CARGADO');

    this.cargarCompras();
    this.cargarDevoluciones();
  }

  cargarCompras(): void {

    console.log('SOLICITANDO COMPRAS...');

    this.comprasService.listarMisCompras().subscribe({

      next: (respuesta) => {

        console.log(
          'COMPRAS RECIBIDAS:',
          respuesta
        );

        this.compras = [...respuesta].sort(
          (a, b) =>
            new Date(b.fecha).getTime() -
            new Date(a.fecha).getTime()
        );

        this.loadingCompras = false;

        console.log(
          'COMPRAS EN COMPONENTE:',
          this.compras
        );

        console.log(
          'TOTAL COMPRAS:',
          this.compras.length
        );

        this.changeDetector.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR COMPRAS:',
          error
        );

        this.errorCompras =
          'No se pudieron cargar tus compras.';

        this.loadingCompras = false;

        this.changeDetector.detectChanges();
      },

      complete: () => {

        console.log(
          'PETICIÓN COMPRAS COMPLETADA'
        );

      }

    });
  }

  cargarDevoluciones(): void {

    console.log(
      'SOLICITANDO DEVOLUCIONES...'
    );

    this.devolucionesService
      .listarMisDevoluciones()
      .subscribe({

        next: (respuesta) => {

          console.log(
            'DEVOLUCIONES RECIBIDAS:',
            respuesta
          );

          this.devoluciones = [...respuesta];

          this.loadingDevoluciones = false;

          console.log(
            'DEVOLUCIONES EN COMPONENTE:',
            this.devoluciones
          );

          console.log(
            'TOTAL DEVOLUCIONES:',
            this.devoluciones.length
          );

          this.changeDetector.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR DEVOLUCIONES:',
            error
          );

          this.errorDevoluciones =
            'No se pudieron cargar tus devoluciones.';

          this.loadingDevoluciones = false;

          this.changeDetector.detectChanges();
        },

        complete: () => {

          console.log(
            'PETICIÓN DEVOLUCIONES COMPLETADA'
          );

        }

      });
  }

  get comprasRecientes(): Compra[] {
    return this.compras.slice(0, 4);
  }

  get totalProductos(): number {

    return this.compras.reduce(
      (total, compra) =>
        total +
        compra.detalles.reduce(
          (subtotal, detalle) =>
            subtotal + detalle.cantidad,
          0
        ),
      0
    );
  }

  get devolucionesAprobadas(): number {

    return this.devoluciones.filter(
      devolucion =>
        devolucion.estado === 'APROBADA'
    ).length;
  }

  get devolucionesEnRevision(): number {

    return this.devoluciones.filter(
      devolucion =>
        devolucion.estado === 'EN_REVISION'
    ).length;
  }

  cantidadProductos(compra: Compra): number {

    return compra.detalles.reduce(
      (total, detalle) =>
        total + detalle.cantidad,
      0
    );
  }

  formatearFecha(fecha: string): string {

    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ).format(new Date(fecha));
  }

  formatearEstado(estado: string): string {

    const estados: Record<string, string> = {
      COMPLETADA: 'Completada',
      ENTREGADA: 'Entregada',
      EN_TRANSITO: 'En tránsito',
      PENDIENTE: 'Pendiente',
      CANCELADA: 'Cancelada'
    };

    return estados[estado] ?? estado;
  }

  claseEstado(estado: string): string {

    const clases: Record<string, string> = {
      COMPLETADA: 'delivered',
      ENTREGADA: 'delivered',
      EN_TRANSITO: 'transit',
      PENDIENTE: 'pending',
      CANCELADA: 'cancelled'
    };

    return clases[estado] ?? 'pending';
  }
}