import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Configuracion } from './../../models/configuracion';
import { urlWs } from './../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionesService {
  ruta = urlWs;
  constructor(private http: HttpClient) {}

  getAllConfigs() {
    return this.http.get<Configuracion[]>(`${this.ruta}/api/configuracion`);
  }
  
  getConfig(config: string) {
    return this.http.get<Configuracion>(`${this.ruta}/api/configuracion/${config}`);
  }

  postAllConfigs(data: Configuracion[]) {
    return this.http.post(`${this.ruta}/api/configuracion`, {
      data,
    });
  }

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

  getConfigPreciosIva() {
    return this.http.get<Configuracion>(
      `${this.ruta}/api/configuracion/precios-iva`
    );
  }

  postConfigPreciosIva(value: number) {
    return this.http.post(`${this.ruta}/api/configuracion/precios-iva`, {
      codigo: value,
    });
  }
}
