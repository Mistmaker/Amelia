import { Injectable } from '@angular/core';
import { urlWs } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { GrupoProducto } from '../../models/grupoProductos';

@Injectable({
  providedIn: 'root'
})
export class GrupoProductosService {

  ruta = urlWs;

  constructor(private http: HttpClient) { }

  getGrupos() {
    return this.http.get<GrupoProducto[]>(`${this.ruta}/api/grupoProductos`);
  }

}
