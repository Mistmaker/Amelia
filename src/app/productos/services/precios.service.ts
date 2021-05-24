import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWs } from '../../../environments/environment.prod';
import { Precio } from '../../models/precios';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  ruta = urlWs;

  constructor(private http: HttpClient) { }

  getPrecios() {
    return this.http.get<Precio[]>(`${this.ruta}/api/precios`);
  }

  getPreciosPorProducto(id: string) {
    return this.http.get<Precio[]>(`${this.ruta}/api/precios/IdProd/${id}`);
  }
  
}
