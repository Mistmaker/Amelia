import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ActividadesService } from '../../services/actividades.service';
import { Actividades } from '../../../models/actividades.model';
import { Entidad } from '../../../models/entidades.model';
import { AgendaService } from '../../services/agenda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  actividad = new Actividades();
  entidades: Entidad[] = [];
  idParam: string;
  mostrarBorrar = false;

  tipoFrecuencia = '';
  segunDig = false;
  diaValido = true;

  constructor(private router: Router, private route: ActivatedRoute, private actividadesService: ActividadesService, private agendaService: AgendaService) { }

  ngOnInit(): void {

    this.agendaService.getEntidades().subscribe(resp => {
      this.entidades = resp;
    });

    this.idParam = this.route.snapshot.paramMap.get('id');
    if (this.idParam !== 'nuevo' && this.idParam !== null) {
      this.actividadesService.getActividad(this.idParam).subscribe(resp => {
        if (resp === null) { Swal.fire({ title: 'Error', html: `No se encontraron los datos de la actividad seleccionada <br> Intente nuevamente`, icon: 'error' }).then(() => { this.router.navigateByUrl('/agenda/actividades') }); }
        this.actividad = resp;
        if (this.actividad.frecuencia == 'Mensual') { this.tipoFrecuencia = 'Mensual'; } else { this.tipoFrecuencia = 'Anual'; }
        if (this.actividad.vence == 'D') { this.segunDig = true; } else { this.segunDig = false; }
        this.mostrarBorrar = true;
      });
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({ title: 'Espere', text: 'Guardando información...', icon: 'info', allowOutsideClick: false });
    Swal.showLoading();

    if (this.tipoFrecuencia == 'Mensual') {
      this.actividad.frecuencia = this.tipoFrecuencia;
    }

    if (this.idParam == 'nuevo') {
      this.actividadesService.postActividad(this.actividad).subscribe(resp => {
        console.log(resp);
        Swal.fire({ title: 'Listo', text: 'Creado con éxito', icon: 'success' });
        this.router.navigateByUrl('/agenda/actividades');
      }, error => {
        Swal.fire({ title: 'Error', html: `Ocurrió un error <br> ${error.msg} <br> ${error.error}`, icon: 'error' });
      });
    } else {
      this.actividadesService.putActividad(this.actividad).subscribe(resp => {
        console.log(resp);
        Swal.fire({ title: 'Listo', text: 'Actualizado con éxito', icon: 'success' });
        this.router.navigateByUrl('/agenda/actividades');
      }, error => {
        Swal.fire({ title: 'Error', html: `Ocurrió un error <br> ${error.msg} <br> ${error.error}`, icon: 'error' });
      });
    }
  }

  eliminarActividad(): void {
    let eliminar = false;
    Swal.fire({ title: 'Confirmación', text: 'Desea eliminar esta actividad?', icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', }).then((result) => {
      if (result.isConfirmed) {
        eliminar = true;
        if (eliminar) {
          Swal.fire({ title: 'Espere', text: 'Eliminando información', allowOutsideClick: false, icon: 'info', });
          Swal.showLoading();

          this.actividadesService.deleteActividad(this.actividad.id_actividad).subscribe(
            (resp) => {
              Swal.fire('Eliminado!', 'Se eliminó los datos de la actividad', 'success').then((r) => {
                this.router.navigateByUrl('/agenda/actividades');
              });
            },
            (error) => {
              Swal.fire({ title: 'Error', html: ` ${error.error.msg}`, icon: 'error' });
            }
          );
        }
      }
    });
  }

  establecerDia() {
    if (this.segunDig) {
      this.actividad.vence = 'D';
    } else {
      this.actividad.vence = '';
    }
  }

  validarDia() {
    console.log(+this.actividad.vence);
    if (this.actividad.vence == 'D') { this.diaValido = true; return; }
    if (+this.actividad.vence > 0 && +this.actividad.vence <= 31) { this.diaValido = true } else { this.diaValido = false }
    console.log(this.diaValido);
  }

}
