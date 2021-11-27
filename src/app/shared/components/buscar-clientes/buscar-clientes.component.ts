import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../../../models/clientes.model';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-buscar-clientes',
  templateUrl: './buscar-clientes.component.html',
  styleUrls: ['./buscar-clientes.component.css']
})
export class BuscarClientesComponent implements OnInit {

  @ViewChild("inputBusqueda") inputBusqueda: ElementRef;

  clientes: Cliente[] = [];
  rucs: string[] = [];
  textoBusqueda = '';
  constructor(private clientesService: ClientesService, public dialogRef: MatDialogRef<BuscarClientesComponent>, @Inject(MAT_DIALOG_DATA) public data: any | null) { }

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe(resp => {
      this.clientes = resp;
    });
    setTimeout(() => { this.inputBusqueda.nativeElement.focus(); }, 200);
  }

  busqueda(event: any) {
    setTimeout(() => {
      this.textoBusqueda = event.target.value;
      if (this.textoBusqueda !== '') {
        this.clientesService.getClientesPorNombre(this.textoBusqueda).subscribe(resp => {
          this.clientes = resp;
        });
      } else {
        this.clientesService.getClientes().subscribe(resp => {
          this.clientes = resp;
        });
      }
    }, 200);
  }

  onNoClick(): void {
    if (this.data.permitirVarios) {
      this.dialogRef.close(this.rucs);
    } else {
      this.dialogRef.close(new Cliente());
    }
  }

  seleccionarCliente(c: Cliente) {
    if (this.data.permitirVarios) {
      if (c.seleccionado) {
        for (let i = 0; i < this.rucs.length; i++) {
          if (this.rucs[i] == c.CLI_CODIGO) { c.seleccionado = false; this.rucs.splice(i, 1); return; }
        }
      } else {
        this.rucs.push(c.CLI_CODIGO);
        c.seleccionado = true;
      }
    } else {
      this.dialogRef.close(c);
    }
  }

}
