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
      width: '60%',
      data: '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.invoice.itemsInvoice.push(new DetalleFactura());
    });
  }

  addProduct() {
    this.invoice.itemsInvoice.push(new DetalleFactura());
  }

  removeProduct(index: number) {
    this.invoice.itemsInvoice.splice(index, 1);
  }
}
