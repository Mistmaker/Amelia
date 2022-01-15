import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AgendaService } from '../../services/agenda.service';
import { AgendaActividad, AgendaActividadAdmin } from '../../../models/agendaActividades.model';
import { MatDialog } from '@angular/material/dialog';

import { orderBy } from 'lodash';
import Swal from 'sweetalert2';
import { ComentariosModalComponent } from '../comentarios-modal/comentarios-modal.component';
import { AuthService } from '../../../auth/services/auth.service';
import { BuscarClientesComponent } from '../../../shared/components/buscar-clientes/buscar-clientes.component';
import { Cliente } from '../../../models/clientes.model';
import { ConfiguracionesService } from '../../../configuraciones/services/configuraciones.service';
import { Actividades } from '../../../models/actividades.model';
import { BuscarActividadesComponent } from '../../../shared/components/buscar-actividades/buscar-actividades.component';
import { DocumentosModalComponent } from '../documentos-modal/documentos-modal.component';
import { Usuario } from '../../../models/usuarios.model';
import { PerfilesService } from '../../../usuarios/services/perfiles.service';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit {

  @ViewChild("busqueda") busqueda: ElementRef;

  agendaActividades: AgendaActividad[] = [];
  agendaActividadesAdmin: AgendaActividadAdmin[] = [];
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

  // Para tarea manual
  tareaManual = false;
  cliente = new Cliente();
  actividad = new Actividades();
  fecha = '';
  diasAviso: number;

  soloFinalizados = false;
  mostrarAgrupados = false;


  constructor(
    private agendaService: AgendaService,
    private authService: AuthService,
    private perfilesService: PerfilesService,
    private configuracionesService: ConfiguracionesService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.cargaInicial();
  }

  cargaInicial() {
    const usuario: Usuario = this.authService.getUsuario();
    console.log(usuario);

    this.perfilesService.getPerfil(usuario.PERFIL_CODIGO).subscribe(result => {
      console.log(result);
      if (result.PERFIL_CLIENTES == 'T') {
        this.configuracionesService.getConfig('TAREAS_AGRUP').subscribe(resp => {
          console.log(resp)
          if (resp.codigo == 1) { this.mostrarAgrupados = true; }
          this.cargando = true;
          this.agendaService.getAgendaActividadesAdministrador().subscribe(resp => {
            for (const usuario of resp) {
              usuario.actividades = usuario.actividades.filter(a => a.estado != 'FINALIZADO');
              usuario.vencidos = usuario.actividades.filter(a => a.ESCAT == 'VENCIDO').length;
              usuario.pendientes = usuario.actividades.filter(a => a.ESCAT == 'PENDIENTE').length;
              usuario.hoy = usuario.actividades.filter(a => a.ESCAT == 'HOY').length;
              usuario.proximos = usuario.actividades.filter(a => a.ESCAT == 'PROXIMO').length;
              usuario.tmpactividades = usuario.actividades;
            }
            console.log(resp)
            this.agendaActividadesAdmin = resp;
            this.cargando = false;
          },
            error => {
              this.cargando = false;
              console.log(error)
            });
        });
      }
    });



    this.cargando = true;
    this.agendaService.getAgendaActividades().subscribe(resp => {
      console.log(resp)
      this.agendaActividades = resp.filter(a => a.estado != 'FINALIZADO');
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
      this.agendaActividades = resp.filter(a => a.estado != 'FINALIZADO');
      this.cargando = false;
    });
    this.agendaService.getEstadoActividades().subscribe((resp: any) => {
      this.estadoActividades = resp;
      this.mostrarEstado = true;
    })
  }

  limpiarFiltros() {
    this.textoBusqueda = '';
    this.nombreCliente = '';
    this.tipoCliente = '';
    this.page = 1;
    this.cargaInicial();
  }

  mostrarFinalizados() {
    this.cargando = true;
    this.mostrarAgrupados = false;
    this.agendaService.getAgendaActividades().subscribe(resp => {
      this.agendaActividades = resp.filter(a => a.estado == 'FINALIZADO');
      this.cargando = false;
    });
  }

  ordenar(col: string) {
    this.agendaActividades = orderBy(this.agendaActividades, [col], [this.orden == 'a' ? 'asc' : 'desc']);
    this.orden = this.orden == 'a' ? 'd' : 'a';
  }

  async eliminar(id: string, comentarios: number, pos: number) {

    if (comentarios > 0) { Swal.fire('No se puede eliminar', 'La tarea tiene comentarios, por favor elimínelos e intente nuevamente', 'warning'); return; }

    const codigoAutorizacion = await this.configuracionesService.getConfig('AGENDA_COD_AUT_ELIM').toPromise();

    let eliminar = false;
    Swal.fire({
      title: 'Confirmación', html: `Desea eliminar esta tarea? <br> Por favor ingrese el código de autorización`, icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', input: 'password', inputPlaceholder: 'Código de autorización', inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
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
      });

    });

  }

  reversar(actividad: AgendaActividad) {
    actividad.estado = 'PENDIENTE';
    actividad.fecha_finalizacion = actividad.fecha_finalizacion.replace('T', ' ').replace('.000Z', '');
    this.agendaService.putAgendaActividad(actividad).subscribe(resp => {
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
        actividad.comentarios = result.comentarios;
      } else {
      }
    });
  }

  documentosActividad(actividad: AgendaActividad) {
    const dialogRef = this.dialog.open(DocumentosModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        id: actividad.id,
        estado: actividad.estado
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // actividad.comentarios = result.comentarios;
      } else {
      }
    });
  }

  cargarPorEstado(estado: string) {
    this.page = 1;
    this.cargando = true;
    this.agendaService.getAgendaActividades().subscribe(resp => {
      if (estado === 'ven') { this.agendaActividades = resp.filter(act => act.ESCAT === 'VENCIDO'); }
      if (estado === 'pen') { this.agendaActividades = resp.filter(act => act.ESCAT === 'PENDIENTE'); }
      if (estado === 'hoy') { this.agendaActividades = resp.filter(act => act.ESCAT === 'HOY'); }
      if (estado === 'pro') { this.agendaActividades = resp.filter(act => act.ESCAT === 'PROXIMO'); }
      this.cargando = false;
    });
  }

  cargarPorEstadoUsuario(grupo: AgendaActividadAdmin, estado: string) {
    grupo.page = 1;
    this.cargando = true;

    grupo.actividades = grupo.tmpactividades;
    if (estado === 'ven' && grupo.vencidos > 0) { grupo.actividades = grupo.actividades.filter(act => act.ESCAT === 'VENCIDO'); }
    if (estado === 'pen' && grupo.pendientes > 0) { grupo.actividades = grupo.actividades.filter(act => act.ESCAT === 'PENDIENTE'); }
    if (estado === 'hoy' && grupo.hoy > 0) { grupo.actividades = grupo.actividades.filter(act => act.ESCAT === 'HOY'); }
    if (estado === 'pro' && grupo.proximos > 0) { grupo.actividades = grupo.actividades.filter(act => act.ESCAT === 'PROXIMO'); }
    this.cargando = false;
  }

  crearTareaManual() {
    if (!this.cliente.CLI_CODIGO) { Swal.fire('Atención', 'Seleccione un cliente primero', 'warning'); return; }
    if (!this.actividad.id_actividad) { Swal.fire('Atención', 'Seleccione una actividad primero', 'warning'); return; }
    if (!this.diasAviso) { Swal.fire('Atención', 'Ingrese los dias de aviso', 'warning'); return; }
    if (this.diasAviso < 0) { Swal.fire('Atención', 'Ingrese un número válido', 'warning'); return; }
    if (this.diasAviso !== parseInt(this.diasAviso.toString(), 10)) { Swal.fire('Atención', 'No se aceptan decimales para los días de notificación', 'warning'); return; }

    Swal.fire({ title: 'Espere', text: 'Generando tarea...', icon: 'info', allowOutsideClick: false });
    Swal.showLoading();

    const datosActividad = {
      id_cliente: this.cliente.CLI_CODIGO,
      id_actividad: this.actividad.id_actividad,
      vencimiento: this.fecha,
      dias: this.diasAviso
    }
    this.agendaService.postAgendaActividad(datosActividad).subscribe(resp => {
      Swal.fire('Éxito', 'Tarea generada con éxito', 'success');
      this.cargarDatos();
      this.cancelarTareaManual();
      // this.agendaService.getActividadesGeneradas().subscribe(resp => {
      //   this.agendaActividades = resp;
      // });
    })
  }

  cancelarTareaManual() {
    this.cliente = new Cliente();
    this.actividad = new Actividades();
    this.diasAviso = null;
    this.tareaManual = false;
  }

  abrirModal(origen: string) {
    const dialogRef = this.dialog.open(BuscarClientesComponent, {
      width: '100%',
      height: '100%',
      data: {
        name: '',
      },
    });

    dialogRef.afterClosed().subscribe((result: Cliente) => {
      if (result.CLI_CODIGO) {
        if (origen == 'busqueda') {
          this.mostrarAgrupados = false;
          this.page = 1;
          this.nombreCliente = result.CLI_NOMBRE;
          this.tipoCliente = result.TipoCliente;
          this.agendaService.getActividadesGeneradasCliente(result.CLI_CODIGO).subscribe(resp => {
            this.agendaActividades = resp;
            this.ordenar('vence');
            this.ordenar('vence');
          });
        }
        if (origen == 'nuevaTarea') {
          this.cliente = result;
        }
      }
    });
  }

  abrirModalActividades() {
    const dialogRef = this.dialog.open(BuscarActividadesComponent, {
      width: '100%',
      height: '100%',
      data: {
        name: this.cliente,
      },
    });

    dialogRef.afterClosed().subscribe((result: Actividades) => {
      if (result) {
        this.actividad = result;
      }
    });
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.page = 1;
    setTimeout(() => { this.busqueda.nativeElement.focus(); }, 0);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  onMultiTableDataChange(grupo: AgendaActividadAdmin, event: any) {
    grupo.page = event;
    // this.page = event;
  }
  onMultiTableSizeChange(grupo: AgendaActividadAdmin, event: any): void {
    this.tableSize = event.target.value;
    grupo.page = 1;
  }

}
