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
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  producto = new Producto();
  grupoProductos: GrupoProducto[] = [];
  tipoPrecios: TipoPrecio[] = [];
  precios: Precio[] = [];

  constructor(private route: ActivatedRoute, private productosService: ProductosService, private grupoProductosService: GrupoProductosService, private tipoPrecioService: TipoPreciosService, private preciosService: PreciosService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo' && id !== null) {
      console.log(id);
      this.productosService.getProducto(id).subscribe(resp => {
        this.producto = resp;
        console.log(resp);
        // Solo si encuentra un producto procede a sacar los precios de la base de datos
        this.preciosService.getPreciosPorProducto(id).subscribe( result =>{
          console.log(result);
          this.precios = result;
        });
      });
    }

    this.grupoProductosService.getGrupos().subscribe(resp => {
      console.log(resp);
      this.grupoProductos = resp;
    });

    this.tipoPrecioService.getTiposPrecios().subscribe(resp =>{
      console.log(resp);
      this.tipoPrecios = resp;
    });

  }

  guardar(form: NgForm) {
    // console.log(form);
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false,
      icon: 'info',
    });
    Swal.showLoading();

    if (this.producto.ART_CODIGO) {
      this.productosService.putProducto(this.producto.ART_CODIGO, this.producto).subscribe(resp => {
        console.log(resp);
        Swal.fire({
          title: 'Listo',
          text: 'Realizado exitozamente',
          icon: 'success',
        });
      }, err => {
        console.error(err);
      });
    } else {
      this.productosService.postProducto(this.producto).subscribe((resp: any) => {
        console.log(resp);
        this.producto.ART_CODIGO = resp.ART_CODIGO;
        Swal.fire({
          title: 'Listo',
          text: 'Realizado exitozamente',
          icon: 'success',
        });
      }, err => {
        console.error(err);
      });
    }


  }

}
