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
import { ConfiguracionesService } from '../../../configuraciones/services/configuraciones.service';

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
  tipoCliente = '';

  constructor(private agendaService: AgendaService, private authService: AuthService, private configuracionesService: ConfiguracionesService, private dialog: MatDialog) { }

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

  async eliminar(id: string, comentarios: number, pos: number) {

    if (comentarios > 0) { Swal.fire('No se puede eliminar', 'La tarea tiene comentarios, por favor elimínelos e intente nuevamente', 'warning'); return; }

    const codigoAutorizacion = await this.configuracionesService.getConfig('AGENDA_COD_AUT_ELIM').toPromise();

    let eliminar = false;
    Swal.fire({
      title: 'Confirmación', html: `Desea eliminar esta tarea? <br> Por favor ingrese el código de autorización`, icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', input: 'password', inputPlaceholder: 'Código de autorización', inputAttributes: { autocapitalize: 'off' },
      preConfirm: (codigo) => {
        if (codigo == codigoAutorizacion.numero) {
          return true;
        } else {
          Swal.showValidationMessage(`Código no válido`);
        }
      }, allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {

        eliminar = true;
        if (eliminar) {
          Swal.fire({ title: 'Espere', text: 'Eliminando información', allowOutsideClick: false, icon: 'info', });
          Swal.showLoading();
          this.agendaService.deleteAgendaActividad(id).subscribe(resp => {
            this.agendaActividades.splice(pos, 1);
            Swal.fire('Exito', 'Registro eliminado con éxito', 'success');
          });
        }

      }
    });

  }

  finalizar(actividad: AgendaActividad) {
    this.agendaService.getComentariosAgendaActividad(actividad.id.toString()).subscribe(resp => {
      const pendientes = resp.filter(c => {
        return c.estado == "PENDIENTE";
      });

      if (pendientes.length > 0) { Swal.fire('No se puede finalizar', `La tarea tiene ${pendientes.length} comentario(s) sin revisar, por favor márquelos como revisados e intente nuevamente`, 'warning'); return; }

      actividad.estado = 'FINALIZADO';
      actividad.ESCAT = 'SOLUCIONADO';
      actividad.fecha_finalizacion = this.agendaService.getFechaActual();
      const usr = JSON.parse(this.authService.getUsrFromLocalStorage());
      actividad.usuario = (usr.USUAPELLIDO + ' ' + usr.USUNOMBRE).trim();
      this.agendaService.putAgendaActividad(actividad).subscribe(resp => {
        console.log(resp);
      });

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
        estado: actividad.estado
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

  cargarPorEstado(estado: string) {
    this.cargando = true;
    this.agendaService.getAgendaActividades().subscribe(resp => {
      if (estado === 'ven') { this.agendaActividades = resp.filter(act => act.ESCAT === 'VENCIDO'); }
      if (estado === 'pen') { this.agendaActividades = resp.filter(act => act.ESCAT === 'PENDIENTE'); }
      if (estado === 'hoy') { this.agendaActividades = resp.filter(act => act.ESCAT === 'HOY'); }
      if (estado === 'pro') { this.agendaActividades = resp.filter(act => act.ESCAT === 'PROXIMO'); }
      this.cargando = false;
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
        this.agendaService.getActividadesGeneradasCliente(result.CLI_CODIGO).subscribe(resp => {
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
