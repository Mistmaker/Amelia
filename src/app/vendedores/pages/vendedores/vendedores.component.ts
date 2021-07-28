import { Component, OnInit } from '@angular/core';

import { Vendedores } from './../../../models/vendedores';
import { VendedoresService } from './../../services/vendedores.service';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css']
})
export class VendedoresComponent implements OnInit {

  textoBusqueda = '';
  vendedores: Vendedores[] = [];
  cargando = false;

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private vendedoresService:VendedoresService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.vendedoresService.getAllVendedores().subscribe(
      (res) => {
        this.vendedores = res;
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
        this.vendedoresService
          .getVendedorByNombre(this.textoBusqueda)
          .subscribe((res) => {
            this.vendedores = res;
            this.page = 1;
          });
      } else {
        this.vendedoresService.getAllVendedores().subscribe((res) => {
          this.vendedores = res;
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
