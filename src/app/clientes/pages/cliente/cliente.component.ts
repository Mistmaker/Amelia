import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { formatDate } from '@angular/common';

import Swal from 'sweetalert2';

import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../../models/clientes.model';
import { TipoClientesService } from '../../services/tipo-clientes.service';
import { TipoCliente } from '../../../models/tipoClientes';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  cliente = new Cliente();
  tipoClientes: TipoCliente[] = [];
  mostrarBtn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private clientesService: ClientesService,
    private tipoClientesService: TipoClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo' && id !== null) {
      console.log(id);
      this.clientesService.getCliente(id).subscribe((resp) => {
        this.cliente = resp;
        console.log(resp);
      });
    }
    this.tipoClientesService.getTipos().subscribe((resp) => {
      console.log(resp);
      this.tipoClientes = resp;
    });
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.cliente.CLI_CODIGO) {
      this.clientesService
        .putCliente(this.cliente.CLI_CODIGO, this.cliente)
        .subscribe(
          (resp: any) => {
            console.log(resp);
            if (resp['err']) {
              Swal.fire({
                title: 'Error',
                text: resp['mensaje'],
                icon: 'error',
              });
            } else {
              Swal.fire({
                title: 'Listo',
                text: 'Actualizado exitozamente',
                icon: 'success',
              }).then((r) => {
                this.router.navigateByUrl('clientes');
              });
            }
          },
          (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al guardar la Información ',
              icon: 'error',
            });
          }
        );
    } else {
      this.clientesService.postCliente(this.cliente).subscribe(
        (resp: any) => {
          console.log(resp);
          this.cliente.CLI_CODIGO = resp.CLI_CODIGO;
          if (resp['err']) {
            Swal.fire({
              title: 'Error',
              text: resp['mensaje'],
              icon: 'error',
            });
          } else {
            Swal.fire({
              title: 'Listo',
              text: 'Realizado exitozamente',
              icon: 'success',
            }).then((r) => {
              this.router.navigateByUrl('clientes');
            });
          }
        },
        (err) => {
          console.log(err);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al guardar la Información ',
            icon: 'error',
          });
        }
      );
    }
  }

  controlBotones(id: string) {
    if (id === '3') {
      this.mostrarBtn = false;
    } else {
      this.mostrarBtn = true;
    }
  }

  buscarDatosOnLine() {
    if (!this.cliente.CLI_RUCIDE)
      Swal.fire(
        'Advertencia',
        'Ingrese un número de identificación',
        'warning'
      );

    if (
      this.cliente.CLI_RUCIDE.length !== 10 &&
      this.cliente.CLI_RUCIDE.length !== 13
    )
      Swal.fire(
        'Advertencia',
        'Cédula o RUC deben tener 10 o 13 dígitos',
        'warning'
      );

    if (this.cliente.CLI_RUCIDE.length === 10) {
      this.clientesService
        .getClienteCedula(this.cliente.CLI_RUCIDE)
        .subscribe((resp) => {
          this.procesarDatos('C', resp['result'][0]);
        });
    }

    if (this.cliente.CLI_RUCIDE.length === 13) {
      this.clientesService.getClienteSri(this.cliente.CLI_RUCIDE).subscribe(
        (resp) => {
          this.procesarDatos('R', resp);
        },
        (error) => {
          this.clientesService
            .getClienteSriAlt(this.cliente.CLI_RUCIDE)
            .subscribe((resp) => {
              this.procesarDatos('R', resp);
            });
        }
      );
    }
  }

  procesarDatos(tipo: string, datos: any) {
    if (tipo === 'C') {
      if (datos['identity']) {
        this.cliente.CLI_NOMBRE = datos['name'];
        this.cliente.CLI_NOMBREC = datos['name'];
        this.cliente.CLI_DIRECCION1 =
          datos['residence'] +
          ' ' +
          datos['streets'] +
          ' ' +
          datos['homenumber'];
      }
    }

    if (tipo === 'R') {
      if (datos['RUC:']) {
        this.cliente.CLI_NOMBRE = datos['Raz\u00f3n Social:'];
        this.cliente.CLI_NOMBREC =
          datos['Nombre Comercial:'] !== ''
            ? datos['Nombre Comercial:']
            : datos['Raz\u00f3n Social:'];
        this.cliente.CLI_ACTIVIDAD =
          datos['Actividad Econ\u00f3mica Principal'];
        this.cliente.CLI_CLASECONTRIBUYENTE = datos['Clase de Contribuyente'];
        this.cliente.CLI_TIPOCONTRIBUYENTE = datos['Tipo de Contribuyente'];
        this.cliente.CLI_FECINIACTIVIDADES = this.limpiarFecha(
          datos['Fecha de inicio de actividades']
        );
        this.cliente.CLI_FECCESACTIVIDADES = this.limpiarFecha(
          datos['Fecha de cese de actividades']
        );
        this.cliente.CLI_FECREIACTIVIDADES = this.limpiarFecha(
          datos['Fecha reinicio de actividades']
        );
        this.cliente.CLI_FECACTUALIZACION = this.limpiarFecha(
          datos['Fecha actualizaci\u00f3n']
        );
        this.cliente.CLI_CATMIPYMES = datos['Categoria Mi PYMES'];
      }
      if (datos['NUMERO_RUC']) {
        this.cliente.CLI_NOMBRE = datos['RAZON_SOCIAL'];
        this.cliente.CLI_NOMBREC =
          datos['NOMBRE_COMERCIAL'] !== ''
            ? datos['NOMBRE_COMERCIAL']
            : datos['RAZON_SOCIAL'];
        this.cliente.CLI_ACTIVIDAD = datos['ACTIVIDAD_ECONOMICA'];
      }
    }
  }

  limpiarFecha(fecha: string): string {
    const regex = /\r\n|\r|\n|\t|\s/gi;

    let f = fecha;
    f = f.replace(regex, '');
    let date = f.split('-');

    return `${date[2]}-${date[1]}-${date[0]}`;
  }
}
