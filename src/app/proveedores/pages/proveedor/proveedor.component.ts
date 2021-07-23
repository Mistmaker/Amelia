import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
  CuentasContablesProveedor,
  Proveedor,
} from './../../../models/proveedores.model';
import { ProveedoresService } from './../../services/proveedores.service';
import { TipoCliente } from './../../../models/tipoClientes';
import { TipoClientesService } from './../../../clientes/services/tipo-clientes.service';
import { ConfiguracionesService } from './../../../configuraciones/services/configuraciones.service';
import { CuentaContable } from './../../../models/cuentasContables';
import { CuentaContableService } from './../../../clientes/services/cuentas-contables.service';
import { Ciudad } from './../../../models/ciudades.models';
import { CiudadesService } from './../../../configuraciones/services/ciudades.service';
import { CuentasContablesComponent } from './../../../shared/components/cuentas-contables/cuentas-contables.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit {
  coordinateX: string = '0';
  coordinateY: string = '0';
  typeClient: TipoCliente[] = [];
  supplier = new Proveedor();
  showButton: boolean = false;
  showDeleteButton: boolean = false;
  routeStr: string;
  // ciudad
  provinciaCodigo: string = '';
  cantonCodigo: string = '';
  provincias: Ciudad[] = [];
  cantones: Ciudad[] = [];
  showMore: boolean;
  // cuentas contables proveedor
  cuentasProveedor = new CuentasContablesProveedor();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: ProveedoresService,
    private typeClientService: TipoClientesService,
    private citiesService: CiudadesService,
    private cuentaContableService: CuentaContableService,
    private configService: ConfiguracionesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      console.log(this.routeStr);
      this.showDeleteButton = true;
      this.supplierService.getProveedor(this.routeStr).subscribe((response) => {
        console.log(response);
        this.supplier = response;
        this.supplier.PRO_ESTADO = response.PRO_ESTADO || '1';
        this.supplier.PRO_MICROEMPRESA = response.PRO_MICROEMPRESA || 'NO';
        this.supplier.PRO_CONTRIESPECIAL = response.PRO_CONTRIESPECIAL || 'NO';
        this.supplier.PRO_EMPRESAFANTAS = response.PRO_EMPRESAFANTAS || 'NO';
        this.supplier.PRO_AGENRETENCION = response.PRO_AGENRETENCION || 'NO';
        this.getCoordinates();
        this.getCiudad();
        this.getAllCuentasContables();
      });
    }
    // default values
    this.supplier.PRO_PARTEREL = this.supplier.PRO_PARTEREL || 'n';
    this.supplier.PRO_MICROEMPRESA = this.supplier.PRO_MICROEMPRESA || 'NO';
    this.supplier.PRO_CONTRIESPECIAL = this.supplier.PRO_CONTRIESPECIAL || 'NO';
    this.supplier.PRO_EMPRESAFANTAS = this.supplier.PRO_EMPRESAFANTAS || 'NO';
    this.supplier.PRO_AGENRETENCION = this.supplier.PRO_AGENRETENCION || 'NO';

    this.typeClientService.getTipos().subscribe((resp) => {
      this.typeClient = resp;
    });
    // get all provincias
    this.citiesService.getAllProvincias().subscribe((resp) => {
      this.provincias = resp;
    });
    // get config
    this.configService.getConfigProveedores().subscribe((resp) => {
      this.showMore = resp.codigo === 1 ? true : false;
    });
  }

  openDialog(attribute: string): void {
    console.log('ATTRIBUTE', attribute);

    const dialogRef = this.dialog.open(CuentasContablesComponent, {
      panelClass: 'dialog-responsive',
      data: {
        name: this.cuentasProveedor[attribute],
      },
    });

    dialogRef.afterClosed().subscribe((result: CuentaContable) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.supplier[attribute] = result.CON_CODIGO;
        this.cuentasProveedor[attribute] =
          result.CON_CODIGO + ' || ' + result.CON_NOMBRE;
      }
    });
  }

  getAllCuentasContables(): void {
    // CON_CODIGO1
    this.cuentaContableService
      .getCuenta(this.supplier.CON_CODIGO1)
      .subscribe((res) => {
        this.cuentasProveedor.CON_CODIGO1 =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // CON_CODIGO2
    this.cuentaContableService
      .getCuenta(this.supplier.CON_CODIGO2)
      .subscribe((res) => {
        this.cuentasProveedor.CON_CODIGO2 =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // PRO_BASEIVA
    this.cuentaContableService
      .getCuenta(this.supplier.PRO_BASEIVA)
      .subscribe((res) => {
        this.cuentasProveedor.PRO_BASEIVA =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // PRO_BASECERO
    this.cuentaContableService
      .getCuenta(this.supplier.PRO_BASECERO)
      .subscribe((res) => {
        this.cuentasProveedor.PRO_BASECERO =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // PRO_BASENOBJET
    this.cuentaContableService
      .getCuenta(this.supplier.PRO_BASENOBJET)
      .subscribe((res) => {
        this.cuentasProveedor.PRO_BASENOBJET =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });
  }

  getCiudad() {
    if (this.supplier.PRO_CIUDAD) {
      const data = this.supplier.PRO_CIUDAD.split('.');
      console.log(data);
      this.provinciaCodigo = data[0];
      this.getAllCantones(this.provinciaCodigo);
      this.cantonCodigo = this.supplier.PRO_CIUDAD;
    }
  }

  onChangeProvincia(id: string) {
    this.getAllCantones(id);
  }

  getAllCantones(id: string) {
    // get all cantones
    this.citiesService.getAllCantonesByProvincia(id).subscribe((resp) => {
      this.cantones = resp;
    });
  }

  getCoordinates() {
    let coordinates = this.supplier.PRO_GMAPS.split(',');
    this.coordinateX = coordinates[0].replace(',', '').replace(' ', '');
    this.coordinateY = coordinates[1].replace(',', '').replace(' ', '');
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
    // put null on dates containing undefined string
    if (
      this.supplier.PRO_FECINIACTIVIDADES &&
      this.supplier.PRO_FECINIACTIVIDADES.includes('undefined')
    )
      this.supplier.PRO_FECINIACTIVIDADES = null;
    if (
      this.supplier.PRO_FECCESACTIVIDADES &&
      this.supplier.PRO_FECCESACTIVIDADES.includes('undefined')
    )
      this.supplier.PRO_FECCESACTIVIDADES = null;
    if (
      this.supplier.PRO_FECREIACTIVIDADES &&
      this.supplier.PRO_FECREIACTIVIDADES.includes('undefined')
    )
      this.supplier.PRO_FECREIACTIVIDADES = null;
    if (
      this.supplier.PRO_FECACTUALIZACION &&
      this.supplier.PRO_FECACTUALIZACION.includes('undefined')
    )
      this.supplier.PRO_FECACTUALIZACION = null;
    // merge coordinates
    this.supplier.PRO_GMAPS = this.coordinateX + ',' + this.coordinateY;
    this.supplier.PRO_CIUDAD = this.cantonCodigo;
    // if stay in route nuevo -> create new proveedor
    // else update the current proveedor
    if (this.routeStr == 'nuevo') {
      this.supplierService.postProveedores(this.supplier).subscribe(
        (res: any) => {
          console.log('response post', res);
          Swal.fire('Éxito', 'Se creo el proveedor con éxito', 'success');
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
              'Éxito',
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
      return Swal.fire(
        'Advertencia',
        'Ingrese un número de identificación',
        'warning'
      );

    if (
      this.supplier.PRO_CODIGO.length !== 10 &&
      this.supplier.PRO_CODIGO.length !== 13
    )
      return Swal.fire(
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

    this.supplierService
      .getIsMicro(this.supplier.PRO_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.supplier.PRO_MICROEMPRESA = res.microempresa;
      });

    this.supplierService
      .getIsContribuyenteEspecial(this.supplier.PRO_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.supplier.PRO_CONTRIESPECIAL = res.especiales;
      });

    this.supplierService
      .getIsEmpresaFantasma(this.supplier.PRO_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.supplier.PRO_EMPRESAFANTAS = res.fantasma;
      });

    this.supplierService
      .getIsAgenteRentencion(this.supplier.PRO_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.supplier.PRO_AGENRETENCION = res.agentes;
      });
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
    this.supplier.PRO_FECHACONSULTA = new Date().toDateString();
  }

  formatDate(fecha: string): string {
    const regex = /\r\n|\r|\n|\t|\s/gi;

    let f = fecha;
    f = f.replace(regex, '');
    let date = f.split('-');

    return `${date[2]}-${date[1]}-${date[0]}`;
  }
}
