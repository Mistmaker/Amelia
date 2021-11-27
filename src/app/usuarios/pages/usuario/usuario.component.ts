import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../../models/usuarios.model';
import { Vendedores } from '../../../models/vendedores';
import { VendedoresService } from '../../../vendedores/services/vendedores.service';
import { PerfilesService } from '../../services/perfiles.service';
import { UsuarioPerfil } from '../../../models/usuarioPerfil.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario = new Usuario();
  vendedores: Vendedores[] = [];
  perfiles: UsuarioPerfil[] = [];
  routeStr = '';
  showDeleteButton = false;

  constructor(
    private usuariosService: UsuariosService,
    private vendedoresService: VendedoresService,
    private perfilesService: PerfilesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.usuariosService.getUsuario(this.routeStr).subscribe(
        (res) => {
          this.usuario = res;
        },
        (err) => {
        }
      );
      this.showDeleteButton = true;
    }
    this.vendedoresService.getAllVendedores().subscribe(resp => {
      this.vendedores = resp;
    });
    this.perfilesService.getPerfiles().subscribe(resp => {
      console.log(resp);
      this.perfiles = resp;
    })
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.routeStr !== 'nuevo') {
      this.usuariosService
        .putUsuario(this.usuario)
        .subscribe(
          (res) => {
            Swal.fire('Éxito', 'Se actualizo el usuario con éxito', 'success').then(() => {
              this.router.navigateByUrl('usuarios');
            });
          },
          (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.usuariosService.postUsuario(this.usuario).subscribe(
        (res) => {
          Swal.fire('Éxito', 'Se creo el usuario con éxito', 'success').then(() => {
            this.router.navigateByUrl('usuarios');
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

          this.usuariosService.deleteUsuario(this.usuario.USUIDENTIFICACION).subscribe(
            (resp) => {
              Swal.fire('Eliminado!', 'Se eliminó los datos del usuario', 'success').then((r) => {
                this.router.navigateByUrl('usuarios');
              });
            },
            (error) => {
              Swal.fire('Error!', 'Ocurrió un error al eliminar', 'error');
            }
          );
        }
      }
    });
  }

  cargarNombre(id: string) {
    this.vendedoresService.getVendedor(id).subscribe(resp => {
      this.usuario.USUAPELLIDO = resp.VEN_NOMBRE;
    });
  }

}
