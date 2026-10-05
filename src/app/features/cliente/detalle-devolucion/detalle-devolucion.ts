import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-devolucion',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './detalle-devolucion.html',
  styleUrl: './detalle-devolucion.scss'
})
export class DetalleDevolucion implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id: number | null = null;

  devolucion = {
    id: 1,
    fechaSolicitud: '02/10/2026',
    estado: 'En revisión',
    motivo: 'Producto defectuoso',
    comentario: 'El producto llegó dañado.',
    observacionOperador: 'Pendiente de revisión por el operador.',
    detalles: [
      {
        productoNombre: 'Audífonos Bluetooth',
        cantidad: 1,
        importe: 80,
        imagenUrl: ''
      }
    ]
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = Number(id);

      /*
       * Aquí conectaremos el servicio de devoluciones
       * para obtener la información real.
       */
    }
  }

  get total(): number {
    return this.devolucion.detalles.reduce(
      (total, detalle) => total + (detalle.importe * detalle.cantidad),
      0
    );
  }

  volver(): void {
    this.router.navigate(['/cliente/devoluciones']);
  }

  estadoClase(): string {
    switch (this.devolucion.estado) {
      case 'Aprobada':
        return 'estado-aprobada';

      case 'Rechazada':
        return 'estado-rechazada';

      case 'En revisión':
        return 'estado-revision';

      default:
        return 'estado-default';
    }
  }
}