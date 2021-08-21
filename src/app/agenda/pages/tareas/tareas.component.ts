import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../../models/clientes.model';
import { AgendaActividad } from '../../../models/agendaActividades.model';
import { BuscarClientesComponent } from '../../../shared/components/buscar-clientes/buscar-clientes.component';
import { UtilidadesService } from '../../../shared/services/utilidades.service';
import { AgendaService } from '../../services/agenda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  @ViewChild("busqueda") busqueda: ElementRef;

  cliente = new Cliente();
  periodo = '2021';
  fecha = '';
  textoBusqueda = '';
  agendaActividades: AgendaActividad[] = [];

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 12;
  tableSizes = [3, 6, 9, 12];

  cargando = false;

  constructor(private utils: UtilidadesService, private agendaService: AgendaService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fecha = this.utils.getFechaActual();
    this.agendaService.getActividadesGeneradas().subscribe(resp => {
      this.agendaActividades = resp;
    });
  }

  crearAgenda() {
    const datos = { id: this.cliente.CLI_CODIGO, periodo: this.periodo, fecha: this.fecha };
    console.log(datos);
    Swal.fire({ title: 'Espere', text: 'Generando tareas...', icon: 'info', allowOutsideClick: false });
    Swal.showLoading();
    this.agendaService.generarAgenda(datos).subscribe(resp => {
      console.log(resp);
      Swal.fire('Éxito', 'Tareas generadas con éxito', 'success');
      this.agendaService.getActividadesGeneradas().subscribe(resp => {
        this.agendaActividades = resp;
      });
    });
  }

  abrirModal() {
    const dialogRef = this.dialog.open(BuscarClientesComponent, {
      width: '100%',
      height: '100%',
      data: {
        name: this.cliente,
      },
    });

    dialogRef.afterClosed().subscribe((result: Cliente) => {
      if (result) {
        this.cliente = result;
        console.log(this.cliente);
      }
    });
  }

  limpiarBusqueda() {
    this.textoBusqueda = ''; 
    setTimeout(() => { this.busqueda.nativeElement.focus(); }, 0);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

}
