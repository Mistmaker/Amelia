import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GrupoCliente } from '../../../models/grupoClientes';
import { GrupoClientesService } from '../../services/grupo-clientes.service';

@Component({
  selector: 'app-grupo-cliente',
  templateUrl: './grupo-cliente.component.html',
  styleUrls: ['./grupo-cliente.component.css']
})
export class GrupoClienteComponent implements OnInit {

  grupo = new GrupoCliente();
  routeStr: string = '';
  showDeleteButton = false;

  constructor(private grupoClientesService: GrupoClientesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.grupoClientesService.getGrupo(this.routeStr).subscribe(
        (res) => {
          this.grupo = res;
        },
        (err) => {
        }
      );
      this.showDeleteButton = true;
    }
  }

  guardarTipo(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.routeStr !== 'nuevo') {
      this.grupoClientesService
        .putGrupo(this.grupo)
        .subscribe(
          (res) => {
            Swal.fire('Éxito', 'Se actualizo el tipo de cliente con éxito', 'success');
          },
          (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.grupoClientesService.postGrupo(this.grupo).subscribe(
        (res) => {
          Swal.fire('Éxito', 'Se creo el tipo de cliente con éxito', 'success');
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

  eliminarGrupo(): void {
    let eliminar = false;
    Swal.fire({ title: 'Confirmación', text: 'Desea eliminar este grupo?', icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', }).then((result) => {
      if (result.isConfirmed) {
        eliminar = true;
        if (eliminar) {
          Swal.fire({ title: 'Espere', text: 'Eliminando información', allowOutsideClick: false, icon: 'info', });
          Swal.showLoading();

          this.grupoClientesService.deleteGrupos(this.grupo.GRU_CODIGO).subscribe(
            (resp) => {
              Swal.fire('Eliminado!', 'Se eliminó los datos del grupo', 'success').then((r) => {
                this.router.navigateByUrl('clientes/grupos');
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

}
