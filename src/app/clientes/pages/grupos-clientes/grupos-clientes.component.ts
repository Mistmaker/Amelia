import { Component, OnInit } from '@angular/core';
import { GrupoClientesService } from '../../services/grupo-clientes.service';
import { GrupoCliente } from '../../../models/grupoClientes';

@Component({
  selector: 'app-grupos-clientes',
  templateUrl: './grupos-clientes.component.html',
  styleUrls: ['./grupos-clientes.component.css']
})
export class GruposClientesComponent implements OnInit {

  grupos: GrupoCliente[] = [];
  cargando = false;
  textoBusqueda = '';

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private grupoClientesService: GrupoClientesService) { }

  ngOnInit(): void {
    this.grupoClientesService.getGrupos().subscribe(resp => {
      this.grupos = resp;
      console.log(this.grupos);
    });
  }

}
