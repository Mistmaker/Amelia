import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { TipoUnidad } from './../../../models/tipoUnidad.models';
import { TipoUnidadesService } from './../../services/tipo-unidades.service';

@Component({
  selector: 'app-crear-tipo-unidad',
  templateUrl: './crear-tipo-unidad.component.html',
  styleUrls: ['./crear-tipo-unidad.component.css'],
})
export class CrearTipoUnidadComponent implements OnInit {
  tipoUnidad = new TipoUnidad();
  routeStr: string = '';
  showDeleteButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoUnidadesService: TipoUnidadesService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.tipoUnidadesService.getUnidad(this.routeStr).subscribe(
        (res) => {
          this.tipoUnidad = res;
        },
        (err) => {
        }
      );
      this.showDeleteButton = true;
    }
  }

  guardarUnidad(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.routeStr !== 'nuevo') {
      this.tipoUnidadesService
        .putUnidad(this.tipoUnidad.UNI_CODIGO, this.tipoUnidad)
        .subscribe(
          (res) => {
            Swal.fire(
              'Éxito',
              'Se actualizo la unidad de productos con éxito',
              'success'
            );
          },
          (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.tipoUnidadesService.postUnidad(this.tipoUnidad).subscribe(
        (res) => {
          Swal.fire(
            'Éxito',
            'Se creo unidad de productos con éxito',
            'success'
          );
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

  deleteUnidad() {
    Swal.fire({
      title: `¿Estas seguro de borrar el grupo ${this.tipoUnidad.UNI_NOMBRE}?`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.tipoUnidadesService
          .deleteUnidad(this.tipoUnidad.UNI_CODIGO)
          .subscribe(
            (res) => {
              Swal.fire(
                'Eliminado',
                'Se elimino el la unidad con éxito',
                'success'
              );
              this.router.navigate(['/productos/unidad-productos']);
            },
            (err) => {
              Swal.fire('Error', err.error.msg, 'error');
            }
          );
      }
    });
  }
}
