import { TipoUnidad } from './../../models/tipoUnidad.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlWs } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TipoUnidadesService {
  ruta = urlWs;

  constructor(private http: HttpClient) {}

  getAllUnidades() {
    return this.http.get<TipoUnidad[]>(`${this.ruta}/api/tipoUnidades`);
  }
}
