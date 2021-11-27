import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../../models/clientes.model';
import { AgendaActividad } from '../../../models/agendaActividades.model';
import { BuscarClientesComponent } from '../../../shared/components/buscar-clientes/buscar-clientes.component';
import { UtilidadesService } from '../../../shared/services/utilidades.service';
import { AgendaService } from '../../services/agenda.service';
import Swal from 'sweetalert2';
import { ConfiguracionesService } from '../../../configuraciones/services/configuraciones.service';
import { BuscarActividadesComponent } from '../../../shared/components/buscar-actividades/buscar-actividades.component';
import { Actividades } from '../../../models/actividades.model';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  @ViewChild("busqueda") busqueda: ElementRef;

  cliente = new Cliente();
  rucs: string[] = [];
  actividad = new Actividades();
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
  permitirVarios = false;
  // tareaManual = false;
  // diasAviso: number;

  constructor(private utils: UtilidadesService, private agendaService: AgendaService, private configuracionesService: ConfiguracionesService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fecha = this.utils.getFechaActual();
    this.agendaService.getActividadesGeneradas().subscribe(resp => {
      this.agendaActividades = resp;
    });
    this.configuracionesService.getConfig('TAREAS_MULTI').subscribe(resp => {
      console.log(resp);
      if (resp.codigo == 1) { this.permitirVarios = true; }
    });
  }

  crearAgenda() {
    if (!this.permitirVarios) {
      const datos = { id: this.cliente.CLI_CODIGO, periodo: this.periodo, fecha: this.fecha };
      Swal.fire({ title: 'Espere', text: 'Generando tareas...', icon: 'info', allowOutsideClick: false });
      Swal.showLoading();
      this.agendaService.generarAgenda(datos).subscribe(resp => {
        Swal.fire('Éxito', 'Tareas generadas con éxito', 'success');
        this.agendaService.getActividadesGeneradas().subscribe(resp => {
          this.agendaActividades = resp;
        });
      });
    } else {
      if (this.rucs.length == 0) { Swal.fire('Advertencia', 'Seleccione almenos a un cliente', 'warning'); return; }
      const datos = { ids: this.rucs, periodo: this.periodo, fecha: this.fecha }
      Swal.fire({ title: 'Espere', text: 'Generando tareas...', icon: 'info', allowOutsideClick: false });
      Swal.showLoading();
      this.agendaService.generarAgendaMultiplesClientes(datos).subscribe(resp => {
        console.log(resp);
        Swal.fire('Éxito', 'Tareas generadas con éxito', 'success');
        this.agendaService.getActividadesGeneradas().subscribe(resp => {
          this.agendaActividades = resp;
        });
      });
    }
  }

  async eliminar(id: string, periodo: number, creado: string) {

    const datos = { periodo: periodo, creado: creado };
    const codigoAutorizacion = await this.configuracionesService.getConfig('AGENDA_COD_AUT_ELIM').toPromise();

    let eliminar = false;
    Swal.fire({
      title: 'Confirmación', html: `Desea eliminar las tareas de este cliente? <br> Solo se eliminarán las "Pendientes" y que no tengan comentarios <br><br> Por favor ingrese el código de autorización`, icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', input: 'password', inputPlaceholder: 'Código de autorización', inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
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
          this.agendaService.deleteActividadesGeneradasCliente(id, datos).subscribe(resp => {
            this.agendaService.getActividadesGeneradas().subscribe(resp => {
              this.agendaActividades = resp;
            });
            Swal.fire('Exito', 'Registro eliminado con éxito', 'success');
          });
        }

      }
    });

  }

  // crearTareaManual() {
  //   if (!this.cliente.CLI_CODIGO) { Swal.fire('Atención', 'Seleccione un cliente primero', 'warning'); return; }
  //   if (!this.actividad.id_actividad) { Swal.fire('Atención', 'Seleccione una actividad primero', 'warning'); return; }
  //   if (!this.diasAviso) { Swal.fire('Atención', 'Ingrese los dias de aviso', 'warning'); return; }
  //   if (this.diasAviso < 0) { Swal.fire('Atención', 'Ingrese un número válido', 'warning'); return; }
  //   if (this.diasAviso !== parseInt(this.diasAviso.toString(), 10)) { Swal.fire('Atención', 'No se aceptan decimales para los días de notificación', 'warning'); return; }

  //   Swal.fire({ title: 'Espere', text: 'Generando tarea...', icon: 'info', allowOutsideClick: false });
  //   Swal.showLoading();

  //   const datosActividad = {
  //     id_cliente: this.cliente.CLI_CODIGO,
  //     id_actividad: this.actividad.id_actividad,
  //     vencimiento: this.fecha,
  //     dias: this.diasAviso
  //   }
  //   this.agendaService.postAgendaActividad(datosActividad).subscribe(resp => {
  //     Swal.fire('Éxito', 'Tarea generada con éxito', 'success');
  //     this.agendaService.getActividadesGeneradas().subscribe(resp => {
  //       this.agendaActividades = resp;
  //     });
  //   })
  // }

  // cancelarTareaManual() {
  //   this.cliente = new Cliente();
  //   this.actividad = new Actividades();
  //   this.diasAviso = null;
  //   this.tareaManual = false;
  // }

  abrirModal() {
    const dialogRef = this.dialog.open(BuscarClientesComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        name: this.cliente,
        permitirVarios: this.permitirVarios
      },
    });

    dialogRef.afterClosed().subscribe((result: Cliente | string[]) => {
      if (!Array.isArray(result)) {
        this.cliente = result;
      } else {
        this.rucs = result;
        console.log(this.rucs);
        this.cliente.CLI_CODIGO = '1';
        this.cliente.CLI_NOMBRE = `${this.rucs.length} Clientes(s) seleccionados`;
      }
    });
  }

  // abrirModalActividades() {
  //   const dialogRef = this.dialog.open(BuscarActividadesComponent, {
  //     width: '100%',
  //     height: '100%',
  //     data: {
  //       name: this.cliente,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result: Actividades) => {
  //     if (result) {
  //       this.actividad = result;
  //     }
  //   });
  // }

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
