import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GrupoCliente } from '../../models/grupoClientes';
import { urlWs } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GrupoClientesService {

  constructor(private http: HttpClient) { }

  getGrupos() {
    return this.http.get<GrupoCliente[]>(`${urlWs}/api/grupoClientes`);
  }
  getGrupo(id: string) {
    return this.http.get<GrupoCliente>(`${urlWs}/api/grupoClientes/${id}`);
  }
  postGrupo(grupo: GrupoCliente) {
    return this.http.post<GrupoCliente[]>(`${urlWs}/api/grupoClientes`, grupo);
  }
  putGrupo(grupo: GrupoCliente) {
    return this.http.put<GrupoCliente[]>(`${urlWs}/api/grupoClientes/${grupo.GRU_CODIGO}`, grupo);
  }
  deleteGrupos(id: string) {
    return this.http.delete<GrupoCliente[]>(`${urlWs}/api/grupoClientes/${id}`);
  }
}