import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Compra } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/compras';

  listarMisCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(
      `${this.apiUrl}/mis-compras`
    );
  }

  obtenerCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(
      `${this.apiUrl}/${id}`
    );
  }

  listarTodas(): Observable<Compra[]> {
    return this.http.get<Compra[]>(
      `${this.apiUrl}/admin/todas`
    );
  }

  marcarComoEntregada(id: number): Observable<Compra> {
    return this.http.patch<Compra>(
      `${this.apiUrl}/admin/${id}/entregar`,
      {}
    );
  }
}