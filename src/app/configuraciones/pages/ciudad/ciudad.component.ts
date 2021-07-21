import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Ciudad } from './../../../models/ciudades.models';
import { CiudadesService } from './../../services/ciudades.service';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.css'],
})
export class CiudadComponent implements OnInit {
  ciudad = new Ciudad();
  routeStr: string = '';
  showDeleteButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ciudadesService: CiudadesService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.ciudadesService.getCiudad(this.routeStr).subscribe(
        (res) => {
          console.log(res);
          this.ciudad = res;
          // default values
          this.ciudad.CAPITAL = this.ciudad.CAPITAL || 'N';
          this.ciudad.UBIGEO_NIVEL = this.ciudad.UBIGEO_NIVEL || '1';
        },
        (err) => {
          console.log(err);
        }
      );
      this.showDeleteButton = true;
    }
    // default values
    this.ciudad.CAPITAL = this.ciudad.CAPITAL || 'N';
    this.ciudad.UBIGEO_NIVEL = this.ciudad.UBIGEO_NIVEL || '1';
  }

  guardarCiudad(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('me guardo', this.ciudad);

    if (this.routeStr !== 'nuevo') {
      this.ciudadesService
        .putCiudad(this.ciudad.UBIGEO_CODIGO, this.ciudad)
        .subscribe(
          (res) => {
            console.log(res);
            Swal.fire('Éxito', 'Se actualizo la ciudad con éxito', 'success');
          },
          (err) => {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      console.log("post");

      this.ciudadesService.postCiudad(this.ciudad).subscribe(
        (res) => {
          console.log(res);
          Swal.fire('Éxito', 'Se creo la ciudad con éxito', 'success');
        },
        (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

  deleteCiudad() {
    Swal.fire({
      title: `¿Estas seguro de borrar la ciudad ${this.ciudad.UBIGEO_NOMBRE}?`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.ciudadesService.deleteCiudad(this.ciudad.UBIGEO_CODIGO).subscribe(
          (res) => {
            console.log('response delete', res);
            Swal.fire(
              'Eliminado',
              'Se elimino el vendedor con éxito',
              'success'
            );
            this.router.navigate(['/configuraciones/ciudades']);
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
