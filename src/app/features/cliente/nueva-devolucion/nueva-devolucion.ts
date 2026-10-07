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

import { FormsModule } from '@angular/forms';

import { ComprasService } from '../../../core/services/compras';
import { DevolucionesService } from '../../../core/services/devoluciones';
import { Compra, DetalleCompra } from '../../../core/models/compra.model';

@Component({
  selector: 'app-nueva-devolucion',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './nueva-devolucion.html',
  styleUrl: './nueva-devolucion.scss'
})
export class NuevaDevolucion implements OnInit {

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

  producto: DetalleCompra | null = null;

  cantidad = 1;
  motivo = '';
  descripcion = '';

  loading = true;
  enviando = false;
  error = '';

  ngOnInit(): void {

    const compraId =
      Number(
        this.route.snapshot.paramMap.get('compraId')
      );

    const productoIdParam =
      this.route.snapshot.queryParamMap.get('productoId');

    const productoId =
      productoIdParam
        ? Number(productoIdParam)
        : null;

    if (!compraId) {

      this.error =
        'Compra no válida.';

      this.loading = false;

      return;
    }

    this.cargarCompra(
      compraId,
      productoId
    );
  }

  private cargarCompra(
    compraId: number,
    productoId: number | null
  ): void {

    this.comprasService
      .obtenerCompra(compraId)
      .subscribe({

        next: (respuesta) => {

          this.compra = respuesta;

          if (productoId) {

            this.producto =
              respuesta.detalles.find(
                detalle =>
                  detalle.productoId === productoId
              ) ?? null;

            if (!this.producto) {

              this.error =
                'El producto no pertenece a esta compra.';
            }

          } else {

            this.error =
              'No se seleccionó ningún producto.';
          }

          this.loading = false;

          this.changeDetector.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO COMPRA PARA DEVOLUCIÓN:',
            error
          );

          this.error =
            'No se pudo cargar la información de la compra.';

          this.loading = false;

          this.changeDetector.detectChanges();
        }
      });
  }

  cantidadMaxima(): number {

    if (!this.producto) {
      return 1;
    }

    return this.producto.cantidad;
  }

  cancelar(): void {

    if (this.compra) {

      this.router.navigate([
        '/cliente/compras',
        this.compra.id
      ]);

      return;
    }

    this.router.navigate([
      '/cliente/compras'
    ]);
  }

  enviarSolicitud(): void {

    // Evitar envíos duplicados
    if (this.enviando) {
      return;
    }

    this.error = '';

    // Validar compra
    if (!this.compra) {

      this.error =
        'No se encontró la compra.';

      return;
    }

    // Validar producto
    if (!this.producto) {

      this.error =
        'No se encontró el producto seleccionado.';

      return;
    }

    // Validar cantidad
    const cantidadSolicitada =
      Number(this.cantidad);

    if (
      !Number.isInteger(cantidadSolicitada) ||
      cantidadSolicitada < 1
    ) {

      this.error =
        'La cantidad a devolver debe ser válida.';

      return;
    }

    if (
      cantidadSolicitada >
      this.cantidadMaxima()
    ) {

      this.error =
        `La cantidad máxima para devolver es ${this.cantidadMaxima()}.`;

      return;
    }

    // Validar motivo
    if (!this.motivo) {

      this.error =
        'Selecciona un motivo de devolución.';

      return;
    }

    /*
     * El backend espera:
     *
     * compraId
     * motivo
     * comentario
     * detalles[]
     *
     * Y cada detalle necesita:
     * detalleCompraId
     * cantidad
     */
    const request = {
      compraId: this.compra.id,

      motivo: this.motivo,

      comentario:
        this.descripcion.trim() || undefined,

      detalles: [
        {
          detalleCompraId: this.producto.id,
          cantidad: cantidadSolicitada
        }
      ]
    };

    console.log(
      'SOLICITUD DE DEVOLUCIÓN:',
      request
    );

    this.enviando = true;

    this.devolucionesService
      .crearDevolucion(request)
      .subscribe({

        next: (devolucion) => {

          console.log(
            'DEVOLUCIÓN CREADA:',
            devolucion
          );

          this.enviando = false;

          /*
           * El backend debe crearla inicialmente
           * con estado SOLICITADA.
           *
           * Después volvemos al detalle de la compra.
           */
          this.router.navigate([
            '/cliente/compras',
            this.compra!.id
          ]);
        },

        error: (error) => {

          console.error(
            'ERROR CREANDO DEVOLUCIÓN:',
            error
          );

          this.enviando = false;

          if (error?.error?.message) {

            this.error =
              error.error.message;

          } else if (error?.error?.error) {

            this.error =
              error.error.error;

          } else {

            this.error =
              'No se pudo enviar la solicitud de devolución. Inténtalo nuevamente.';
          }

          this.changeDetector.detectChanges();
        }
      });
  }
}