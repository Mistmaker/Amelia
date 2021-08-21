import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlWs } from 'src/environments/environment';
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

  getCuenta(id: string) {
    return this.http.get<CuentaContable>(`${this.ruta}/api/cuentas/${id}`);
  }

  getCuentasByNombreOrCodigo(nameOrCode: string) {
    return this.http.post<CuentaContable[]>(
      `${this.ruta}/api/cuentas/nombre-codigo`,
      {
        nameOrCode,
      }
    );
  }
}
