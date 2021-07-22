import { Component, OnInit } from '@angular/core';

import { Producto } from 'src/app/models/productos.model';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  cargando = false;
  textoBusqueda = '';

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.productosService.getProductos().subscribe(resp => {
      this.productos = resp;
      console.log(resp);
      this.cargando = false;
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    // this.fetchPosts();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // this.fetchPosts();
  }

}
