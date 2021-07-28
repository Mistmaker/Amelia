import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { Configuracion } from './../../../models/configuracion';
import { ConfiguracionesService } from './../../services/configuraciones.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css'],
})
export class ConfiguracionesComponent implements OnInit {
  configList: Configuracion[] = [];

  constructor(private configService: ConfiguracionesService) {}

  ngOnInit(): void {
    this.configService.getAllConfigs().subscribe((resp) => {
      this.configList = resp;
    });
  }

  toggleStatus(pos: number) {
    let codigo = this.configList[pos].codigo;
    this.configList[pos].codigo = codigo === 1 ? 0 : 1;
  }

  save(form: NgForm) {

    this.configService.postAllConfigs(this.configList).subscribe(
      (resp) => {
        Swal.fire(
          'Éxito',
          'Se actualizaron las configuraciones del sistema',
          'success'
        );
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }
}
