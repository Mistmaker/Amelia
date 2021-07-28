import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
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
import { ClienteDocumentos } from '../../../models/clientesDocumentos';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
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
  cargarDocumento = false;
  documentoCliente = new ClienteDocumentos();
  files: FileList | undefined;

  cargando = false;
  cargado = false;
  nombreArchivo: string | undefined;
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
    private tiposClientesService: TiposClientesService
  ) { }

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      console.log(this.routeStr);
      this.clientesService.getCliente(this.routeStr).subscribe((resp) => {
        this.cliente = resp;
        this.cliente.CLI_FECHACONSULTA = this.cliente.CLI_FECHACONSULTA ? this.cliente.CLI_FECHACONSULTA.slice(0, 10) : null;
        this.cliente.CLI_FECHACREADO = this.cliente.CLI_FECHACREADO ? this.cliente.CLI_FECHACREADO.slice(0, 10) : null;
        if (!this.cliente.datosAdicionales) this.cliente.datosAdicionales = [];
        this.showDeleteButton = true;
        console.log(this.cliente);
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
          console.log(resp);
          this.cliente.datosAdicionales = resp;
        });
        this.getAllCuentasContables();
      });

      this.clientesService.getDocumentos(this.routeStr).subscribe(resp => {
        console.log(resp);
        this.cliente.documentos = resp;
      });
    } else {
      this.mostrarBtn = true;
    }
    // default values
    this.cliente.CLI_PARTEREL = this.cliente.CLI_PARTEREL || 'n';
    this.cliente.CLI_MICROEMPRESA = this.cliente.CLI_MICROEMPRESA || 'NO';
    this.cliente.CLI_CONTRIESPECIAL = this.cliente.CLI_CONTRIESPECIAL || 'NO';
    this.cliente.CLI_EMPRESAFANTAS = this.cliente.CLI_EMPRESAFANTAS || 'NO';
    this.cliente.CLI_AGENRETENCION = this.cliente.CLI_AGENRETENCION || 'NO';

    this.tipoClientesService.getTipos().subscribe((resp) => {
      console.log(resp);
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
      console.log('config', resp);
      this.showMore = resp.codigo === 1 ? true : false;
    });

    this.usuariosService.getUsuarios().subscribe(resp => {
      console.log(resp);
      this.usuarios = resp;
    });

    this.grupoClientesService.getGrupos().subscribe(resp => {
      console.log(resp);
      this.grupos = resp;
    });

    this.tiposClientesService.getTipos().subscribe(resp => {
      console.log(resp);
      this.tiposClientes = resp;
    });

    this.configService.getConfig('CLI_INFO_COMP').subscribe(resp => {
      this.mostrarInfoCompl = resp.codigo === 1 ? true : false;
    });
  }

  openDialog(attribute: string): void {
    console.log('ATTRIBUTE', attribute);

    const dialogRef = this.dialog.open(CuentasContablesComponent, {
      panelClass: 'dialog-responsive',
      data: {
        name: this.cuentasCliente[attribute],
      },
    });

    dialogRef.afterClosed().subscribe((result: CuentaContable) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.cliente[attribute] = result.CON_CODIGO;
        this.cuentasCliente[attribute] =
          result.CON_CODIGO + ' || ' + result.CON_NOMBRE;
      }
    });
  }

  getAllCuentasContables(): void {
    // CON_CODIGO1
    this.cuentaContableService
      .getCuenta(this.cliente.CON_CODIGO1)
      .subscribe((res) => {
        if (res) {
          this.cuentasCliente.CON_CODIGO1 = res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
        }
      });

    // CON_CODIGO2
    this.cuentaContableService
      .getCuenta(this.cliente.CON_CODIGO2)
      .subscribe((res) => {
        if (res) {
          this.cuentasCliente.CON_CODIGO2 = res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
        }
      });

    // CLI_BASEIVA
    this.cuentaContableService
      .getCuenta(this.cliente.CLI_BASEIVA)
      .subscribe((res) => {
        if (res) {
          this.cuentasCliente.CLI_BASEIVA = res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
        }
      });

    // CLI_BASECERO
    this.cuentaContableService
      .getCuenta(this.cliente.CLI_BASECERO)
      .subscribe((res) => {
        if (res) {
          this.cuentasCliente.CLI_BASECERO = res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
        }
      });

    // CLI_BASENOBJET
    this.cuentaContableService
      .getCuenta(this.cliente.CLI_BASENOBJET)
      .subscribe((res) => {
        if (res) {
          this.cuentasCliente.CLI_BASENOBJET = res.CON_CODIGO + ' || ' + res.CON_NOMBRE;
        }
      });
  }

  getCiudad() {
    if (this.cliente.CLI_CIUDAD) {
      const data = this.cliente.CLI_CIUDAD.split('.');
      console.log(data);
      this.provinciaCodigo = data[0];
      this.getAllCantones(this.provinciaCodigo);
      this.cantonCodigo = this.cliente.CLI_CIUDAD;
    }
  }

  onChangeProvincia(id: string) {
    this.getAllCantones(id);
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

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log('guardar', this.cliente);

    // put null on dates containing undefined string
    if (
      this.cliente.CLI_FECINIACTIVIDADES &&
      this.cliente.CLI_FECINIACTIVIDADES.includes('undefined')
    )
      this.cliente.CLI_FECINIACTIVIDADES = null;
    if (
      this.cliente.CLI_FECCESACTIVIDADES &&
      this.cliente.CLI_FECCESACTIVIDADES.includes('undefined')
    )
      this.cliente.CLI_FECCESACTIVIDADES = null;
    if (
      this.cliente.CLI_FECREIACTIVIDADES &&
      this.cliente.CLI_FECREIACTIVIDADES.includes('undefined')
    )
      this.cliente.CLI_FECREIACTIVIDADES = null;
    if (
      this.cliente.CLI_FECACTUALIZACION &&
      this.cliente.CLI_FECACTUALIZACION.includes('undefined')
    )
      this.cliente.CLI_FECACTUALIZACION = null;

    // merge coordinates
    this.cliente.CLI_GMAPS = this.coordinateX + ',' + this.coordinateY;
    console.log('provincia', this.provinciaCodigo);
    console.log('canton', this.cantonCodigo);

    this.cliente.CLI_CIUDAD = this.cantonCodigo;
    console.log('ciudad', this.cliente.CLI_CIUDAD);

    if (this.routeStr !== 'nuevo') {
      this.clientesService
        .putCliente(this.cliente.CLI_CODIGO, this.cliente)
        .subscribe(
          (res: any) => {
            console.log('response post', res);
            Swal.fire('Éxito', 'Se actualizo el cliente con éxito', 'success');
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
          Swal.fire('Éxito', 'Se creo el cliente con éxito', 'success');
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
      return Swal.fire(
        'Advertencia',
        'Ingrese un número de identificación',
        'warning'
      );

    if (
      this.cliente.CLI_CODIGO.length !== 10 &&
      this.cliente.CLI_CODIGO.length !== 13
    )
      return Swal.fire(
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

    this.clientesService
      .getIsMicro(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.cliente.CLI_MICROEMPRESA = res.microempresa;
      });

    this.clientesService
      .getIsContribuyenteEspecial(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.cliente.CLI_CONTRIESPECIAL = res.especiales;
      });

    this.clientesService
      .getIsEmpresaFantasma(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.cliente.CLI_EMPRESAFANTAS = res.fantasma;
      });

    this.clientesService
      .getIsAgenteRentencion(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
        console.log(res);
        this.cliente.CLI_AGENRETENCION = res.agentes;
      });
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

      // this.cliente.CLI_FECHACONSULTA = new Date().toDateString();

      let date = new Date();
      let dia: string, mes: string, anio: number;

      dia = date.getDate().toString().length < 2 ? `0${date.getDate().toString()}` : date.getDate().toString();
      mes = date.getMonth().toString().length < 2 ? `0${date.getMonth().toString()}` : date.getMonth().toString();
      anio = date.getFullYear();

      this.cliente.CLI_FECHACONSULTA = `${anio}-${mes}-${dia}`;
      console.log(this.cliente.CLI_FECHACONSULTA);
    }
  }

  limpiarFecha(fecha: string): string {
    const regex = /\r\n|\r|\n|\t|\s/gi;

    let f = fecha;
    f = f.replace(regex, '');
    let date = f.split('-');

    return `${date[2]}-${date[1]}-${date[0]}`;
  }

  eliminarCliente(): void {
    let eliminar = false;
    Swal.fire({
      title: 'Confirmación',
      text: 'Desea eliminar este cliente?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `No eliminar`,
      denyButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar = true;
        if (eliminar) {
          Swal.fire({
            title: 'Espere',
            text: 'Eliminando información',
            allowOutsideClick: false,
            icon: 'info',
          });
          Swal.showLoading();

          this.clientesService.deleteCliente(this.cliente.CLI_CODIGO).subscribe(
            (resp) => {
              Swal.fire(
                'Eliminado!',
                'Se eliminó los datos del cliente',
                'success'
              ).then((r) => {
                this.router.navigateByUrl('clientes');
              });
            },
            (error) => {
              console.log(error);
              Swal.fire('Error!', 'Ocurrió un error al eliminar', 'error');
            }
          );
        }
      }
    });
  }

  agregarDatoAdicional() {
    this.cliente.datosAdicionales.push(new ClienteDatosAdicionales());
  }
  quitarDatoAdicional(index: number) {
    this.cliente.datosAdicionales.splice(index, 1);
  }

  calcularVence(event: any) {
    // console.log(event.target.value);
    // if (event.target.value.length !== 13) { this.cliente.CLI_DIGITO = null; this.cliente.CLI_VENCE = null; return; }
    const numDoc: string = event.target.value;
    this.cliente.CLI_DIGITO = numDoc.slice(8, 9);
    let vence: string;
    switch (this.cliente.CLI_DIGITO) {
      case '1':
        vence = '10';
        break;
      case '2':
        vence = '12';
        break;
      case '3':
        vence = '14';
        break;
      case '4':
        vence = '16';
        break;
      case '5':
        vence = '18';
        break;
      case '6':
        vence = '20';
        break;
      case '7':
        vence = '22';
        break;
      case '8':
        vence = '24';
        break;
      case '9':
        vence = '26';
        break;
      case '0':
        vence = '28';
        break;
      default:
        vence = '';
        break;
    }
    this.cliente.CLI_VENCE = +vence;
  }

  agregarDocumento() {
    this.cargarDocumento = true;
    this.documentoCliente = new ClienteDocumentos();
  }

  cargaArchivo(event: any) {
    this.files = event.target.files;
    this.cargando = true;
    const currentFile = this.files!.item(0);
    console.log(currentFile);
    // this.repositorioService.uploadFile2(currentFile!).subscribe((response: any) => {
    //   // this.files!.value = '';
    //   if (response instanceof HttpResponse) {
    //     // this.msg = response.body;
    //     // console.log(response.body);
    //     if (response.body.resultado === true) {
    //       // console.log('cargado con exito')
    //       this.cargando = false;
    //       this.cargado = true;
    //       this.nombreArchivo =currentFile?.name;
    //       this.archivo.LINK_ARCHIVO = `${urlWs}/documentos/${currentFile?.name}`;
    //       // console.log(this.archivo.LINK_ARCHIVO);
    //       // setTimeout(() => {
    //       //   this.cargado = false;
    //       // }, 4000);
    //     } else {
    //       Swal.fire({ title: 'Error', text: 'No se puede cargar el archivo, intente nuevamente', icon: 'error', });
    //     }
    //   }
    // });

  }

  descargarArchivo(documento: ClienteDocumentos) {
    // const ab = new ArrayBuffer(documento.DOC_DATOS.arrayBuffer.length);
    // const view = new Uint8Array(ab);
    // const file = new Blob([ab], { type: 'application/pdf' });
    // FileSaver.saveAs(file, documento.DOC_DATOS);
    console.log(documento.DOC_DATOS);
  }
}
