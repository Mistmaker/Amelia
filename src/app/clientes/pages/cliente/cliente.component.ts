import { Ciudad } from './../../../models/ciudades.models';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { formatDate } from '@angular/common';

import Swal from 'sweetalert2';

import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../../models/clientes.model';
import { TipoClientesService } from '../../services/tipo-clientes.service';
import { TipoCliente } from '../../../models/tipoClientes';
import { CiudadesService } from '../../services/ciudades.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  cliente = new Cliente();
  tipoClientes: TipoCliente[] = [];
  cities: Ciudad[] = [];
  mostrarBtn: boolean = false;
  routeStr: string;
  coordinateX: string = '0';
  coordinateY: string = '0';

  constructor(
    private route: ActivatedRoute,
    private clientesService: ClientesService,
    private tipoClientesService: TipoClientesService,
    private citiesService: CiudadesService
  ) {}

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      console.log(this.routeStr);
      this.clientesService.getCliente(this.routeStr).subscribe((resp) => {
        this.cliente = resp;
        console.log(resp);
        this.cliente.CLI_ESTADO = resp.CLI_ESTADO || '1';
        this.getCoordinates();
      });
    }
    this.tipoClientesService.getTipos().subscribe((resp) => {
      console.log(resp);
      this.tipoClientes = resp;
    });

    this.citiesService.getAllCiudades().subscribe((resp) => {
      this.cities = resp;
    });
  }

  getCoordinates() {
    let coordinates = this.cliente.CLI_GMAPS.split(',');
    this.coordinateX = coordinates[0].replace(',', '').replace(' ', '');
    this.coordinateY = coordinates[1].replace(',', '').replace(' ', '');
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log('guardar', this.cliente);

    // merge coordinates
    this.cliente.CLI_GMAPS = this.coordinateX + ',' + this.coordinateY;

    if (this.routeStr !== 'nuevo') {
      this.clientesService
        .putCliente(this.cliente.CLI_CODIGO, this.cliente)
        .subscribe(
          (res: any) => {
            console.log('response post', res);
            Swal.fire(
              'Advertencia',
              'Se actualizo el cliente con éxito',
              'success'
            );
          },
          (err) => {
            console.log('error post', err);
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.clientesService.postCliente(this.cliente).subscribe(
        (res: any) => {
          console.log('response put', res);
          Swal.fire('Advertencia', 'Se creo el cliente con éxito', 'success');
        },
        (err) => {
          console.log('error put', err);
          Swal.fire('Error', err.error.msg, 'error');
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
    if (!this.cliente.CLI_CODIGO)
      Swal.fire(
        'Advertencia',
        'Ingrese un número de identificación',
        'warning'
      );

    if (
      this.cliente.CLI_CODIGO.length !== 10 &&
      this.cliente.CLI_CODIGO.length !== 13
    )
      Swal.fire(
        'Advertencia',
        'Cédula o RUC deben tener 10 o 13 dígitos',
        'warning'
      );

    if (this.cliente.CLI_CODIGO.length === 10) {
      this.clientesService
        .getClienteCedula(this.cliente.CLI_CODIGO)
        .subscribe((resp) => {
          this.procesarDatos('C', resp['result'][0]);
        });
    }

    if (this.cliente.CLI_CODIGO.length === 13) {
      this.clientesService.getClienteSri(this.cliente.CLI_CODIGO).subscribe(
        (resp) => {
          this.procesarDatos('R', resp);
        },
        (error) => {
          this.clientesService
            .getClienteSriAlt(this.cliente.CLI_CODIGO)
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
