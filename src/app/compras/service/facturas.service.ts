import { EncabezadoFactura } from './../../models/encabezadoFactura';
import { HttpClient } from '@angular/common/http';
import { urlWs } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  ruta = urlWs;
  constructor(private http: HttpClient) {}

  postFacturaProveedor(data: EncabezadoFactura) {
    return this.http.post(`${this.ruta}/api/facturas/factura-proveedor`, data);
  }
}
