import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Empresa } from '../../../models/empresa.model';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  empresa = new Empresa();
  usr = new Usuario();
  constructor(private empresaService: EmpresaService, private route: Router, private usuariosService: UsuariosService, private authService: AuthService) { }

  ngOnInit(): void {
    this.empresaService.getDatos().subscribe(resp => {
      this.empresa = resp;
    });
    if (localStorage.getItem('usuario')) { this.usr = JSON.parse(localStorage.getItem('usuario')); }
  }

  hasRoute(ruta: string) {
    return !this.route.url.includes(ruta);
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }

}
