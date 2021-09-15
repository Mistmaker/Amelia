import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActividadesService } from '../../../agenda/services/actividades.service';
import { Actividades } from '../../../models/actividades.model';
import { AgendaService } from '../../../agenda/services/agenda.service';
import { Entidad } from '../../../models/entidades.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-actividades',
  templateUrl: './buscar-actividades.component.html',
  styleUrls: ['./buscar-actividades.component.css']
})
export class BuscarActividadesComponent implements OnInit {

  @ViewChild("inputBusqueda") inputBusqueda: ElementRef;
  textoBusqueda = '';
  actividades: Actividades[] = [];

  actividad = new Actividades();
  entidades: Entidad[] = [];

  nuevaTarea = false;

  constructor(private actividadesService: ActividadesService, private agendaService: AgendaService, public dialogRef: MatDialogRef<BuscarActividadesComponent>, @Inject(MAT_DIALOG_DATA) public data: any | null) { }

  ngOnInit(): void {
    this.actividadesService.getActividades().subscribe(resp => {
      this.actividades = resp;
    });

    this.agendaService.getEntidades().subscribe(resp => {
      this.entidades = resp;
    });

    setTimeout(() => { this.inputBusqueda.nativeElement.focus(); }, 200);
  }

  busqueda(event: any) {
    setTimeout(() => {
      this.textoBusqueda = event.target.value;
      if (this.textoBusqueda !== '') {
        this.actividadesService.getActividadesPorNombre({ nombre: this.textoBusqueda }).subscribe(resp => {
          this.actividades = resp;
        });
      } else {
        this.actividadesService.getActividades().subscribe(resp => {
          this.actividades = resp;
        });
      }
    }, 200);
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({ title: 'Espere', text: 'Guardando información...', icon: 'info', allowOutsideClick: false });
    Swal.showLoading();

    this.actividadesService.postActividad(this.actividad).subscribe(resp => {
      Swal.fire({ title: 'Listo', text: 'Creado con éxito', icon: 'success' });
      this.nuevaTarea = false;
      this.textoBusqueda = this.actividad.actividad;
      const data = { value: this.textoBusqueda }
      this.busqueda(data);
      this.actividad = new Actividades();
    }, error => {
      Swal.fire({ title: 'Error', html: `Ocurrió un error <br> ${error.msg} <br> ${error.error}`, icon: 'error' });
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  seleccionarActividad(actividad: Actividades) {
    this.dialogRef.close(actividad);
  }

}
