import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuarios.model';
import { urlWs } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: Usuario) {
    return this.http.post(`${urlWs}/api/usuarios/auth`, usuario);
  }

  validarInicioSesion() {
    if (localStorage.getItem('usuario')) {
      return true;
    }
    return false;
  }

  cerrarSesion(){
    localStorage.removeItem('usuario');
    this.router.navigateByUrl('auth');
  }

  getUsrFromLocalStorage(){
    if (localStorage.getItem('usuario')) {
      return localStorage.getItem('usuario');
    }
    return null;
  }
}
