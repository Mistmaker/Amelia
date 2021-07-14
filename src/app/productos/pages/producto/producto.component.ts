import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { Producto } from '../../../models/productos.model';
import { ProductosService } from '../../services/productos.service';
import { GrupoProducto } from '../../../models/grupoProductos';
import { GrupoProductosService } from '../../services/grupo-productos.service';
import { TipoPrecio } from '../../../models/tipoPrecios';
import { TipoPreciosService } from '../../services/tipo-precios.service';
import { Precio } from '../../../models/precios';
import { PreciosService } from '../../services/precios.service';
import { TipoUnidad } from 'src/app/models/tipoUnidad.models';
import { TipoUnidadesService } from '../../services/tipo-unidades.service';
import { ConfiguracionesService } from 'src/app/configuraciones/service/configuraciones.service';
import { CuentaContable } from './../../../models/cuentasContables';
import { CuentaContableService } from './../../../clientes/services/cuentas-contables.service';

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

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private grupoProductosService: GrupoProductosService,
    private tipoPrecioService: TipoPreciosService,
    private preciosService: PreciosService,
    private cuentaContableService: CuentaContableService,
    private tipoUnidadService: TipoUnidadesService,
    private configService: ConfiguracionesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo' && id !== null) {
      console.log(id);
      this.productosService.getProducto(id).subscribe((resp) => {
        this.producto = resp;
        this.producto.ART_ACTIVO = this.producto.ART_ACTIVO || '1';
        console.log(resp);
        // Solo si encuentra un producto procede a sacar los precios de la base de datos
        this.preciosService.getPreciosPorProducto(id).subscribe((result) => {
          console.log(result);
          this.producto.precios = result;
        });
        this.actualizar = true;
      });
    }

    this.grupoProductosService.getGrupos().subscribe((resp) => {
      console.log(resp);
      this.grupoProductos = resp;
    });

    this.tipoPrecioService.getTiposPrecios().subscribe((resp) => {
      console.log(resp);
      this.tipoPrecios = resp;
    });
    // get cuentas contables
    this.cuentaContableService.getAllCuentas().subscribe((resp) => {
      this.cuentasContables = resp;
    });
    // get tipo unidades
    this.tipoUnidadService.getAllUnidades().subscribe((resp) => {
      this.tipoUnidades = resp;
    });
    // get config
    this.configService.getConfigPreciosIva().subscribe((resp) => {
      console.log('config', resp);
      this.includeIva = resp.codigo === 1 ? true : false;
    });
  }

  guardar(form: NgForm) {
    // console.log(form);
    if (form.invalid) {
      return;
    }

    console.log('guardar products', this.producto);
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
              console.log(resp);
              Swal.fire({
                title: 'Éxito',
                text: 'Se actualizo el producto con éxito',
                icon: 'success',
              });
            },
            (err) => {
              Swal.fire('Error', err.error.msg, 'error');
              console.error(err);
            }
          );
      } else {
        this.productosService.postProducto(this.producto).subscribe(
          (resp: any) => {
            console.log(resp);
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
