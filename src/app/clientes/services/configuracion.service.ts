import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlWs } from 'src/environments/environment.prod';
import { Configuracion } from './../../models/configuracion';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  ruta = urlWs;
  constructor(private http: HttpClient) {}

  getConfigClientes() {
    return this.http.get<Configuracion>(
      `${this.ruta}/api/configuracion/cliente-cuentas`
    );
  }

  postConfigClientes(value: number) {
    return this.http.post(`${this.ruta}/api/configuracion/cliente-cuentas`, {
      codigo: value,
    });
  }

  getConfigProveedores() {
    return this.http.get<Configuracion>(
      `${this.ruta}/api/configuracion/proveedor-cuentas`
    );
  }

  postConfigProveedores(value: number) {
    return this.http.post(`${this.ruta}/api/configuracion/proveedor-cuentas`, {
      codigo: value,
    });
  }
}
