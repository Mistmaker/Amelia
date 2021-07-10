import { Vendedores } from './../../models/vendedores';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlWs } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class VendedoresService {
  ruta = urlWs;
  constructor(private http: HttpClient) {}

  getAllVendedores() {
    return this.http.get<Vendedores[]>(`${this.ruta}/api/vendedores`);
  }
}
