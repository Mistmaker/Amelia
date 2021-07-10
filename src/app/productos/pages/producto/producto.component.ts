import { CuentaContableService } from './../../../clientes/services/cuentas-contables.service';
import { CuentaContable } from './../../../models/cuentasContables';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';

import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../../models/productos.model';
import { GrupoProductosService } from '../../services/grupo-productos.service';
import { GrupoProducto } from '../../../models/grupoProductos';
import { TipoPreciosService } from '../../services/tipo-precios.service';
import { TipoPrecio } from '../../../models/tipoPrecios';
import { PreciosService } from '../../services/precios.service';
import { Precio } from '../../../models/precios';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
  producto = new Producto();
  grupoProductos: GrupoProducto[] = [];
  tipoPrecios: TipoPrecio[] = [];
  cuentasContables: CuentaContable[] = [];

  actualizar = false;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private grupoProductosService: GrupoProductosService,
    private tipoPrecioService: TipoPreciosService,
    private preciosService: PreciosService,
    private cuentaContableService: CuentaContableService
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

    this.cuentaContableService.getAllCuentas().subscribe((resp) => {
      this.cuentasContables = resp;
    });
  }

  guardar(form: NgForm) {
    // console.log(form);
    if (form.invalid) {
      return;
    }

    console.log("guardar products", this.producto);


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
              title: 'Listo',
              text: 'Realizado exitozamente',
              icon: 'success',
            });
          },
          (err) => {
            console.error(err);
          }
        );
    } else {
      this.productosService.postProducto(this.producto).subscribe(
        (resp: any) => {
          console.log(resp);
          this.producto.ART_CODIGO = resp.ART_CODIGO;
          Swal.fire({
            title: 'Listo',
            text: 'Realizado exitosamente',
            icon: 'success',
          });
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  agregarPrecio() {
    this.producto.precios.push(new Precio());
  }
}
