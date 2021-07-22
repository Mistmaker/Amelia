import { Component, OnInit } from '@angular/core';

import { TipoCliente } from './../../../models/tipoClientes';
import { TipoClientesService } from './../../services/tipo-clientes.service';

@Component({
  selector: 'app-tipos-clientes',
  templateUrl: './tipos-clientes.component.html',
  styleUrls: ['./tipos-clientes.component.css'],
})
export class TiposClientesComponent implements OnInit {
  textoBusqueda = '';
  tiposClientes: TipoCliente[] = [];
  cargando = false;

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private tipoClientesService: TipoClientesService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.tipoClientesService.getTipos().subscribe(
      (res) => {
        console.log(res);

        this.tiposClientes = res;
        this.cargando = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  search(event: any) {
    setTimeout(() => {
      this.textoBusqueda = event.target.value;
      if (this.textoBusqueda !== '') {
        this.tipoClientesService
          .getTiposClientesByNombre(this.textoBusqueda)
          .subscribe((res) => {
            this.tiposClientes = res;
            this.page = 1;
          });
      } else {
        this.tipoClientesService.getTipos().subscribe((res) => {
          this.tiposClientes = res;
          this.page = 1;
          this.cargando = false;
        });
      }
    }, 500);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
}
