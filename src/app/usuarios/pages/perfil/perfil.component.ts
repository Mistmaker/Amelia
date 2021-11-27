import { Component, OnInit } from '@angular/core';
import { UsuarioPerfil } from '../../../models/usuarioPerfil.model';
import { PerfilesService } from '../../services/perfiles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  perfil = new UsuarioPerfil();
  perfilExistente = false;
  routeStr = '';

  constructor(private perfilesService: PerfilesService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.perfilesService.getPerfil(this.routeStr).subscribe(
        (res) => {
          this.perfil = res;
        },
        (err) => {
          console.warn(err);
        }
      );
      this.perfilExistente = true;
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.routeStr !== 'nuevo') {
      this.perfilesService.putPerfil(this.perfil).subscribe(
        (res) => {
          Swal.fire('Éxito', 'Se actualizo el perfil con éxito', 'success').then(() => {
            this.router.navigateByUrl('usuarios/perfiles');
          });
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    } else {
      this.perfilesService.postPerfil(this.perfil).subscribe(
        (res) => {
          Swal.fire('Éxito', 'Se creo el perfil con éxito', 'success').then(() => {
            this.router.navigateByUrl('usuarios/perfiles');
          });
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

  eliminar(): void {
    let eliminar = false;
    Swal.fire({ title: 'Confirmación', text: 'Desea eliminar este usuario?', icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', }).then((result) => {
      if (result.isConfirmed) {
        eliminar = true;
        if (eliminar) {
          Swal.fire({ title: 'Espere', text: 'Eliminando información', allowOutsideClick: false, icon: 'info', });
          Swal.showLoading();

          this.perfilesService.deletePerfil(this.perfil.PERFIL_CODIGO).subscribe(
            (resp) => {
              Swal.fire('Eliminado!', 'Se eliminó los datos del perfil', 'success').then((r) => {
                this.router.navigateByUrl('usuarios/perfiles');
              });
            },
            (error) => {
              console.log(error)
              Swal.fire('Error!', 'Ocurrió un error al eliminar el perfil', 'error');
            }
          );
        }
      }
    });
  }

}
