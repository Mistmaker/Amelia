import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlWs } from 'src/environments/environment.prod';
import { CuentaContable } from './../../models/cuentasContables';

@Injectable({
  providedIn: 'root',
})
export class CuentaContableService {
  ruta = urlWs;
  constructor(private http: HttpClient) {}

  getAllCuentas() {
    return this.http.get<CuentaContable[]>(`${this.ruta}/api/cuentas`);
  }
}
