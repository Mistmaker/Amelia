import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DetalleFactura } from './../../../models/detalleFactura';
import { EncabezadoFactura } from './../../../models/encabezadoFactura';
import { TipoCliente } from './../../../models/tipoClientes';
import { TipoClientesService } from './../../../clientes/services/tipo-clientes.service';
import { Proveedor } from './../../../models/proveedores.model';
import { ProveedoresService } from './../../../proveedores/services/proveedores.service';
import { CrearProductoComponent } from 'src/app/shared/components/crear-producto/crear-producto.component';

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
  // ui
  showButton: boolean = false;

  constructor(
    private supplierService: ProveedoresService,
    private typeClientService: TipoClientesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // get type client
    this.typeClientService.getTipos().subscribe((resp) => {
      console.log('type cliente', resp);
      this.typeClient = resp;
    });
    // default values
    this.invoice.ENCFACPRO_TOTAL = '0.00';

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

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProductoComponent, {
      width: '100%',
      maxWidth: '100%',
      position: {
        bottom: '0px',
      },
      data: '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.invoice.itemsInvoice.push(result);
      }
    });
  }

  addProduct() {
    this.invoice.itemsInvoice.push(new DetalleFactura());
  }

  removeProduct(index: number) {
    this.invoice.itemsInvoice.splice(index, 1);
  }

  // operations for each row
  onChangeSelectPrice(pos: number, price: number) {
    this.invoice.itemsInvoice[pos].DETFACPRO_COSTO = price;
    this.calculateTotalItem(pos);
  }

  calculateTotalItem(pos: number) {
    this.invoice.itemsInvoice[pos].DETFACPRO_TOTAL = this.getTotalItem(
      this.invoice.itemsInvoice[pos]
    );
  }

  getTotalItem(invoiceDetail: DetalleFactura): number {
    let total =
      invoiceDetail.DETFACPRO_COSTO * invoiceDetail.DETFACPRO_CANTIDAD;

    let discount =
      total * parseFloat(invoiceDetail.DETFACPRO_PORDES.toString());
    console.log(discount);

    return total - discount;
  }

  // operations for all invoice
  calculateTotalValues() {
    this.invoice.itemsInvoice.forEach((item) => {});
  }

}
