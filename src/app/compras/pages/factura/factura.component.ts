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
  searchProductStr = '';
  products: Producto[] = [];
  selectedProduct = new Producto();
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
        .getProductoByName(this.searchProductStr)
        .subscribe((res) => {
          console.log('productos', res);
          this.products = res;
        });
    }, 500);
  }

  onChangeProductSelect(value: string) {
    console.log('change value', value);
  }

  addProduct() {
    this.invoice.itemsInvoice.push(new DetalleFactura());
  }

  removeProduct(index: number) {
    this.invoice.itemsInvoice.splice(index, 1);
  }
}
