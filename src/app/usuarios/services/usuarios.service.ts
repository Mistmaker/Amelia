import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuarios.model';
import { urlWs } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  getUsuarios() {
    return this.http.get<Usuario[]>(`${urlWs}/api/usuarios`);
  }
  getUsuario(id: string) {
    return this.http.get<Usuario>(`${urlWs}/api/usuarios/${id}`);
  }
  postUsuario(grupo: Usuario) {
    return this.http.post<Usuario[]>(`${urlWs}/api/usuarios`, grupo);
  }
  putUsuario(grupo: Usuario) {
    return this.http.put<Usuario[]>(`${urlWs}/api/usuarios/${grupo.USUIDENTIFICACION}`, grupo);
  }
  deleteUsuario(id: string) {
    return this.http.delete<Usuario[]>(`${urlWs}/api/usuarios/${id}`);
  }
}
