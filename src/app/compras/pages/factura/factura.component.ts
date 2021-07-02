import { Producto } from './../../../models/productos.model';
import { ProductosService } from './../../../productos/services/productos.service';
import { DetalleFactura } from './../../../models/detalleFactura';
import { EncabezadoFactura } from './../../../models/encabezadoFactura';
import { NgForm } from '@angular/forms';
import { TipoClientesService } from './../../../clientes/services/tipo-clientes.service';
import { ProveedoresService } from './../../../proveedores/services/proveedores.service';
import { TipoCliente } from './../../../models/tipoClientes';
import { Proveedor } from './../../../models/proveedores.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent implements OnInit {
  // data
  supplier = new Proveedor();
  typeClient: TipoCliente[] = [];
  invoice = new EncabezadoFactura();
  // add product
  query = '';
  productsList: Producto[] = [];
  positionOfProduct: number = -1;
  // ui
  showButton: boolean = false;

  constructor(
    private supplierService: ProveedoresService,
    private typeClientService: TipoClientesService,
    private productService: ProductosService
  ) {}

  ngOnInit(): void {
    // get type client
    this.typeClientService.getTipos().subscribe((resp) => {
      console.log('type cliente', resp);
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

  saveInvoice(form: NgForm) {
    if (form.invalid) {
      return;
    }
  }

  searchProduct(event: any) {
    setTimeout(() => {
      this.productService
        .getProductoByName(this.query)
        .subscribe((res) => {
          console.log('productos', res);
          this.productsList = res;
        });
    }, 500);
  }

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

    // this.invoice.itemsInvoice.push(detail);
  }

  addProduct() {
    // $('#exampleModal').modal('show');
    this.invoice.itemsInvoice.push(new DetalleFactura());
  }

  removeProduct(index: number) {
    this.invoice.itemsInvoice.splice(index, 1);
  }
}
