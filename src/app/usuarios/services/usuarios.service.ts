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
}
