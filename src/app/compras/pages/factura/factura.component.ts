import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { EncabezadoFactura } from './../../../models/encabezadoFactura';
import { DetalleFactura } from './../../../models/detalleFactura';
import { FacturasService } from './../../service/facturas.service';
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
  isNewSupplier: boolean = false;
  // values
  subtotal: number = 0;

  constructor(
    private supplierService: ProveedoresService,
    private typeClientService: TipoClientesService,
    private facturasService: FacturasService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // get type client
    this.typeClientService.getTipos().subscribe((resp) => {
      console.log('type cliente', resp);
      this.typeClient = resp;
    });
    // default values
    this.invoice.ENCFACPRO_BASEIVA = 0;
    this.invoice.ENCFACPRO_BASECERO = 0;
    this.invoice.ENCFACPRO_BASENOOBJIVA = 0;
    this.invoice.ENCFACPRO_PORCEIVA = 0;
    this.invoice.ENCFACPRO_PORCEDES = 0;
    this.invoice.ENCFACPRO_VALORICE = 0;
    // valor IRBPNR
    this.invoice.ENCFACPRO_VALORIVA = 0;
    // propina
    this.invoice.ENCFACPRO_TOTAL = 0;
  }

  searchSupplier() {
    if (!this.isNewSupplier) {
      this.supplierService.getProveedor(this.supplier.PRO_CODIGO).subscribe(
        (res) => {
          this.supplier = res;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onChangeSelect(value: string) {}

  saveInvoice(form: NgForm) {
    if (form.invalid) {
      console.log('invalid form');
      return;
    }

    this.invoice.ENCFACPRO_FECHAEMISION = new Date();
    this.invoice.PRO_CODIGO = this.supplier.PRO_CODIGO;
    this.invoice.ENCFACPRO_CORREO = this.supplier.PRO_CORREO;

    this.facturasService.postFacturaProveedor(this.invoice).subscribe(
      (res) => {
        console.log(res);
        Swal.fire('Éxito', 'Se creo la factura con éxito', 'success');
      },
      (err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProductoComponent, {
      panelClass: 'dialog-responsive',
      data: '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.invoice.itemsInvoice.push(result);
        this.calculateTotalValues();
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
    this.calculateTotalItem(pos, 'none');
    this.calculateTotalValues();
  }

  calculateTotalItem(pos: number, typePercent: string) {
    console.log(pos, typePercent);
    if (typePercent === 'value') {
      this.discountValueToPercent(pos);
    } else if (typePercent === 'percent') {
      this.discountPercentToValue(pos);
    }

    this.invoice.itemsInvoice[pos].DETFACPRO_TOTAL = this.getTotalItem(
      this.invoice.itemsInvoice[pos]
    );

    this.calculateTotalValues();
  }

  getTotalItem(invoiceDetail: DetalleFactura): number {
    let total =
      invoiceDetail.DETFACPRO_COSTO * invoiceDetail.DETFACPRO_CANTIDAD;

    let discount =
      total * (parseFloat(invoiceDetail.DETFACPRO_PORDES.toString()) / 100);
    console.log(discount);

    return total - discount;
  }

  discountValueToPercent(pos: number) {
    let valorDescuento = parseFloat(
      this.invoice.itemsInvoice[pos].DETFACPRO_VALDES.toString()
    );

    let costo =
      parseFloat(this.invoice.itemsInvoice[pos].DETFACPRO_COSTO.toString()) *
      this.invoice.itemsInvoice[pos].DETFACPRO_CANTIDAD;

    let value = (valorDescuento / costo) * 100;

    this.invoice.itemsInvoice[pos].DETFACPRO_PORDES = parseFloat(
      value.toFixed(6)
    );
  }

  discountPercentToValue(pos: number) {
    let porcentajeDescuento = parseFloat(
      this.invoice.itemsInvoice[pos].DETFACPRO_PORDES.toString()
    );

    let costo =
      parseFloat(this.invoice.itemsInvoice[pos].DETFACPRO_COSTO.toString()) *
      this.invoice.itemsInvoice[pos].DETFACPRO_CANTIDAD;

    let value = costo * (porcentajeDescuento / 100);

    this.invoice.itemsInvoice[pos].DETFACPRO_VALDES = parseFloat(
      value.toFixed(6)
    );
  }

  // operations for all invoice
  calculateTotalValues() {
    this.subtotal = this.calculateSubtotal();
    this.invoice.ENCFACPRO_BASEIVA = this.calculateSubtotalIva();
    this.invoice.ENCFACPRO_BASECERO = this.calculateSubtotalNoIva();
    this.invoice.ENCFACPRO_BASENOOBJIVA = 0;
    this.invoice.ENCFACPRO_PORCEIVA = 0;
    this.invoice.ENCFACPRO_PORCEDES = this.calculateDescuento();
    this.invoice.ENCFACPRO_VALORICE = this.calculateValorIce();
    // valor IRBPNR
    this.invoice.ENCFACPRO_VALORIVA = this.calculateIva12P();
    // propina
    this.invoice.ENCFACPRO_TOTAL = this.calculateValorTotal();
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      subtotal += item.DETFACPRO_TOTAL;
    });
    return subtotal;
  }

  calculateSubtotalIva(): number {
    let total = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      if (item.tributaIva.toUpperCase() === 'S') {
        let value = item.DETFACPRO_TOTAL * 0.12;
        total += value;
      }
    });
    return total;
  }

  calculateSubtotalNoIva(): number {
    let total = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      if (item.tributaIva.toUpperCase() === 'N') {
        total += item.DETFACPRO_TOTAL;
      }
    });
    return total;
  }

  calculateDescuento(): number {
    let total = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      total += item.DETFACPRO_VALDES;
    });
    return total;
  }

  calculateValorIce(): number {
    let total = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      if (item.DETFACPRO_TRIBICE.toUpperCase() === 'S') {
        total += item.DETFACPRO_ICE * item.DETFACPRO_CANTIDAD;
      }
    });
    return total;
  }

  calculateIva12P(): number {
    return (
      (this.invoice.ENCFACPRO_BASEIVA + this.invoice.ENCFACPRO_VALORICE) * 0.12
    );
  }

  calculateValorTotal(): number {
    return (
      this.subtotal +
      this.invoice.ENCFACPRO_VALORICE +
      this.invoice.ENCFACPRO_VALORIVA
    );
  }
}
