import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWs } from 'src/environments/environment';
import { UsuarioPerfil } from '../../models/usuarioPerfil.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  constructor(private http: HttpClient) { }

  getPerfiles() {
    return this.http.get<UsuarioPerfil[]>(`${urlWs}/api/usuarioPerfiles`);
  }

  getPerfil(id: string) {
    return this.http.get<UsuarioPerfil>(`${urlWs}/api/usuarioPerfiles/${id}`);
  }

  postPerfil(perfil: UsuarioPerfil) {
    return this.http.post<UsuarioPerfil>(`${urlWs}/api/usuarioPerfiles`, perfil);
  }

  putPerfil(perfil: UsuarioPerfil) {
    return this.http.put<UsuarioPerfil>(`${urlWs}/api/usuarioPerfiles/${perfil.PERFIL_CODIGO}`, perfil);
  }

  deletePerfil(id: string) {
    return this.http.delete(`${urlWs}/api/usuarioPerfiles/${id}`);
  }
}
