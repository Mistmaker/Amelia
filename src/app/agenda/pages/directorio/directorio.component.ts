import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AgendaService } from '../../services/agenda.service';
import { AgendaActividad } from '../../../models/agendaActividades.model';
import { MatDialog } from '@angular/material/dialog';

import { orderBy } from 'lodash';
import Swal from 'sweetalert2';
import { ComentariosModalComponent } from '../comentarios-modal/comentarios-modal.component';
import { AuthService } from '../../../auth/services/auth.service';
import { BuscarClientesComponent } from '../../../shared/components/buscar-clientes/buscar-clientes.component';
import { Cliente } from '../../../models/clientes.model';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit {

  @ViewChild("busqueda") busqueda: ElementRef;

  agendaActividades: AgendaActividad[] = [];
  cargando = false;
  textoBusqueda = '';
  // Para paginación
  page = 1;
  count = 0;
  tableSize = 12;
  tableSizes = [3, 6, 9, 12];
  // Para ordenamiento
  orden = 'a'; // orden a= ascendente | b=descendente
  // Para estado de actividades
  mostrarEstado = false;
  estadoActividades: { vencidos: string, pendientes: string, hoy: string; proximos: string }
  // Para filtros de busqueda
  nombreCliente = '';
  tipoCliente='';

  constructor(private agendaService: AgendaService, private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.agendaService.getAgendaActividades().subscribe(resp => {
      this.agendaActividades = resp;
      this.ordenar('vence');
      this.cargando = false;
    });

    this.agendaService.getEstadoActividades().subscribe((resp: any) => {
      this.estadoActividades = resp;
      this.mostrarEstado = true;
    })
  }

  cargarDatos() {
    this.cargando = true;
    this.agendaService.getAgendaActividades().subscribe(resp => {
      this.agendaActividades = resp;
      this.cargando = false;
    });
  }

  ordenar(col: string) {
    this.agendaActividades = orderBy(this.agendaActividades, [col], [this.orden == 'a' ? 'asc' : 'desc']);
    this.orden = this.orden == 'a' ? 'd' : 'a';
    // console.log(this.orden);
  }

  eliminar(id: string, pos: number) {
    this.agendaService.deleteAgendaActividad(id).subscribe(resp => {
      this.agendaActividades.splice(pos, 1);
      Swal.fire('Exito', 'Registro eliminado con éxito', 'success');
    });
  }

  finalizar(actividad: AgendaActividad) {
    actividad.estado = 'FINALIZADO';
    actividad.ESCAT = 'SOLUCIONADO';
    actividad.fecha_finalizacion = this.agendaService.getFechaActual();
    const usr = JSON.parse(this.authService.getUsrFromLocalStorage());
    actividad.usuario = usr.USUAPELLIDO + ' ' + usr.USUNOMBRE;
    this.agendaService.putAgendaActividad(actividad).subscribe(resp => {
      console.log(resp);
    });
  }

  reversar(actividad: AgendaActividad) {
    actividad.estado = 'PENDIENTE';
    actividad.fecha_finalizacion = actividad.fecha_finalizacion.replace('T', ' ').replace('.000Z', '');
    this.agendaService.putAgendaActividad(actividad).subscribe(resp => {
      // console.log(resp);
      this.agendaService.getAgendaActividades().subscribe(resp => {
        this.agendaActividades = resp;
      });
    });
  }

  comentar(actividad: AgendaActividad) {
    const dialogRef = this.dialog.open(ComentariosModalComponent, {
      width: '100%',
      height: '100%',
      data: {
        id: actividad.id,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result);
        actividad.comentarios = result.comentarios;
      } else {
        console.log('sin parametro de retorno');
      }
    });
  }

  abrirModal() {
    const dialogRef = this.dialog.open(BuscarClientesComponent, {
      width: '100%',
      height: '100%',
      data: {
        name: '',
      },
    });

    dialogRef.afterClosed().subscribe((result: Cliente) => {
      if (result) {
        this.nombreCliente = result.CLI_NOMBRE;
        this.tipoCliente = result.TipoCliente;
        this.agendaService.getActividadesGeneradasCliente(result.CLI_CODIGO).subscribe(resp=>{
          this.agendaActividades = resp;
        });
        // console.log(result);
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
