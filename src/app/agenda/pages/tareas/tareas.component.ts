import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../../models/clientes.model';
import { AgendaActividad } from '../../../models/agendaActividades.model';
import { BuscarClientesComponent } from '../../../shared/components/buscar-clientes/buscar-clientes.component';
import { UtilidadesService } from '../../../shared/services/utilidades.service';
import { AgendaService } from '../../services/agenda.service';
import Swal from 'sweetalert2';
import { ConfiguracionesService } from '../../../configuraciones/services/configuraciones.service';

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

  constructor(private utils: UtilidadesService, private agendaService: AgendaService, private configuracionesService: ConfiguracionesService, private dialog: MatDialog) { }

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

  async eliminar(id: string, periodo: number, pos: number) {

    const datos = { periodo: periodo };
    const codigoAutorizacion = await this.configuracionesService.getConfig('AGENDA_COD_AUT_ELIM').toPromise();

    let eliminar = false;
    Swal.fire({
      title: 'Confirmación', html: `Desea eliminar las tareas de este cliente? <br> Solo se eliminarán las "Pendientes" y que no tengan comentarios <br><br> Por favor ingrese el código de autorización`, icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', input: 'password', inputPlaceholder: 'Código de autorización', inputAttributes: { autocapitalize: 'off' },
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
