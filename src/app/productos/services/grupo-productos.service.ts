import { Injectable } from '@angular/core';
import { urlWs } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { GrupoProducto } from '../../models/grupoProductos';

@Injectable({
  providedIn: 'root',
})
export class GrupoProductosService {
  ruta = urlWs;

  constructor(private http: HttpClient) {}

  getGrupos() {
    return this.http.get<GrupoProducto[]>(`${this.ruta}/api/grupoProductos`);
  }

  getGrupo(id: string) {
    return this.http.get<GrupoProducto>(
      `${this.ruta}/api/grupoProductos/${id}`
    );
  }

  getGruposByNombre(name: string) {
    return this.http.post<GrupoProducto[]>(
      `${this.ruta}/api/grupoProductos/nombre`,
      { name }
    );
  }

  postGrupo(grupo: GrupoProducto) {
    return this.http.post(`${this.ruta}/api/grupoProductos`, grupo);
  }

  putGrupo(id: string, grupo: GrupoProducto) {
    return this.http.put(`${this.ruta}/api/grupoProductos/${id}`, grupo);
  }

  deleteGrupo(id: string) {
    return this.http.delete(`${this.ruta}/api/grupoProductos/${id}`);
  }
}
