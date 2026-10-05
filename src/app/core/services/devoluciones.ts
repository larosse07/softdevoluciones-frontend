
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Devolucion,
  DevolucionRequest,
  EstadoDevolucion,
  EstadoDevolucionRequest,
  PaginaDevoluciones
} from '../models/devolucion.model';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/devoluciones';
  private readonly adminApiUrl = 'http://localhost:8080/api/admin/devoluciones';

  listarMisDevoluciones(): Observable<Devolucion[]> {
    return this.http.get<Devolucion[]>(
      `${this.apiUrl}/mis-devoluciones`
    );
  }

  obtenerDevolucion(id: number): Observable<Devolucion> {
    return this.http.get<Devolucion>(
      `${this.apiUrl}/${id}`
    );
  }

  crearDevolucion(
    request: DevolucionRequest
  ): Observable<Devolucion> {
    return this.http.post<Devolucion>(
      this.apiUrl,
      request
    );
  }

  listarAdmin(
    estado?: EstadoDevolucion,
    motivo?: string,
    fechaInicio?: string,
    fechaFin?: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginaDevoluciones> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (estado) {
      params = params.set('estado', estado);
    }

    if (motivo) {
      params = params.set('motivo', motivo);
    }

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get<PaginaDevoluciones>(
      this.adminApiUrl,
      { params }
    );
  }

  obtenerAdmin(id: number): Observable<Devolucion> {
    return this.http.get<Devolucion>(
      `${this.adminApiUrl}/${id}`
    );
  }

  cambiarEstado(
    id: number,
    request: EstadoDevolucionRequest
  ): Observable<Devolucion> {
    return this.http.patch<Devolucion>(
      `${this.adminApiUrl}/${id}/estado`,
      request
    );
  }
}

