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
  // ui
  showButton: boolean = false;

  constructor(
    private supplierService: ProveedoresService,
    private typeClientService: TipoClientesService
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
}
