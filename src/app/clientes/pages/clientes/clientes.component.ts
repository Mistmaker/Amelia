import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../../models/clientes.model';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  cargando = false;
  textoBusqueda = '';

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
    this.cargando = true;
    console.log('on init - clientes')
    this.clientesService.getClientes().subscribe(resp => {
      this.clientes = resp;
      // console.log(resp);
      this.cargando = false;
    });
  }

  busqueda(event: any) {

    setTimeout(() => {

      this.textoBusqueda = event.target.value;
      console.log(this.textoBusqueda);
      if (this.textoBusqueda !== '') {
        this.clientesService.getClientesPorNombre(this.textoBusqueda).subscribe(resp => {
          this.clientes = resp;
          this.page = 1;
        });
      } else {
        this.clientesService.getClientes().subscribe(resp => {
          this.clientes = resp;
          this.cargando = false;
          this.page = 1;
        });
      }

    }, 500);


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
