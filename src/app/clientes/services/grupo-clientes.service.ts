import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GrupoCliente } from '../../models/grupoClientes';
import { urlWs } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GrupoClientesService {

  constructor(private http: HttpClient) { }

  getGrupos(){
    return this.http.get<GrupoCliente[]>(`${urlWs}/api/grupoClientes`);
  }
}
