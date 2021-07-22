import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import  Swal  from 'sweetalert2';

import { Vendedores } from './../../../models/vendedores';
import { VendedoresService } from './../../services/vendedores.service';
import { Ciudad } from 'src/app/models/ciudades.models';
import { CiudadesService } from './../../../configuraciones/services/ciudades.service';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.css']
})
export class VendedorComponent implements OnInit {

  vendedor = new Vendedores();
  routeStr: string = '';
  showDeleteButton = false;

  provinciaCodigo: string = '';
  cantonCodigo: string = '';
  provincias: Ciudad[] = [];
  cantones: Ciudad[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendedorService: VendedoresService,
    private ciudadesService: CiudadesService,
  ) { }

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.vendedorService.getVendedor(this.routeStr).subscribe(
        (res) => {
          console.log(res);
          this.vendedor = res;
        this.getCiudad();
        },
        (err) => {
          console.log(err);
        }
      );
      this.showDeleteButton = true;
    }

    // get all provincias
    this.ciudadesService.getAllProvincias().subscribe((resp) => {
      this.provincias = resp;
    });
  }

  getCiudad() {
    if (this.vendedor.VEN_ZONA) {
      const data = this.vendedor.VEN_ZONA.split('.');
      console.log(data);
      this.provinciaCodigo = data[0];
      this.getAllCantones(this.provinciaCodigo);
      this.cantonCodigo = this.vendedor.VEN_ZONA;
    }
  }

  onChangeProvincia(id: string) {
    this.getAllCantones(id);
  }

  getAllCantones(id: string) {
    // get all cantones
    this.ciudadesService.getAllCantonesByProvincia(id).subscribe((resp) => {
      this.cantones = resp;
    });
  }

  guardarVendedor(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('me guardo', this.vendedor);

    this.vendedor.VEN_PROVINCIA = this.provinciaCodigo;
    this.vendedor.VEN_ZONA = this.cantonCodigo;

    if (this.routeStr !== 'nuevo') {
      this.vendedorService
        .putVendedor(this.vendedor.VEN_CODIGO, this.vendedor)
        .subscribe(
          (res) => {
            console.log(res);
            Swal.fire(
              'Éxito',
              'Se actualizo el vendedor con éxito',
              'success'
            );
          },
          (err) => {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.vendedorService.postVendedor(this.vendedor).subscribe(
        (res) => {
          console.log(res);
          Swal.fire(
            'Éxito',
            'Se creo el vendedor con éxito',
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

  deleteVendedor() {
    Swal.fire({
      title: `¿Estas seguro de borrar el vendedor ${this.vendedor.VEN_NOMBRE}?`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.vendedorService
          .deleteVendedor(this.vendedor.VEN_CODIGO)
          .subscribe(
            (res) => {
              console.log('response delete', res);
              Swal.fire(
                'Eliminado',
                'Se elimino el vendedor con éxito',
                'success'
              );
              this.router.navigate(['/vendedores']);
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
