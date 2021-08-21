import { TipoUnidad } from './../../models/tipoUnidad.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlWs } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoUnidadesService {
  ruta = urlWs;

  constructor(private http: HttpClient) {}

  getAllUnidades() {
    return this.http.get<TipoUnidad[]>(`${this.ruta}/api/tipoUnidades`);
  }

  getUnidad(id: string) {
    return this.http.get<TipoUnidad>(`${this.ruta}/api/tipoUnidades/${id}`);
  }

  getUnidadesByNombre(name: string) {
    return this.http.post<TipoUnidad[]>(
      `${this.ruta}/api/tipoUnidades/nombre`,
      { name }
    );
  }

  postUnidad(unidad: TipoUnidad) {
    return this.http.post(`${this.ruta}/api/tipoUnidades`, unidad);
  }

  putUnidad(id: string, unidad: TipoUnidad) {
    return this.http.put(`${this.ruta}/api/tipoUnidades/${id}`, unidad);
  }

  deleteUnidad(id: string) {
    return this.http.delete(`${this.ruta}/api/tipoUnidades/${id}`);
  }
}
