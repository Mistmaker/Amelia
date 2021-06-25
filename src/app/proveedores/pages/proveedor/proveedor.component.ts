import { NgForm } from '@angular/forms';
import { ProveedoresService } from './../../services/proveedores.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Proveedor } from './../../../models/proveedores.model';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit {
  supplier = new Proveedor();
  showButton: boolean = false;
  routeStr: string;

  constructor(
    private route: ActivatedRoute,
    private supplierService: ProveedoresService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      console.log(this.routeStr);
      this.supplierService.getProveedor(this.routeStr).subscribe((response) => {
        this.supplier = response;
        console.log(response);
      });
    }
  }

  saveSupplier(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // if stay in route nuevo -> create new proveedor
    // else update the current proveedor
    if (this.routeStr == 'nuevo') {
      this.supplierService.postProveedores(this.supplier).subscribe(
        (res: any) => {
          console.log('response post', res);
          Swal.fire('Advertencia', 'Se creo el proveedor con éxito', 'success');
        },
        (err) => {
          console.log('error post', err);
          Swal.fire(
            'Error',
            'Se produjo un error al crear el usuario',
            'error'
          );
        }
      );
    } else {
      this.supplierService
        .putProveedores(this.supplier.PRO_CODIGO, this.supplier)
        .subscribe(
          (res: any) => {
            console.log('response put', res);
            Swal.fire(
              'Advertencia',
              'Se actualizo el proveedor con éxito',
              'success'
            );
          },
          (err) => {
            alert('hubo un error');
            Swal.fire(
              'Error',
              'Se produjo un error al actualizar el usuario',
              'error'
            );
          }
        );
    }
  }

  searchDataOnline() {
    if (!this.supplier.PRO_CODIGO)
      Swal.fire(
        'Advertencia',
        'Ingrese un número de identificación',
        'warning'
      );

    if (this.supplier.PRO_CODIGO.length !== 13)
      Swal.fire('Advertencia', 'RUC deben tener 13 dígitos', 'warning');

    if (this.supplier.PRO_CODIGO.length === 13) {
      this.supplierService.getProveedorSri(this.supplier.PRO_CODIGO).subscribe(
        (res) => {
          console.log(res);
          this.formatData(res);
        },
        (err) => {
          this.supplierService
            .getProveedorSriAlt(this.supplier.PRO_CODIGO)
            .subscribe((res) => {
              console.log(res);
              this.formatData(res);
            });
        }
      );
    }
  }

  formatData(data: any) {
    if (data['RUC:']) {
      this.supplier.PRO_NOMBRE = data['Raz\u00f3n Social:'];
      this.supplier.PRO_NOMBREC =
        data['Nombre Comercial:'] !== ''
          ? data['Nombre Comercial:']
          : data['Raz\u00f3n Social:'];
    }
    if (data['NUMERO_RUC']) {
      this.supplier.PRO_NOMBRE = data['Raz\u00f3n Social:'];
      this.supplier.PRO_NOMBREC =
        data['Nombre Comercial:'] !== ''
          ? data['Nombre Comercial:']
          : data['Raz\u00f3n Social:'];
    }
  }
}
