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
  getTipo(id: string) {
    return this.http.get<TiposClientes>(`${urlWs}/api/tipClientes/${id}`);
  }
  postTipo(tipo: TiposClientes) {
    return this.http.post<TiposClientes[]>(`${urlWs}/api/tipClientes`, tipo);
  }
  putTipo(tipo: TiposClientes) {
    return this.http.put<TiposClientes[]>(`${urlWs}/api/tipClientes/${tipo.TIP_CODIGO}`, tipo);
  }
  deleteTipo(id: number) {
    return this.http.delete<TiposClientes[]>(`${urlWs}/api/tipClientes/${id}`);
  }
}
