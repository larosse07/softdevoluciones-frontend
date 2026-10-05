export type EstadoDevolucion =
  | 'SOLICITADA'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'COMPLETADA';

export interface DetalleDevolucion {
  id: number;
  cantidad: number;
  importe: number;
  detalleCompraId?: number;
  productoId?: number;
  productoNombre?: string;
  imagenUrl?: string;
}

export interface Devolucion {
  id: number;
  fechaSolicitud: string;
  estado: EstadoDevolucion;
  motivo: string;
  comentario?: string;
  observacionOperador?: string;
  importe: number;
  compraId: number;
  usuarioId?: number;
  nombreCliente?: string;
  detalles: DetalleDevolucion[];
}

export interface DevolucionRequest {
  compraId: number;
  motivo: string;
  comentario?: string;
  detalles: DetalleDevolucionRequest[];
}

export interface DetalleDevolucionRequest {
  detalleCompraId: number;
  cantidad: number;
}

export interface EstadoDevolucionRequest {
  estado: EstadoDevolucion;
  observacion?: string;
}

export interface PaginaDevoluciones {
  content: Devolucion[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}