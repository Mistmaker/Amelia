import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GrupoCliente } from '../../../models/grupoClientes';
import { GrupoClientesService } from '../../services/grupo-clientes.service';

@Component({
  selector: 'app-grupo-cliente',
  templateUrl: './grupo-cliente.component.html',
  styleUrls: ['./grupo-cliente.component.css']
})
export class GrupoClienteComponent implements OnInit {

  grupo = new GrupoCliente();
  routeStr: string = '';
  showDeleteButton = false;

  constructor(private grupoClientesService: GrupoClientesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.grupoClientesService.getGrupo(this.routeStr).subscribe(
        (res) => {
          console.log(res);
          // this.grupo = res;
        },
        (err) => {
          console.log(err);
        }
      );
      this.showDeleteButton = true;
    }
  }

  guardarTipo(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.routeStr !== 'nuevo') {
      this.grupoClientesService
        .putGrupo(this.grupo)
        .subscribe(
          (res) => {
            console.log(res);
            Swal.fire('Éxito', 'Se actualizo el tipo de cliente con éxito', 'success');
          },
          (err) => {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.grupoClientesService.postGrupo(this.grupo).subscribe(
        (res) => {
          console.log(res);
          Swal.fire('Éxito', 'Se creo el tipo de cliente con éxito', 'success');
        },
        (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

}
