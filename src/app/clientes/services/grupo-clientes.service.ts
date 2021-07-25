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
  getGrupo(id: string){
    return this.http.get<GrupoCliente[]>(`${urlWs}/api/grupoClientes`);
  }
  postGrupo(grupo: GrupoCliente){
    return this.http.get<GrupoCliente[]>(`${urlWs}/api/grupoClientes`);
  }
  putGrupo(grupo: GrupoCliente){
    return this.http.get<GrupoCliente[]>(`${urlWs}/api/grupoClientes`);
  }
  deleteGrupos(){
    return this.http.get<GrupoCliente[]>(`${urlWs}/api/grupoClientes`);
  }
}
