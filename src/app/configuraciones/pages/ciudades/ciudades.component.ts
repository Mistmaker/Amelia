import { CiudadesService } from './../../services/ciudades.service';
import { Component, OnInit } from '@angular/core';

import { Ciudad } from './../../../models/ciudades.models';

@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.component.html',
  styleUrls: ['./ciudades.component.css'],
})
export class CiudadesComponent implements OnInit {
  textoBusqueda = '';
  ciudades: Ciudad[] = [];
  cargando = false;
  searchType = 0; // 0: provincias, 1: canton, 2: parroquias

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private ciudadesService: CiudadesService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.ciudadesService.getAllProvincias().subscribe(
      (res) => {
        this.ciudades = res;
        this.cargando = false;
      },
      (err) => {
      }
    );
  }

  search(event: any) {
    setTimeout(() => {
      this.textoBusqueda = event.target.value;
      if (this.textoBusqueda !== '') {
        this.ciudadesService
          .getCiudadesByNombre(this.textoBusqueda)
          .subscribe((res) => {
            this.ciudades = res;
            this.page = 1;
          });
      } else {
        this.ciudadesService.getAllProvincias().subscribe((res) => {
          this.ciudades = res;
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
