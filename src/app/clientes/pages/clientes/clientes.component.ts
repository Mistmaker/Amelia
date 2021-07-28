import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../../models/clientes.model';
import { GrupoClientesService } from '../../services/grupo-clientes.service';
import { GrupoCliente } from '../../../models/grupoClientes';
import { MatDialog } from '@angular/material/dialog';
import { ClienteModalComponent } from '../cliente-modal/cliente-modal.component';

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
  grupos: GrupoCliente[] = [];
  grupoId = '';
  vence = '';

  constructor(private clientesService: ClientesService, private grupoClientesService: GrupoClientesService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargando = true;
    this.clientesService.getClientes().subscribe(resp => {
      this.clientes = resp;
      this.cargando = false;
    });

    this.grupoClientesService.getGrupos().subscribe(resp => {
      this.grupos = resp;
    });
  }

  busqueda(event: any) {

    setTimeout(() => {
      this.vence = '';
      this.grupoId = '';
      this.textoBusqueda = event.target.value;
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

  busquedaVence(event: any) {

    setTimeout(() => {
      this.textoBusqueda = '';
      this.grupoId = '';
      this.vence = event.target.value;
      if (this.vence !== '') {
        this.clientesService.getClientesPorVence(this.vence).subscribe(resp => {
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

  onChangeProvincia(id: string) {
    this.textoBusqueda = '';
    this.vence = '';
    this.grupoId = id;
    if (this.grupoId !== '') {
      this.clientesService.getClientesPorGrupo(this.grupoId).subscribe(resp => {
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
  }

  enviarWhatsapp(telefono: string) {
    const tel = telefono.startsWith('0') ? telefono.replace('0', '593') : telefono;
    const url = `https://wa.me/${tel}`;
    window.open(url, "_blank");
  }

  enviarEmail(email: string) {
    const url = `mailto:${email}`;
    window.open(url, '_blank');
  }

  verDatos(id: string) {
    this.dialog.open(ClienteModalComponent, {
      data: {
        CLI_CODIGO: id
      }, autoFocus: false
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
