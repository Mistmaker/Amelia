import { DetalleFactura } from './../../../models/detalleFactura';
import { ProductosService } from './../../../productos/services/productos.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/models/productos.model';
import { NgForm } from '@angular/forms';

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

  constructor(
    public dialogRef: MatDialogRef<CrearProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductosService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  onChangeProductSelect(position: number) {
    this.positionOfProduct = position;
    this.query = this.productsList[position].ART_NOMBRE;

    // let detail = new DetalleFactura();

    // detail.DETFACPRO_CANTIDAD = 1;
    // detail.DETFACPRO_CODIGO = this.productsList[position].ART_CODIGO;
    // detail.DETFACPRO_DESCRIPCION = this.productsList[position].ART_NOMBRE;
    // detail.DETFACPRO_COSTO = 5;
    // detail.DETFACPRO_PORDES = 0;
    // detail.DETFACPRO_TOTAL = 1 * 5;
  }

  searchProduct(event: any) {
    setTimeout(() => {
      this.productService.getProductoByName(this.query).subscribe((res) => {
        console.log('productos', res);
        this.productsList = res;
      });
    }, 500);
  }

  addProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.invoiceDetail.DETFACPRO_DESCRIPCION = this.productsList[this.positionOfProduct].ART_NOMBRE;
    this.invoiceDetail.DETFACPRO_CODIGO = this.productsList[this.positionOfProduct].ART_CODIGO;
    this.invoiceDetail.DETFACPRO_COSTO = 5;
    // TODO: calcular el total de la factura con el descuento
    this.invoiceDetail.DETFACPRO_TOTAL = this.invoiceDetail.DETFACPRO_COSTO  * this.invoiceDetail.DETFACPRO_CANTIDAD;

    this.dialogRef.close(this.invoiceDetail);
  }
}
