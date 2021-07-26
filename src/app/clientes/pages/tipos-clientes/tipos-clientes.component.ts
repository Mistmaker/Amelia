import { Component, OnInit } from '@angular/core';
import { TiposClientesService } from '../../services/tipos-clientes.service';
import { TiposClientes } from '../../../models/tiposClientes';

import { TipoCliente } from './../../../models/tipoClientes';
import { TipoClientesService } from './../../services/tipo-clientes.service';

@Component({
  selector: 'app-tipos-clientes',
  templateUrl: './tipos-clientes.component.html',
  styleUrls: ['./tipos-clientes.component.css'],
})
export class TiposClientesComponent implements OnInit {
  textoBusqueda = '';
  tiposClientes: TiposClientes[] = [];
  cargando = false;

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private tipoClientesService: TiposClientesService) { }

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

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
}
