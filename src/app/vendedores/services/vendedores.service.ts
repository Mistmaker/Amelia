import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { urlWs } from 'src/environments/environment.prod';
import { Vendedores } from './../../models/vendedores';

@Injectable({
  providedIn: 'root',
})
export class VendedoresService {
  ruta = urlWs;
  constructor(private http: HttpClient) {}

  getAllVendedores() {
    return this.http.get<Vendedores[]>(`${this.ruta}/api/vendedores`);
  }

  getVendedor(id: string) {
    return this.http.get<Vendedores>(`${this.ruta}/api/vendedores/${id}`);
  }

  getVendedorByNombre(name: string) {
    return this.http.post<Vendedores[]>(`${this.ruta}/api/vendedores/nombre`, {
      name,
    });
  }

  postVendedor(vendedor: Vendedores) {
    return this.http.post(`${this.ruta}/api/vendedores`, vendedor);
  }

  putVendedor(id: string, vendedor: Vendedores) {
    return this.http.put(`${this.ruta}/api/vendedores/${id}`, vendedor);
  }

  deleteVendedor(id: string) {
    return this.http.delete(`${this.ruta}/api/vendedores/${id}`);
  }
}
