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

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  compra: Compra | null = null;

  producto: DetalleCompra | null = null;

  cantidad = 1;
  motivo = '';
  descripcion = '';

  loading = true;
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

    // Aquí conectaremos el POST al backend
    // en el siguiente paso.
  }
}
