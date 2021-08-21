import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWs } from '../../../environments/environment';
import { TipoCliente } from '../../models/tipoClientes';

@Injectable({
  providedIn: 'root',
})
export class TipoClientesService {
  ruta = urlWs;

  constructor(private http: HttpClient) {}

  getTipos() {
    return this.http.get<TipoCliente[]>(`${this.ruta}/api/tipoClientes`);
  }

  getTipoCliente(id: string) {
    return this.http.get<TipoCliente>(`${this.ruta}/api/tipoClientes/${id}`);
  }

  getTiposClientesByNombre(name: string) {
    return this.http.post<TipoCliente[]>(
      `${this.ruta}/api/tipoClientes/nombre`,
      { name }
    );
  }

  postTipoCliente(tipo: TipoCliente) {
    return this.http.post(`${this.ruta}/api/tipoClientes`, tipo);
  }

  putTipoCliente(id: string, tipo: TipoCliente) {
    return this.http.put(`${this.ruta}/api/tipoClientes/${id}`, tipo);
  }

  deleteTipoCliente(id: string) {
    return this.http.delete(`${this.ruta}/api/tipoClientes/${id}`);
  }
}
