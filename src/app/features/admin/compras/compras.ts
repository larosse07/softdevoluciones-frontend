import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Compra } from '../../../core/models/compra.model';
import { ComprasService } from '../../../core/services/compras';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './compras.html',
  styleUrl: './compras.scss'
})
export class Compras implements OnInit {

  private readonly comprasService = inject(ComprasService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  compras: Compra[] = [];

  cargando = true;
  error = '';

  procesandoId: number | null = null;

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando = true;
    this.error = '';

    this.comprasService.listarTodas().subscribe({
      next: (respuesta) => {
        this.compras = respuesta ?? [];
        this.cargando = false;

        this.changeDetector.detectChanges();
      },

      error: (error) => {
        console.error(
          'ERROR AL CARGAR COMPRAS:',
          error
        );

        this.compras = [];
        this.cargando = false;

        this.error =
          error?.error?.message ||
          'No se pudieron cargar las compras.';

        this.changeDetector.detectChanges();
      }
    });
  }

  marcarComoEntregada(compra: Compra): void {

    if (compra.estado !== 'EN_TRANSITO') {
      return;
    }

    const confirmar = window.confirm(
      `¿Marcar la compra #${compra.id} como entregada?`
    );

    if (!confirmar) {
      return;
    }

    this.procesandoId = compra.id;
    this.error = '';

    this.comprasService
      .marcarComoEntregada(compra.id)
      .subscribe({

        next: (compraActualizada) => {

          const indice = this.compras.findIndex(
            item => item.id === compraActualizada.id
          );

          if (indice !== -1) {
            this.compras[indice] = compraActualizada;
          }

          this.procesandoId = null;

          this.changeDetector.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR AL MARCAR COMPRA COMO ENTREGADA:',
            error
          );

          this.error =
            error?.error?.message ||
            'No se pudo marcar la compra como entregada.';

          this.procesandoId = null;

          this.changeDetector.detectChanges();
        }
      });
  }

  estadoTexto(estado: string): string {

    switch (estado) {

      case 'EN_TRANSITO':
        return 'En tránsito';

      case 'ENTREGADO':
        return 'Entregado';

      default:
        return estado;
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

  formatearMoneda(total: number): string {

    return new Intl.NumberFormat(
      'es-PE',
      {
        style: 'currency',
        currency: 'PEN'
      }
    ).format(total ?? 0);
  }

  nombreCliente(compra: Compra): string {

    return compra.nombreCliente ||
      `Usuario #${compra.usuarioId ?? '-'}`;
  }

  trackById(
    index: number,
    compra: Compra
  ): number {

    return compra.id;
  }
}