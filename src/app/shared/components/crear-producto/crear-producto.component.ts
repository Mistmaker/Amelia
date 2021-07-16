import { PreciosService } from './../../../productos/services/precios.service';
import { Precio } from './../../../models/precios';
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
  // product price
  positionOfPrice:number = -1;
  price = new Precio();
  pricesList: Precio[] = [];
  productSelected = false;

  constructor(
    public dialogRef: MatDialogRef<CrearProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductosService,
    private pricesService: PreciosService
  ) {}

  ngOnInit(): void {}

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

    this.pricesService
      .getPreciosPorProducto(this.productsList[position].ART_CODIGO)
      .subscribe((res) => {
        this.pricesList = res;
      });
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
    this.invoiceDetail.DETFACPRO_COSTO = this.price.ARTPRE_PRECIO;
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
      total * parseFloat(this.invoiceDetail.DETFACPRO_PORDES.toString());
    console.log(discount);

    return total - discount;
  }
}
