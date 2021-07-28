import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import {
  Producto,
  CuentasContablesProducto,
} from '../../../models/productos.model';
import { ProductosService } from '../../services/productos.service';
import { GrupoProducto } from '../../../models/grupoProductos';
import { GrupoProductosService } from '../../services/grupo-productos.service';
import { TipoPrecio } from '../../../models/tipoPrecios';
import { TipoPreciosService } from '../../services/tipo-precios.service';
import { Precio } from '../../../models/precios';
import { PreciosService } from '../../services/precios.service';
import { TipoUnidad } from 'src/app/models/tipoUnidad.models';
import { TipoUnidadesService } from '../../services/tipo-unidades.service';
import { ConfiguracionesService } from './../../../configuraciones/services/configuraciones.service';
import { CuentaContable } from './../../../models/cuentasContables';
import { CuentaContableService } from './../../../clientes/services/cuentas-contables.service';
import { CuentasContablesComponent } from './../../../shared/components/cuentas-contables/cuentas-contables.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
  tipoUnidades: TipoUnidad[] = [];
  producto = new Producto();
  grupoProductos: GrupoProducto[] = [];
  tipoPrecios: TipoPrecio[] = [];
  cuentasContables: CuentaContable[] = [];

  includeIva: boolean;

  actualizar = false;
  // cuentas contables productos
  cuentasProducto = new CuentasContablesProducto();

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private grupoProductosService: GrupoProductosService,
    private tipoPrecioService: TipoPreciosService,
    private preciosService: PreciosService,
    private cuentaContableService: CuentaContableService,
    private tipoUnidadService: TipoUnidadesService,
    private configService: ConfiguracionesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo' && id !== null) {
      this.productosService.getProducto(id).subscribe((resp) => {
        this.producto = resp;
        this.producto.ART_ACTIVO = this.producto.ART_ACTIVO || '1';
        // Solo si encuentra un producto procede a sacar los precios de la base de datos
        this.preciosService.getPreciosPorProducto(id).subscribe((result) => {
          this.producto.precios = result;
        });
        this.getAllCuentasContables();
        this.actualizar = true;
      });
    }

    this.grupoProductosService.getGrupos().subscribe((resp) => {
      this.grupoProductos = resp;
    });

    this.tipoPrecioService.getTiposPrecios().subscribe((resp) => {
      this.tipoPrecios = resp;
    });
    // get tipo unidades
    this.tipoUnidadService.getAllUnidades().subscribe((resp) => {
      this.tipoUnidades = resp;
    });
    // get config
    this.configService.getConfigPreciosIva().subscribe((resp) => {
      this.includeIva = resp.codigo === 1 ? true : false;
    });
  }

  openDialog(attribute: string): void {

    const dialogRef = this.dialog.open(CuentasContablesComponent, {
      panelClass: 'dialog-responsive',
      data: {
        name: this.cuentasProducto[attribute],
      },
    });

    dialogRef.afterClosed().subscribe((result: CuentaContable) => {
      if (result) {
        this.producto[attribute] = result.CON_CODIGO;
        this.cuentasProducto[attribute] =
          result.CON_CODIGO + ' || ' + result.CON_NOMBRE;
      }
    });
  }

  getAllCuentasContables(): void {
    // ART_CUENTAINVENTARIO
    this.cuentaContableService
      .getCuenta(this.producto.ART_CUENTAINVENTARIO)
      .subscribe((res) => {
        this.cuentasProducto.ART_CUENTAINVENTARIO =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // ART_CUENTACOSTOVENTAS
    this.cuentaContableService
      .getCuenta(this.producto.ART_CUENTACOSTOVENTAS)
      .subscribe((res) => {
        this.cuentasProducto.ART_CUENTACOSTOVENTAS =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // ART_CUENTAVENTAS
    this.cuentaContableService
      .getCuenta(this.producto.ART_CUENTAVENTAS)
      .subscribe((res) => {
        this.cuentasProducto.ART_CUENTAVENTAS =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    let { repeated, indexRepeated } = this.verifyPrices();
    if (!repeated) {
      Swal.fire({
        title: 'Espere',
        text: 'Guardando información',
        allowOutsideClick: false,
        icon: 'info',
      });
      Swal.showLoading();

      if (this.actualizar) {
        this.productosService
          .putProducto(this.producto.ART_CODIGO, this.producto)
          .subscribe(
            (resp) => {
              Swal.fire({
                title: 'Éxito',
                text: 'Se actualizo el producto con éxito',
                icon: 'success',
              });
            },
            (err) => {
              Swal.fire('Error', err.error.msg, 'error');
            }
          );
      } else {
        this.productosService.postProducto(this.producto).subscribe(
          (resp: any) => {
            this.producto.ART_CODIGO = resp.ART_CODIGO;
            Swal.fire({
              title: 'Éxito',
              text: 'Se creo el producto con éxito',
              icon: 'success',
            });
          },
          (err) => {
            Swal.fire('Error', err.error.msg, 'error');
            console.error(err);
          }
        );
      }
    } else {
      Swal.fire(
        'Error',
        `El precio en la posición ${indexRepeated + 1} ya existe en la tabla`,
        'error'
      );
    }
  }

  verifyPrices() {
    // return repeated=true if price is repeats and the position of the repeated price
    // return repeated=false if price is not repeated
    let repeated = false;
    let index = 0;
    let indexRepeated = -1;

    while (!repeated && index < this.producto.precios.length) {
      let subIndex = index + 1;
      let price = this.producto.precios[index];
      while (!repeated && subIndex < this.producto.precios.length) {
        let price2 = this.producto.precios[subIndex];
        if (
          price.ARTPRE_CODIGO === price2.ARTPRE_CODIGO &&
          price.UNI_CODIGO === price2.UNI_CODIGO
        ) {
          repeated = true;
          indexRepeated = subIndex;
        }
        subIndex++;
      }
      index++;
    }

    return { repeated, indexRepeated };
  }

  agregarPrecio() {
    this.producto.precios.push(new Precio());
  }

  removePrice(index: number) {
    this.producto.precios.splice(index, 1);
  }
}
