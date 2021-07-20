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
      this.typeClient = resp;
      this.supplier.PRO_TIPOIDE = this.typeClient[0].ticli_codigo;
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

  toggleCheckBox() {
    this.isNewSupplier = !this.isNewSupplier;
  }

  searchSupplier() {
    if (!this.supplier.PRO_CODIGO) {
      return Swal.fire(
        'Advertencia',
        'Ingrese un número de identificación (Ruc)',
        'warning'
      );
    }

    if (
      this.supplier.PRO_CODIGO.length !== 10 &&
      this.supplier.PRO_CODIGO.length !== 13
    )
      return Swal.fire(
        'Advertencia',
        'Cédula o RUC deben tener 10 o 13 dígitos',
        'warning'
      );

    if (!this.isNewSupplier) {
      this.supplierService.getProveedor(this.supplier.PRO_CODIGO).subscribe(
        (res) => {
          this.supplier = res;
        },
        (err) => {
          console.log('get data from database', err);
        }
      );
    } else {
      this.searchDataOnline();
    }
  }

  searchDataOnline() {
    if (this.supplier.PRO_CODIGO.length === 10) {
      this.supplierService
        .getProveedorCedula(this.supplier.PRO_CODIGO)
        .subscribe((response) => {
          console.log('cedula', response);
          this.formatData(response['result'][0], 'C');
        });
    }

    if (this.supplier.PRO_CODIGO.length === 13) {
      this.supplierService.getProveedorSri(this.supplier.PRO_CODIGO).subscribe(
        (res) => {
          console.log(res);
          this.formatData(res, 'R');
        },
        (err) => {
          this.supplierService
            .getProveedorSriAlt(this.supplier.PRO_CODIGO)
            .subscribe((res) => {
              console.log(res);
              this.formatData(res, 'R');
            });
        }
      );
    }
  }

  formatData(data: any, type: string) {
    if (type === 'C') {
      if (data['identity']) {
        this.supplier.PRO_NOMBRE = data['name'];
        this.supplier.PRO_NOMBREC = data['name'];
        this.supplier.PRO_DIRECCION1 =
          data['residence'] + ' ' + data['streets'] + ' ' + data['homenumber'];
      }
    }

    if (type === 'R') {
      if (data['RUC:']) {
        this.supplier.PRO_NOMBRE = data['Raz\u00f3n Social:'];
        this.supplier.PRO_NOMBREC =
          data['Nombre Comercial:'] !== ''
            ? data['Nombre Comercial:']
            : data['Raz\u00f3n Social:'];
        // this.cliente.CLI_CLASECONTRIBUYENTE = data["Clase de Contribuyente"];
        this.supplier.PRO_CLASECONTRIBUYENTE = data['Tipo de Contribuyente'];
        this.supplier.PRO_FECINIACTIVIDADES = this.formatDate(
          data['Fecha de inicio de actividades']
        );
        this.supplier.PRO_FECCESACTIVIDADES = this.formatDate(
          data['Fecha de cese de actividades']
        );
        this.supplier.PRO_FECREIACTIVIDADES = this.formatDate(
          data['Fecha reinicio de actividades']
        );
        this.supplier.PRO_FECACTUALIZACION = this.formatDate(
          data['Fecha actualizaci\u00f3n']
        );
      }
      if (data['NUMERO_RUC']) {
        this.supplier.PRO_NOMBRE = data['Raz\u00f3n Social:'];
        this.supplier.PRO_NOMBREC =
          data['Nombre Comercial:'] !== ''
            ? data['Nombre Comercial:']
            : data['Raz\u00f3n Social:'];
      }
    }
    this.supplier.PRO_FECHACONSULTA = new Date().toDateString();
  }

  formatDate(fecha: string): string {
    const regex = /\r\n|\r|\n|\t|\s/gi;

    let f = fecha;
    f = f.replace(regex, '');
    let date = f.split('-');

    return `${date[2]}-${date[1]}-${date[0]}`;
  }

  onChangeSelect(value: string) {}

  saveInvoice(form: NgForm) {
    if (form.invalid) {
      console.log('invalid form');
      return;
    }

    if (this.isNewSupplier) {
      // put null on dates containing undefined string
      if (
        this.supplier.PRO_FECINIACTIVIDADES &&
        this.supplier.PRO_FECINIACTIVIDADES.includes('undefined')
      )
        this.supplier.PRO_FECINIACTIVIDADES = null;
      if (
        this.supplier.PRO_FECCESACTIVIDADES &&
        this.supplier.PRO_FECCESACTIVIDADES.includes('undefined')
      )
        this.supplier.PRO_FECCESACTIVIDADES = null;
      if (
        this.supplier.PRO_FECREIACTIVIDADES &&
        this.supplier.PRO_FECREIACTIVIDADES.includes('undefined')
      )
        this.supplier.PRO_FECREIACTIVIDADES = null;
      if (
        this.supplier.PRO_FECACTUALIZACION &&
        this.supplier.PRO_FECACTUALIZACION.includes('undefined')
      )
        this.supplier.PRO_FECACTUALIZACION = null;

      this.invoice.isNewSupplier = this.isNewSupplier;
      this.invoice.supplier = this.supplier;
    }

    this.invoice.ENCFACPRO_FECHAEMISION = new Date();
    this.invoice.PRO_CODIGO = this.supplier.PRO_CODIGO;
    this.invoice.ENCFACPRO_CORREO = this.supplier.PRO_CORREO;

    console.log(this.invoice);

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
      data: { showListPrice: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.invoice.itemsInvoice.push(result);
        this.calcularValoresTotales();
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
    this.calcularTotalPorFila(pos, 'none');
    this.calcularValoresTotales();
  }

  calcularTotalPorFila(pos: number, typePercent: string) {
    console.log(pos, typePercent);
    if (typePercent === 'value') {
      this.discountValueToPercent(pos);
    } else if (typePercent === 'percent') {
      this.discountPercentToValue(pos);
    }

    this.invoice.itemsInvoice[pos].DETFACPRO_TOTAL = this.getTotalItem(
      this.invoice.itemsInvoice[pos]
    );

    this.calcularValoresTotales();
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

    let percent = (valorDescuento / costo) * 100;

    this.invoice.itemsInvoice[pos].DETFACPRO_PORDES = parseFloat(
      percent.toFixed(6)
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
  calcularValoresTotales() {
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
    let sumTotalIva = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      if (item.tributaIva.toUpperCase() === 'S') {
        let totalIva = item.DETFACPRO_TOTAL * 0.12;
        sumTotalIva += totalIva;
      }
    });
    return sumTotalIva;
  }

  calculateSubtotalNoIva(): number {
    let totalNoIva = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      if (item.tributaIva.toUpperCase() === 'N') {
        totalNoIva += item.DETFACPRO_TOTAL;
      }
    });
    return totalNoIva;
  }

  calculateDescuento(): number {
    let descuento = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      descuento += item.DETFACPRO_VALDES;
    });
    return descuento;
  }

  calculateValorIce(): number {
    let valorIce = 0;
    this.invoice.itemsInvoice.forEach((item) => {
      if (item.DETFACPRO_TRIBICE.toUpperCase() === 'S') {
        valorIce += item.DETFACPRO_ICE * item.DETFACPRO_CANTIDAD;
      }
    });
    return valorIce;
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
