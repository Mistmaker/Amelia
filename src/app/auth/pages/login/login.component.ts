import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = new Usuario();
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.validarInicioSesion()){
      this.router.navigateByUrl('');
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.login(this.usuario).subscribe(resp => {
      console.log(resp);
      if (!resp) { Swal.fire('Incorrecto', 'Usuario o contraseña incorrectos.', 'warning'); return; }
      localStorage.setItem("usuario", JSON.stringify(resp));
      this.router.navigateByUrl('');
    }, err => {
      Swal.fire('Error', 'Ocurrión un error al procesar la solicitud' + err["msg"], 'error');
    });

  }

}
