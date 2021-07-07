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
        console.log(response);
        this.supplier = response;
        console.log(this.supplier.PRO_NOMBREC);
      });
    }
    this.typeClientService.getTipos().subscribe((resp) => {
      console.log('type cliente', resp);
      this.typeClient = resp;
    });
  }

  onChangeSelect(value: string) {
    if (value === '3') {
      this.showButton = false;
    } else {
      this.showButton = true;
    }
  }

  saveSupplier(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('me guardo', this.supplier);

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

    if (
      this.supplier.PRO_CODIGO.length !== 10 &&
      this.supplier.PRO_CODIGO.length !== 13
    )
      Swal.fire(
        'Advertencia',
        'Cédula o RUC deben tener 10 o 13 dígitos',
        'warning'
      );

    if (this.supplier.PRO_CODIGO.length === 10) {
      this.supplierService
        .getProveedorCedula(this.supplier.PRO_CODIGO)
        .subscribe((response) => {
          console.log('cedula', response);
          this.formatData(response['result'][0], 'C');
        });
    }

    if (this.supplier.PRO_CODIGO.length === 13) {
      this.supplierService.getProveedorSri(this.supplier.PRO_CODIGO).subscribe(
        (res) => {
          console.log(res);
          this.formatData(res, 'R');
        },
        (err) => {
          this.supplierService
            .getProveedorSriAlt(this.supplier.PRO_CODIGO)
            .subscribe((res) => {
              console.log(res);
              this.formatData(res, 'R');
            });
        }
      );
    }
  }

  formatData(data: any, type: string) {
    if (type === 'C') {
      if (data['identity']) {
        this.supplier.PRO_NOMBRE = data['name'];
        this.supplier.PRO_NOMBREC = data['name'];
        this.supplier.PRO_DIRECCION1 =
          data['residence'] + ' ' + data['streets'] + ' ' + data['homenumber'];
      }
    }

    if (type === 'R') {
      if (data['RUC:']) {
        this.supplier.PRO_NOMBRE = data['Raz\u00f3n Social:'];
        this.supplier.PRO_NOMBREC =
          data['Nombre Comercial:'] !== ''
            ? data['Nombre Comercial:']
            : data['Raz\u00f3n Social:'];
        // this.cliente.CLI_CLASECONTRIBUYENTE = data["Clase de Contribuyente"];
        this.supplier.PRO_CLASECONTRIBUYENTE = data['Tipo de Contribuyente'];
        this.supplier.PRO_FECINIACTIVIDADES = this.formatDate(
          data['Fecha de inicio de actividades']
        );
        this.supplier.PRO_FECCESACTIVIDADES = this.formatDate(
          data['Fecha de cese de actividades']
        );
        this.supplier.PRO_FECREIACTIVIDADES = this.formatDate(
          data['Fecha reinicio de actividades']
        );
        this.supplier.PRO_FECACTUALIZACION = this.formatDate(
          data['Fecha actualizaci\u00f3n']
        );
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

  formatDate(fecha: string): string {
    const regex = /\r\n|\r|\n|\t|\s/gi;

    let f = fecha;
    f = f.replace(regex, '');
    let date = f.split('-');

    return `${date[2]}-${date[1]}-${date[0]}`;
  }
}
