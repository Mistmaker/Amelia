import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuarios.model';
import { urlWs } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(usuario: Usuario) {
    return this.http.post(`${urlWs}/api/usuarios/auth`, usuario);
  }

  validarInicioSesion() {
    if (localStorage.getItem("usuario")) {
      return true;
    }
    return false;
  }
}