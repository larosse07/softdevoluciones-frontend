import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ComprasService } from '../../../core/services/compras';
import { Compra } from '../../../core/models/compra.model';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    FormsModule
  ],
  templateUrl: './compras.html',
  styleUrl: './compras.scss'
})
export class Compras implements OnInit {

  private readonly comprasService =
    inject(ComprasService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  compras: Compra[] = [];

  busqueda = '';
  filtroFecha = 'TODAS';

  loading = true;
  error = '';

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.loading = true;
    this.error = '';

    this.comprasService.listarMisCompras().subscribe({
      next: (respuesta) => {
        this.compras = [...respuesta].sort(
          (a, b) =>
            new Date(b.fecha).getTime() -
            new Date(a.fecha).getTime()
        );

        this.loading = false;

        this.changeDetector.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error cargando compras:',
          error
        );

        this.error =
          'No se pudieron cargar tus compras.';

        this.loading = false;

        this.changeDetector.detectChanges();
      }
    });
  }

  get comprasFiltradas(): Compra[] {
    const texto =
      this.busqueda.trim().toLowerCase();

    return this.compras.filter(compra => {

      const coincideBusqueda =
        !texto ||
        compra.id
          .toString()
          .includes(texto) ||
        compra.detalles.some(detalle =>
          detalle.productoNombre
            .toLowerCase()
            .includes(texto)
        );

      const coincideFecha =
        this.comprobarFiltroFecha(
          compra.fecha
        );

      return coincideBusqueda && coincideFecha;
    });
  }

  private comprobarFiltroFecha(
    fecha: string
  ): boolean {

    if (this.filtroFecha === 'TODAS') {
      return true;
    }

    const fechaCompra =
      new Date(fecha);

    const ahora = new Date();

    if (this.filtroFecha === 'ULTIMO_MES') {
      const limite = new Date();

      limite.setMonth(
        ahora.getMonth() - 1
      );

      return fechaCompra >= limite;
    }

    if (this.filtroFecha === 'ULTIMOS_3_MESES') {
      const limite = new Date();

      limite.setMonth(
        ahora.getMonth() - 3
      );

      return fechaCompra >= limite;
    }

    if (this.filtroFecha === 'ULTIMO_ANO') {
      const limite = new Date();

      limite.setFullYear(
        ahora.getFullYear() - 1
      );

      return fechaCompra >= limite;
    }

    return true;
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
      COMPLETADA: 'completed',
      ENTREGADA: 'delivered',
      EN_TRANSITO: 'transit',
      PENDIENTE: 'pending',
      CANCELADA: 'cancelled'
    };

    return clases[estado] ?? 'pending';
  }

  productosResumen(compra: Compra): string {
    return compra.detalles
      .map(detalle =>
        detalle.productoNombre
      )
      .join(', ');
  }
}