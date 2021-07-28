import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';

import { Cliente, CuentasContablesClientes } from '../../../models/clientes.model';
import { ClientesService } from '../../services/clientes.service';
import { TipoCliente } from '../../../models/tipoClientes';
import { TipoClientesService } from '../../services/tipo-clientes.service';
import { Ciudad } from './../../../models/ciudades.models';
import { CiudadesService } from './../../../configuraciones/services/ciudades.service';
import { Vendedores } from './../../../models/vendedores';
import { VendedoresService } from './../../../vendedores/services/vendedores.service';
import { CuentaContable } from './../../../models/cuentasContables';
import { CuentaContableService } from '../../services/cuentas-contables.service';
import { ConfiguracionesService } from './../../../configuraciones/services/configuraciones.service';
import { ClienteDatosAdicionales } from 'src/app/models/clientesDatosAdicionales.model';
import { Usuario } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { GrupoClientesService } from '../../services/grupo-clientes.service';
import { GrupoCliente } from '../../../models/grupoClientes';
import { CuentasContablesComponent } from './../../../shared/components/cuentas-contables/cuentas-contables.component';
import { TiposClientesService } from '../../services/tipos-clientes.service';
import { TiposClientes } from '../../../models/tiposClientes';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent implements OnInit {

  cliente = new Cliente();
  tipoClientes: TipoCliente[] = [];
  provinciaCodigo: string = '';
  cantonCodigo: string = '';
  provincias: Ciudad[] = [];
  cantones: Ciudad[] = [];
  vendedores: Vendedores[] = [];
  showMore: boolean;
  mostrarBtn: boolean = false;

  routeStr: string;
  coordinateX: string = '0';
  coordinateY: string = '0';
  showDeleteButton: boolean = false;
  tab = 'DP';
  usuarios: Usuario[] = [];
  grupos: GrupoCliente[] = [];
  tiposClientes: TiposClientes[] = [];
  mostrarInfoCompl = false;
  // cuentas contables clientes
  cuentasCliente = new CuentasContablesClientes();

  constructor(
    private route: ActivatedRoute,
    private clientesService: ClientesService,
    private tipoClientesService: TipoClientesService,
    private citiesService: CiudadesService,
    private vendedoresService: VendedoresService,
    private cuentaContableService: CuentaContableService,
    private configService: ConfiguracionesService,
    private router: Router,
    private usuariosService: UsuariosService,
    private grupoClientesService: GrupoClientesService,
    private dialog: MatDialog,
    private tiposClientesService: TiposClientesService,
    @Inject(MAT_DIALOG_DATA) public data: Cliente
  ) { }

  ngOnInit(): void {

    this.routeStr = this.data.CLI_CODIGO;
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.clientesService.getCliente(this.routeStr).subscribe((resp) => {
        this.cliente = resp;
        this.cliente.CLI_FECHACONSULTA = this.cliente.CLI_FECHACONSULTA ? this.cliente.CLI_FECHACONSULTA.slice(0, 10) : null;
        this.cliente.CLI_FECHACREADO = this.cliente.CLI_FECHACREADO ? this.cliente.CLI_FECHACREADO.slice(0, 10) : null;
        if (!this.cliente.datosAdicionales) this.cliente.datosAdicionales = [];
        this.showDeleteButton = true;
        this.cliente.CLI_ESTADO = resp.CLI_ESTADO || '1';
        this.cliente.CLI_MICROEMPRESA = resp.CLI_MICROEMPRESA || '';
        this.cliente.CLI_CONTRIESPECIAL = resp.CLI_CONTRIESPECIAL || '';
        this.cliente.CLI_EMPRESAFANTAS = resp.CLI_EMPRESAFANTAS || '';
        this.cliente.CLI_AGENRETENCION = resp.CLI_AGENRETENCION || '';
        this.getCoordinates();
        this.getCiudad();

        const datosBusqueda = {
          CLI_CODIGO: this.cliente.CLI_CODIGO,
          COM_CODIGO: this.cliente.COM_CODIGO,
        }
        this.clientesService.getDatosAdicionales(datosBusqueda).subscribe((resp: any) => {
          this.cliente.datosAdicionales = resp;
        });
        this.getAllCuentasContables();
      });
    }
    // default values
    this.cliente.CLI_PARTEREL = this.cliente.CLI_PARTEREL || 'n';
    this.cliente.CLI_MICROEMPRESA = this.cliente.CLI_MICROEMPRESA || 'NO';
    this.cliente.CLI_CONTRIESPECIAL = this.cliente.CLI_CONTRIESPECIAL || 'NO';
    this.cliente.CLI_EMPRESAFANTAS = this.cliente.CLI_EMPRESAFANTAS || 'NO';
    this.cliente.CLI_AGENRETENCION = this.cliente.CLI_AGENRETENCION || 'NO';

    this.tipoClientesService.getTipos().subscribe((resp) => {
      this.tipoClientes = resp;
    });
    // get all provincias
    this.citiesService.getAllProvincias().subscribe((resp) => {
      this.provincias = resp;
    });
    // get all vendedores
    this.vendedoresService.getAllVendedores().subscribe((resp) => {
      this.vendedores = resp;
    });
    // get config
    this.configService.getConfigClientes().subscribe((resp) => {
      this.showMore = resp.codigo === 1 ? true : false;
    });

    this.usuariosService.getUsuarios().subscribe(resp => {
      this.usuarios = resp;
    });

    this.grupoClientesService.getGrupos().subscribe(resp => {
      this.grupos = resp;
    });

    this.tiposClientesService.getTipos().subscribe(resp => {
      this.tiposClientes = resp;
    });

    this.configService.getConfig('CLI_INFO_COMP').subscribe(resp => {
      this.mostrarInfoCompl = resp.codigo === 1 ? true : false;
    });

  }

  getAllCuentasContables(): void {
    // CON_CODIGO1
    this.cuentaContableService
      .getCuenta(this.cliente.CON_CODIGO1)
      .subscribe((res) => {
        this.cuentasCliente.CON_CODIGO1 =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // CON_CODIGO2
    this.cuentaContableService
      .getCuenta(this.cliente.CON_CODIGO2)
      .subscribe((res) => {
        this.cuentasCliente.CON_CODIGO2 =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // CLI_BASEIVA
    this.cuentaContableService
      .getCuenta(this.cliente.CLI_BASEIVA)
      .subscribe((res) => {
        this.cuentasCliente.CLI_BASEIVA =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // CLI_BASECERO
    this.cuentaContableService
      .getCuenta(this.cliente.CLI_BASECERO)
      .subscribe((res) => {
        this.cuentasCliente.CLI_BASECERO =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });

    // CLI_BASENOBJET
    this.cuentaContableService
      .getCuenta(this.cliente.CLI_BASENOBJET)
      .subscribe((res) => {
        this.cuentasCliente.CLI_BASENOBJET =
          res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
      });
  }

  getCiudad() {
    if (this.cliente.CLI_CIUDAD) {
      const data = this.cliente.CLI_CIUDAD.split('.');
      this.provinciaCodigo = data[0];
      this.getAllCantones(this.provinciaCodigo);
      this.cantonCodigo = this.cliente.CLI_CIUDAD;
    }
  }

  getAllCantones(id: string) {
    // get all cantones
    this.citiesService.getAllCantonesByProvincia(id).subscribe((resp) => {
      this.cantones = resp;
    });
  }

  getCoordinates() {
    let coordinates = this.cliente.CLI_GMAPS.split(',');
    this.coordinateX = coordinates[0].replace(',', '').replace(' ', '');
    this.coordinateY = coordinates[1].replace(',', '').replace(' ', '');
  }

}
