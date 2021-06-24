import { urlWs } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWsRuc } from '../../../environments/environment.prod';
import { Proveedor } from './../../models/proveedores.model';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  // endpoint
  route = urlWs + '/api';
  // endpoint to get data from ruc
  wsSri = urlWsRuc;

  constructor(private http: HttpClient) {}

  getProveedores() {
    return this.http.get<Proveedor[]>(`${this.route}/proveedores`);
  }
}
