import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  urlWs,
  urlWsRucAlterno,
  urlWsCedula,
  urlWsRuc,
  urlWsRucCM,
  urlWsRucCE,
  urlWsRucEF,
  urlWsRucAR,
} from '../../../environments/environment';
import { Proveedor } from './../../models/proveedores.model';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  // endpoint
  route = urlWs + '/api';
  // endpoint to get data from ruc
  wsSri = urlWsRuc;
  wsSriAlt = urlWsRucAlterno;
  wsCedula = urlWsCedula;

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

  deleteProveedor(id: string) {
    return this.http.delete(`${this.route}/proveedores/${id}`);
  }

  getProveedorSri(ruc: string) {
    return this.http.get(`${this.wsSri}${ruc}`);
  }

  getProveedorSriAlt(ruc: string) {
    return this.http.get(`${this.wsSriAlt}${ruc}`);
  }

  getProveedorCedula(cedula: string) {
    return this.http.get(`${this.wsCedula}${cedula}`);
  }

  getIsMicro(id: string) {
    return this.http.get(`${urlWsRucCM}${id}`);
  }

  getIsContribuyenteEspecial(id: string) {
    return this.http.get(`${urlWsRucCE}${id}`);
  }

  getIsEmpresaFantasma(id: string) {
    return this.http.get(`${urlWsRucEF}${id}`);
  }

  getIsAgenteRentencion(id: string) {
    return this.http.get(`${urlWsRucAR}${id}`);
  }
}
