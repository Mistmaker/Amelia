import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { TipoClientesService } from './../../services/tipo-clientes.service';
import { TipoCliente } from './../../../models/tipoClientes';

@Component({
  selector: 'app-tipo-cliente',
  templateUrl: './tipo-cliente.component.html',
  styleUrls: ['./tipo-cliente.component.css'],
})
export class TipoClienteComponent implements OnInit {
  tipoCliente = new TipoCliente();
  routeStr: string = '';
  showDeleteButton = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoClientesService: TipoClientesService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.tipoClientesService.getTipoCliente(this.routeStr).subscribe(
        (res) => {
          console.log(res);
          this.tipoCliente = res;
        },
        (err) => {
          console.log(err);
        }
      );
      this.showDeleteButton = true;
    }
  }

  guardarTipo(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('me guardo', this.tipoCliente);
    if (this.routeStr !== 'nuevo') {
      this.tipoClientesService
        .putTipoCliente(this.tipoCliente.ticli_codigo, this.tipoCliente)
        .subscribe(
          (res) => {
            console.log(res);
            Swal.fire(
              'Éxito',
              'Se actualizo el tipo de cliente con éxito',
              'success'
            );
          },
          (err) => {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.tipoClientesService.postTipoCliente(this.tipoCliente).subscribe(
        (res) => {
          console.log(res);
          Swal.fire(
            'Éxito',
            'Se creo el tipo de cliente con éxito',
            'success'
          );
        },
        (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

  deleteGrupo() {
    Swal.fire({
      title: `¿Estas seguro de borrar el tipo de cliente ${this.tipoCliente.ticli_nombre}?`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.tipoClientesService
          .deleteTipoCliente(this.tipoCliente.ticli_codigo)
          .subscribe(
            (res) => {
              console.log('response delete', res);
              Swal.fire(
                'Eliminado',
                'Se elimino el tipo de cliente con éxito',
                'success'
              );
              this.router.navigate(['/clientes/tipos-clientes']);
            },
            (err) => {
              console.log('error delete', err);
              Swal.fire('Error', err.error.msg, 'error');
            }
          );
      }
    });
  }
}
