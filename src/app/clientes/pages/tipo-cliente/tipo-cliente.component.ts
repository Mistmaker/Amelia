import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { TipoCliente } from './../../../models/tipoClientes';
import { TipoClientesService } from './../../services/tipo-clientes.service';
import { TiposClientesService } from '../../services/tipos-clientes.service';
import { TiposClientes } from '../../../models/tiposClientes';

@Component({
  selector: 'app-tipo-cliente',
  templateUrl: './tipo-cliente.component.html',
  styleUrls: ['./tipo-cliente.component.css'],
})
export class TipoClienteComponent implements OnInit {
  tipoCliente = new TiposClientes();
  routeStr: string = '';
  showDeleteButton = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoClientesService: TiposClientesService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.tipoClientesService.getTipo(this.routeStr).subscribe(
        (res) => {
          this.tipoCliente = res;
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
      this.tipoClientesService
        .putTipo(this.tipoCliente)
        .subscribe(
          (res) => {
            Swal.fire(
              'Éxito',
              'Se actualizo el tipo de cliente con éxito',
              'success'
            );
          },
          (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.tipoClientesService.postTipo(this.tipoCliente).subscribe(
        (res) => {
          Swal.fire(
            'Éxito',
            'Se creo el tipo de cliente con éxito',
            'success'
          );
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

  deleteGrupo() {
    Swal.fire({
      title: `¿Estas seguro de borrar el tipo de cliente ${this.tipoCliente.TIP_NOMBRE}?`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.tipoClientesService
          .deleteTipo(this.tipoCliente.TIP_CODIGO)
          .subscribe(
            (res) => {
              Swal.fire(
                'Eliminado',
                'Se elimino el tipo de cliente con éxito',
                'success'
              );
              this.router.navigate(['/clientes/tipos-clientes']);
            },
            (err) => {
              Swal.fire('Error', err.error.msg, 'error');
            }
          );
      }
    });
  }
}
