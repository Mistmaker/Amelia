import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal  from 'sweetalert2';

import { GrupoProductosService } from './../../services/grupo-productos.service';
import { GrupoProducto } from './../../../models/grupoProductos';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-grupo-producto',
  templateUrl: './crear-grupo-producto.component.html',
  styleUrls: ['./crear-grupo-producto.component.css'],
})
export class CrearGrupoProductoComponent implements OnInit {
  grupoProducto = new GrupoProducto();
  routeStr: string = '';
  showDeleteButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private grupoProductosService: GrupoProductosService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.grupoProductosService.getGrupo(this.routeStr).subscribe(
        (res) => {
          console.log(res);
          this.grupoProducto = res;
        },
        (err) => {
          console.log(err);
        }
      );
      this.showDeleteButton = true;
    }
  }

  guardarGrupo(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('me guardo', this.grupoProducto);
    if (this.routeStr !== 'nuevo') {
      this.grupoProductosService
        .putGrupo(this.grupoProducto.GRUP_CODIGO, this.grupoProducto)
        .subscribe(
          (res) => {
            console.log(res);
            Swal.fire(
              'Éxito',
              'Se actualizo el grupo de productos con éxito',
              'success'
            );
          },
          (err) => {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.grupoProductosService.postGrupo(this.grupoProducto).subscribe(
        (res) => {
          console.log(res);
          Swal.fire(
            'Éxito',
            'Se creo el grupo de productos con éxito',
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
      title: `¿Estas seguro de borrar el grupo ${this.grupoProducto.GRUP_NOMBRE}?`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.grupoProductosService
          .deleteGrupo(this.grupoProducto.GRUP_CODIGO)
          .subscribe(
            (res) => {
              console.log('response delete', res);
              Swal.fire(
                'Eliminado',
                'Se elimino el grupo con éxito',
                'success'
              );
              this.router.navigate(['/productos/grupo-productos']);
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
