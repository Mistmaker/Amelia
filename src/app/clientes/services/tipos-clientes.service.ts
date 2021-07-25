import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TiposClientes } from '../../models/tiposClientes';
import { urlWs } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TiposClientesService {

  constructor(private http: HttpClient) { }

  getTipos() {
    return this.http.get<TiposClientes[]>(`${urlWs}/api/tipClientes`);
  }
}
