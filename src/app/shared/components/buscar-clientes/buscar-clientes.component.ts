import { Component, Inject, OnInit } from '@angular/core';
import { Cliente } from '../../../models/clientes.model';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-buscar-clientes',
  templateUrl: './buscar-clientes.component.html',
  styleUrls: ['./buscar-clientes.component.css']
})
export class BuscarClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  textoBusqueda = '';
  constructor(private clientesService: ClientesService,public dialogRef: MatDialogRef<BuscarClientesComponent>,@Inject(MAT_DIALOG_DATA) public data: any | null) { }

  ngOnInit(): void {
  }

  busqueda(event: any) {
    setTimeout(() => {
      this.textoBusqueda = event.target.value;
      if (this.textoBusqueda !== '') {
        this.clientesService.getClientesPorNombre(this.textoBusqueda).subscribe(resp => {
          this.clientes = resp;
          // console.log(this.clientes);
        });
      } else {
        this.clientesService.getClientes().subscribe(resp => {
          this.clientes = resp;
        });
      }
    }, 500);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  seleccionarCliente(c: Cliente){
    // console.log(c);
    this.dialogRef.close(c);
  }

}
