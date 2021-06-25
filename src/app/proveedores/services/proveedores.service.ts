import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWsRuc } from '../../../environments/environment.prod';
import { Proveedor } from './../../models/proveedores.model';

import {
  urlWs,
  urlWsRucAlterno,
} from './../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  // endpoint
  route = urlWs + '/api';
  // endpoint to get data from ruc
  wsSri = urlWsRuc;
  wsSriAlt = urlWsRucAlterno;

  constructor(private http: HttpClient) {}

  getProveedores() {
    return this.http.get<Proveedor[]>(`${this.route}/proveedores`);
  }

  getProveedor(id: string) {
    return this.http.get<Proveedor>(`${this.route}/proveedores/${id}`);
  }

  postProveedores(supplier: Proveedor) {
    return this.http.post(`${this.route}/proveedores`, supplier);
  }

  putProveedores(id: string, supplier: Proveedor) {
    return this.http.put(`${this.route}/proveedores/${id}`, supplier);
  }

  getProveedoresByName(name: string) {
    return this.http.post<Proveedor[]>(`${this.route}/proveedores/nombre`, {
      name,
    });
  }

  getProveedorSri(ruc: string) {
    return this.http.get(`${this.wsSri}${ruc}`);
  }

  getProveedorSriAlt(ruc: string) {
    return this.http.get(`${this.wsSriAlt}${ruc}`);
  }
}
