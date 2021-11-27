import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EmpresaService } from '../../services/empresa.service';
import { Empresa, EmpresaPlaca } from '../../../models/empresa.model';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  empresa = new Empresa();
  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.empresaService.getDatos().subscribe(resp => {
      this.empresa = resp;
      this.empresaService.getDatosPlacas().subscribe(r => {
        this.empresa.PLACAS = r;
      });
    });
  }

  guardar(form: NgForm) {

    console.log(this.empresa);
    if (form.invalid) {
      return;
    }
    this.empresaService.setDatos(this.empresa).subscribe(
      (res) => {
        Swal.fire('Éxito', 'Datos actualizados', 'success');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );

  }

  agregarPlaca() {
    this.empresa.PLACAS.push(new EmpresaPlaca());
  }

  quitarPlaca(index: number) {
    this.empresa.PLACAS.splice(index, 1);
  }

}
