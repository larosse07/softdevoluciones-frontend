import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ComprasService } from '../../../core/services/compras';
import { DevolucionesService } from '../../../core/services/devoluciones';

import { Compra } from '../../../core/models/compra.model';

import {
  Devolucion,
  EstadoDevolucion
} from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './detalle-compra.html',
  styleUrl: './detalle-compra.scss'
})
export class DetalleCompra implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly comprasService =
    inject(ComprasService);

  private readonly devolucionesService =
    inject(DevolucionesService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  compra: Compra | null = null;

  devoluciones: Devolucion[] = [];

  loading = true;
  error = '';

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if (!id) {

      this.error =
        'Compra no válida.';

      this.loading = false;

      return;
    }

    this.cargarCompra(id);
  }

  private cargarCompra(id: number): void {

    this.comprasService
      .obtenerCompra(id)
      .subscribe({

        next: (respuesta) => {

          this.compra = respuesta;

          this.cargarDevoluciones();
        },

        error: (error) => {

          console.error(
            'ERROR DETALLE COMPRA:',
            error
          );

          this.error =
            'No se pudo cargar la compra.';

          this.loading = false;

          this.changeDetector.detectChanges();
        }
      });
  }

  private cargarDevoluciones(): void {

    this.devolucionesService
      .listarMisDevoluciones()
      .subscribe({

        next: (devoluciones) => {

          this.devoluciones =
            devoluciones ?? [];

          this.loading = false;

          this.changeDetector.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO DEVOLUCIONES:',
            error
          );

          this.devoluciones = [];

          this.loading = false;

          this.changeDetector.detectChanges();
        }
      });
  }

  tieneDevolucion(
    detalle: any
  ): boolean {

    if (!this.compra) {
      return false;
    }

    return this.devoluciones.some(
      devolucion => {

        // La devolución debe pertenecer
        // a la compra actual.
        if (
          devolucion.compraId !==
          this.compra!.id
        ) {
          return false;
        }

        // Revisar si la devolución
        // corresponde a este detalle de compra.
        const correspondeAlDetalle =
          devolucion.detalles?.some(
            detalleDevolucion =>
              detalleDevolucion.detalleCompraId ===
              detalle.id
          );

        if (!correspondeAlDetalle) {
          return false;
        }

        // Estados que impiden solicitar
        // otra devolución.
        const estadosBloqueados:
          EstadoDevolucion[] = [
            'SOLICITADA',
            'EN_REVISION',
            'APROBADA',
            'COMPLETADA'
          ];

        return estadosBloqueados.includes(
          devolucion.estado
        );
      }
    );
  }

  solicitarDevolucion(
    productoId: number
  ): void {

    if (!this.compra) {
      return;
    }

    this.router.navigate([
      '/cliente/devoluciones/nueva',
      this.compra.id
    ], {
      queryParams: {
        productoId
      }
    });
  }

  cantidadProductos(): number {

    if (!this.compra) {
      return 0;
    }

    return this.compra.detalles.reduce(
      (total, detalle) =>
        total + detalle.cantidad,
      0
    );
  }

  subtotal(
    precio: number,
    cantidad: number
  ): number {

    return precio * cantidad;
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

  formatearEstado(
    estado: string
  ): string {

    const estados: Record<string, string> = {

      COMPLETADA: 'Completada',

      ENTREGADA: 'Entregada',

      EN_TRANSITO: 'En tránsito',

      PENDIENTE: 'Pendiente',

      CANCELADA: 'Cancelada'
    };

    return estados[estado] ?? estado;
  }

  claseEstado(
    estado: string
  ): string {

    const clases: Record<string, string> = {

      COMPLETADA: 'completed',

      ENTREGADA: 'delivered',

      EN_TRANSITO: 'transit',

      PENDIENTE: 'pending',

      CANCELADA: 'cancelled'
    };

    return clases[estado] ?? 'pending';
  }
}