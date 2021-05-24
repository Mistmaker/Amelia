import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWs } from '../../../environments/environment.prod';
import { TipoCliente } from '../../models/tipoClientes';

@Injectable({
  providedIn: 'root'
})
export class TipoClientesService {

  ruta = urlWs;

  constructor(private http: HttpClient) { }

  getTipos(){
    return this.http.get<TipoCliente[]>(`${this.ruta}/api/tipoClientes`);
  }
}
