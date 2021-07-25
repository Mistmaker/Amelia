import { NgForm } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Precio } from './../../../models/precios';
import { PreciosService } from './../../../productos/services/precios.service';
import { Producto } from 'src/app/models/productos.model';
import { ProductosService } from './../../../productos/services/productos.service';
import { DetalleFactura } from './../../../models/detalleFactura';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
})
export class CrearProductoComponent implements OnInit {
  // add product
  query = '';
  productsList: Producto[] = [];
  positionOfProduct: number = -1;
  invoiceDetail = new DetalleFactura();
  // product price
  showListPrice = false;
  positionOfPrice: number = -1;
  price = new Precio();
  pricesList: Precio[] = [];
  productSelected = false;

  constructor(
    public dialogRef: MatDialogRef<CrearProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductosService,
    private pricesService: PreciosService
  ) {
    console.log('data', data);
    this.showListPrice = data.showListPrice;
  }

  ngOnInit(): void {
    this.invoiceDetail.DETFACPRO_PORDES = 0;
    this.invoiceDetail.DETFACPRO_VALDES = 0;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeSelect(value: number) {
    this.positionOfPrice = value;
    this.price = this.pricesList[value];
  }

  onChangeProductSelect(position: number) {
    this.positionOfProduct = position;
    this.query = this.productsList[position].ART_NOMBRE;
    if (this.showListPrice) {
      this.pricesService
        .getPreciosPorProducto(this.productsList[position].ART_CODIGO)
        .subscribe((res) => {
          this.pricesList = res;
        });
    }
    this.productSelected = true;
  }

  searchProduct(event: any) {
    this.productSelected = false;
    this.positionOfProduct = -1;
    setTimeout(() => {
      this.productService.getProductoByName(this.query).subscribe((res) => {
        console.log('productos', res);
        this.productsList = res;
      });
    }, 500);
  }

  addProduct(form: NgForm) {
    if (form.invalid) {
      console.log('invalid');
      return;
    }

    this.invoiceDetail.DETFACPRO_DESCRIPCION =
      this.productsList[this.positionOfProduct].ART_NOMBRE;
    this.invoiceDetail.DETFACPRO_CODIGO =
      this.productsList[this.positionOfProduct].ART_CODIGO;
    if (this.showListPrice) {
      this.invoiceDetail.DETFACPRO_COSTO = this.price.ARTPRE_PRECIO;
    }
    // tributa ice
    this.invoiceDetail.DETFACPRO_TRIBICE =
      this.productsList[this.positionOfProduct].ART_TRIBUTAICE;
    this.invoiceDetail.DETFACPRO_ICE =
      this.productsList[this.positionOfProduct].ART_VALORICE;

    // graba iva
    this.invoiceDetail.tributaIva =
      this.productsList[this.positionOfProduct].ART_TRIBUTAIVA;

    // TODO: calcular el total de la factura con el descuento
    this.invoiceDetail.DETFACPRO_TOTAL = this.getTotal();
    this.invoiceDetail.precios = this.pricesList;
    this.dialogRef.close(this.invoiceDetail);
  }

  getTotal(): number {
    let total =
      this.invoiceDetail.DETFACPRO_COSTO *
      this.invoiceDetail.DETFACPRO_CANTIDAD;

    let discount =
      total *
      (parseFloat(this.invoiceDetail.DETFACPRO_PORDES.toString()) / 100);
    console.log(discount);

    return total - discount;
  }

  discountValueToPercent() {
    let valorDescuento = parseFloat(
      this.invoiceDetail.DETFACPRO_VALDES.toString()
    );

    let costo =
      parseFloat(this.invoiceDetail.DETFACPRO_COSTO.toString()) *
      this.invoiceDetail.DETFACPRO_CANTIDAD;

    let percent = (valorDescuento / costo) * 100;

    this.invoiceDetail.DETFACPRO_PORDES = parseFloat(percent.toFixed(6));
  }

  discountPercentToValue() {
    let porcentajeDescuento = parseFloat(
      this.invoiceDetail.DETFACPRO_PORDES.toString()
    );

    let costo =
      parseFloat(this.invoiceDetail.DETFACPRO_COSTO.toString()) *
      this.invoiceDetail.DETFACPRO_CANTIDAD;

    let value = costo * (porcentajeDescuento / 100);

    this.invoiceDetail.DETFACPRO_VALDES = parseFloat(value.toFixed(6));
  }
}
