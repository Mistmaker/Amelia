import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Proveedor } from './../../../models/proveedores.model';
import { ProveedoresService } from './../../services/proveedores.service';
import { TipoCliente } from './../../../models/tipoClientes';
import { TipoClientesService } from './../../../clientes/services/tipo-clientes.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit {
  typeClient: TipoCliente[] = [];
  supplier = new Proveedor();
  showButton: boolean = false;
  showDeleteButton: boolean = false;
  routeStr: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: ProveedoresService,
    private typeClientService: TipoClientesService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      console.log(this.routeStr);
      this.showDeleteButton = true;
      this.supplierService.getProveedor(this.routeStr).subscribe((response) => {
        this.supplier = response;
        console.log(response);
      });
    }
    this.typeClientService.getTipos().subscribe((resp) => {
      console.log("type cliente",resp);
      this.typeClient = resp;
    });
  }

  onChangeSelect(value: string) {
    if (value === '2') {
      this.showButton = true;
    } else {
      this.showButton = false;
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
          Swal.fire('Error', err.error.msg, 'error');
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
            console.log('error put', err);
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    }
  }

  deleteProveedor() {
    Swal.fire({
      title: `¿Estas seguro de borrar el proveedor ${this.supplier.PRO_NOMBREC}?`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.supplierService
          .deleteProveedor(this.supplier.PRO_CODIGO)
          .subscribe(
            (res) => {
              console.log('response delete', res);
              Swal.fire(
                'Eliminado',
                'Se elimino el proveedor con éxito',
                'success'
              );
              this.router.navigate(['/proveedores']);
            },
            (err) => {
              console.log('error delete', err);
              Swal.fire('Error', err.error.msg, 'error');
            }
          );
      }
    });
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
