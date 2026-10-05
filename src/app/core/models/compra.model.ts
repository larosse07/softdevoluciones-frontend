export interface DetalleCompra {
  id: number;
  cantidad: number;
  precioUnitario: number;
  productoId: number;
  productoNombre: string;
  productoDescripcion?: string;
  imagenUrl?: string;
}

export interface Compra {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  usuarioId?: number;
  nombreCliente?: string;
  detalles: DetalleCompra[];
}