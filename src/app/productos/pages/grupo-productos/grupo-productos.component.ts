import { Component, OnInit } from '@angular/core';

import { GrupoProducto } from './../../../models/grupoProductos';
import { GrupoProductosService } from './../../services/grupo-productos.service';

@Component({
  selector: 'app-grupo-productos',
  templateUrl: './grupo-productos.component.html',
  styleUrls: ['./grupo-productos.component.css'],
})
export class GrupoProductosComponent implements OnInit {
  textoBusqueda = '';
  gruposProductos: GrupoProducto[] = [];
  cargando = false;

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private grupoProductosService: GrupoProductosService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.grupoProductosService.getGrupos().subscribe(
      (res) => {
        this.gruposProductos = res;
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
        this.grupoProductosService
          .getGruposByNombre(this.textoBusqueda)
          .subscribe((res) => {
            this.gruposProductos = res;
            this.page = 1;
          });
      } else {
        this.grupoProductosService.getGrupos().subscribe((res) => {
          this.gruposProductos = res;
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
