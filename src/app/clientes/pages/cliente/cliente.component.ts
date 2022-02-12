import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { orderBy } from 'lodash';

import { Cliente, CuentasContablesClientes, TipoJuridica } from '../../../models/clientes.model';
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
import { maxFileSize } from '../../../../environments/environment';
import { AgendaService } from '../../../agenda/services/agenda.service';
import { AgendaActividad } from '../../../models/agendaActividades.model';
import { ComentariosModalComponent } from '../../../agenda/pages/comentarios-modal/comentarios-modal.component';
import { DocumentosModalComponent } from '../../../agenda/pages/documentos-modal/documentos-modal.component';

import * as dayjs from 'dayjs'
import 'dayjs/locale/es-mx' // import locale

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {

  @ViewChild("busqueda") busqueda: ElementRef;

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
  tipoJuridica: TipoJuridica[] = [];
  mostrarInfoCompl = false;
  cargarDocumento = false;
  documentoCliente = new ClienteDocumentos();
  files: FileList | undefined;

  cargando = false;
  cargado = false;
  nombreArchivo: string;
  // cuentas contables clientes
  cuentasCliente = new CuentasContablesClientes();

  current: any = null;
  archivos: any[] = [];

  // para efectos de interfaz
  mostrarTipoJuridica = false;
  mostrarAfiliadoIess = false;
  mostrarRegimenRuc = false;
  mostrarContratarAuditoria = false;

  actividadesCliente: AgendaActividad[] = [];
  // Para paginación de actividades de clientes
  page = 1;
  count = 0;
  tableSize = 12;
  tableSizes = [3, 6, 9, 12];

  // Para ordenamiento
  orden = 'a'; // orden a= ascendente | b=descendente

  textoBusqueda = '';

  buscando = false;

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
    private agendaService: AgendaService
  ) { }

  ngOnInit(): void {
    this.routeStr = this.route.snapshot.paramMap.get('id');
    if (this.routeStr !== 'nuevo' && this.routeStr !== null) {
      this.clientesService.getCliente(this.routeStr).subscribe((resp) => {
        this.cliente = resp;
        this.cliente.CLI_FECHACONSULTA = this.cliente.CLI_FECHACONSULTA ? this.cliente.CLI_FECHACONSULTA.slice(0, 10) : null;
        this.cliente.CLI_FECHACREADO = this.cliente.CLI_FECHACREADO ? this.cliente.CLI_FECHACREADO.slice(0, 10) : null;
        if (!this.cliente.datosAdicionales) this.cliente.datosAdicionales = [];
        if (!this.cliente.documentos) this.cliente.documentos = [];
        this.showDeleteButton = true;
        this.cliente.CLI_ESTADO = resp.CLI_ESTADO || '1';
        this.cliente.CLI_MICROEMPRESA = resp.CLI_MICROEMPRESA || '';
        this.cliente.CLI_CONTRIESPECIAL = resp.CLI_CONTRIESPECIAL || '';
        this.cliente.CLI_EMPRESAFANTAS = resp.CLI_EMPRESAFANTAS || '';
        this.cliente.CLI_AGENRETENCION = resp.CLI_AGENRETENCION || '';
        this.getCoordinates();
        this.getCiudad();

        if (this.cliente.CLI_TIPOCLIENTE == 3 || this.cliente.CLI_TIPOCLIENTE == 4) {
          this.mostrarTipoJuridica = true;
          this.clientesService.getTipoJuridicaCliente(this.cliente.CLI_TIPOCLIENTE).subscribe(resp => {
            this.tipoJuridica = resp;
          });
        }

        this.cargarTipoJuridica();

        const datosBusqueda = {
          CLI_CODIGO: this.cliente.CLI_CODIGO,
          COM_CODIGO: this.cliente.COM_CODIGO,
        }
        this.clientesService.getDatosAdicionales(datosBusqueda).subscribe((resp: any) => {
          this.cliente.datosAdicionales = resp;
        });
        this.getAllCuentasContables();
        // this.clientesService.getDocumentos(this.routeStr).subscribe(resp => {
        //   this.cliente.documentos = resp;
        // });
        this.getDocumentos();
        this.getActividadesCliente();
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

  getDocumentos() {
    this.clientesService.getDocumentos(this.cliente.CLI_CODIGO).subscribe(resp => {
      this.cliente.documentos = resp;
    });
  }

  getActividadesCliente() {
    const fecha = dayjs();
    const fechafin = dayjs().endOf('month');
    console.log(fecha.format('DD/MM/YYYY'))
    console.log(fechafin.format('DD/MM/YYYY'))
    this.agendaService.getActividadesGeneradasCliente(this.cliente.CLI_CODIGO).subscribe(resp => {
      // resp = resp.filter(r => r.estado == 'FINALIZADO')
      resp = resp.filter(r => dayjs(r.vence) <= fechafin)
      resp.map(a => console.log(a.vence,  dayjs(a.vence).toDate() <= fechafin.toDate()))
      this.actividadesCliente = resp;
      this.ordenar('vence');
      this.ordenar('vence');
      console.log(this.actividadesCliente)
    });
  }

  openDialog(attribute: string): void {

    const dialogRef = this.dialog.open(CuentasContablesComponent, {
      panelClass: 'dialog-responsive',
      data: {
        name: this.cuentasCliente[attribute],
      },
    });

    dialogRef.afterClosed().subscribe((result: CuentaContable) => {
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
    if (!this.cliente.CLI_GMAPS) { return; }
    let coordinates = this.cliente.CLI_GMAPS.split(',');
    this.coordinateX = coordinates[0].replace(',', '').replace(' ', '');
    this.coordinateY = coordinates[1].replace(',', '').replace(' ', '');
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({ title: 'Espere', text: 'Guardando información', allowOutsideClick: false, icon: 'info', });
    Swal.showLoading();

    this.calcularVence();
    // put null on dates containing undefined string
    if (this.cliente.CLI_FECINIACTIVIDADES && this.cliente.CLI_FECINIACTIVIDADES.includes('undefined')) this.cliente.CLI_FECINIACTIVIDADES = null;
    if (this.cliente.CLI_FECCESACTIVIDADES && this.cliente.CLI_FECCESACTIVIDADES.includes('undefined')) this.cliente.CLI_FECCESACTIVIDADES = null;
    if (this.cliente.CLI_FECREIACTIVIDADES && this.cliente.CLI_FECREIACTIVIDADES.includes('undefined')) this.cliente.CLI_FECREIACTIVIDADES = null;
    if (this.cliente.CLI_FECACTUALIZACION && this.cliente.CLI_FECACTUALIZACION.includes('undefined')) this.cliente.CLI_FECACTUALIZACION = null;

    if (this.cliente.CLI_TIPOCLIENTE == 1 || this.cliente.CLI_TIPOCLIENTE == 2) { this.cliente.CLI_TIPOJURIDICA = null; } else { this.cliente.CLI_AFILIADOIESS = null; this.cliente.CLI_REGIMENRUC = null; }
    if (this.cliente.CLI_TIPOCLIENTE != 3) { this.cliente.CLI_CONTRATARAUDITORIASUPER = null; }

    // merge coordinates
    this.cliente.CLI_GMAPS = this.coordinateX + ',' + this.coordinateY;

    this.cliente.CLI_CIUDAD = this.cantonCodigo;

    if (this.routeStr !== 'nuevo') {
      this.clientesService
        .putCliente(this.cliente.CLI_CODIGO, this.cliente)
        .subscribe(
          async (res: any) => {
            // for (const archivo of this.archivos) {
            //   // this.subirArchivo(archivo);
            //   Swal.update({ title: 'Espere', html: `Subiendo archivo: <br> ${archivo.name}`, allowOutsideClick: false, icon: 'info', });
            //   Swal.showLoading();
            //   const r = await this.clientesService.upload(archivo, this.cliente).toPromise();
            // }
            if (this.archivos.length > 0) {
              const r = await this.clientesService.upload2(this.archivos, this.cliente).toPromise();
            }
            Swal.fire('Éxito', 'Se actualizo el cliente con éxito', 'success');
            this.archivos = [];
            this.getDocumentos();
          },
          (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      this.clientesService.postCliente(this.cliente).subscribe(
        async (res: any) => {
          // for (const archivo of this.archivos) {
          //   this.subirArchivo(archivo);
          // }
          if (this.archivos.length > 0) {
            const r = await this.clientesService.upload2(this.archivos, this.cliente).toPromise();
          }
          Swal.fire('Éxito', 'Se creo el cliente con éxito', 'success');
          this.archivos = [];
          this.getDocumentos();
        },
        (err) => {
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

    this.buscando = true;
    if (this.cliente.CLI_CODIGO.length === 10) {
      this.clientesService
        .getClienteCedula(this.cliente.CLI_CODIGO)
        .subscribe((resp) => {
          this.procesarDatos('C', resp['result'][0]);
          this.buscando = false;
        });
    }

    if (this.cliente.CLI_CODIGO.length === 13) {
      this.clientesService.getClienteSri(this.cliente.CLI_CODIGO).subscribe(
        (resp) => {
          this.procesarDatos('R', resp);
          this.buscando = false;
        },
        (error) => {
          this.clientesService
            .getClienteSriAlt(this.cliente.CLI_CODIGO)
            .subscribe((resp) => {
              this.procesarDatos('R', resp);
              this.buscando = false;
            });
        }
      );
    }

    // this.clientesService
    //   .getIsMicro(this.cliente.CLI_CODIGO)
    //   .subscribe((res: any) => {
    //     this.cliente.CLI_MICROEMPRESA = res.microempresa;
    //   });

    this.clientesService
      .getIsRegimenRimpe(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
        if (res) {
          this.cliente.CLI_MICROEMPRESA = `Régimen ${res["regimen"]} Negocio Popular: ${res["negociopopular"]} - ${res["fecha"]}`;
        } else {
          this.cliente.CLI_MICROEMPRESA = `Régimen General`;
        }
      });

    this.clientesService
      .getIsContribuyenteEspecial(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
        this.cliente.CLI_CONTRIESPECIAL = res.especiales;
      });

    this.clientesService
      .getIsEmpresaFantasma(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
        this.cliente.CLI_EMPRESAFANTAS = res.fantasma;
      });

    this.clientesService
      .getIsAgenteRentencion(this.cliente.CLI_CODIGO)
      .subscribe((res: any) => {
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
      mes = (date.getMonth() + 1).toString();
      mes = mes.length < 2 ? `0${mes}` : mes;
      anio = date.getFullYear();

      this.cliente.CLI_FECHACONSULTA = `${anio}-${mes}-${dia}`;
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
  quitarArchivo(index: number) {
    this.archivos.splice(index, 1);
  }

  calcularVence() {
    // if (event.target.value.length !== 13) { this.cliente.CLI_DIGITO = null; this.cliente.CLI_VENCE = null; return; }
    const numDoc: string = this.cliente.CLI_CODIGO;
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
    // this.documentoCliente = new ClienteDocumentos();
  }

  agregarDocLista() {
    if (!this.nombreArchivo || this.nombreArchivo === '') { Swal.fire('No se puede cargar', 'Por favor agrege un nombre al archivo', 'warning'); return; }
    // this.current = file;
    // this.createFile(null,null);
    this.current.newName = this.nombreArchivo + '.' + this.current.name.split('.').pop();
    this.archivos.push(this.current);
    // event.target.value = null;
    this.cargarDocumento = false;
  }

  // createFile(bits, name) {
  //   try {
  //     // const myRenamedFile = new File([this.current.data], "my-file-final-1-really.txt");
  //     this.current = new File([this.current], "my-file-final-1-really.txt");
  //   } catch (e) {

  //   }
  // }

  cargaArchivo(event: any) {
    const file: File = event.target.files[0];
    // TODO: CAMBIAR POR PARAMETRO EN BASE DE DATOS [CONFIGURACION GLOBAL]
    // if ((this.archivos.length + this.cliente.documentos.length) > 9) { Swal.fire('Excedido límite máximo de archivos', 'Solo se permiten 10 archivos', 'warning'); event.target.value = null; return; }

    if (file.size > maxFileSize) { Swal.fire('No se puede cargar el archivo', 'El archivo no debe pesar mas de 15Mb', 'warning'); return; }
    this.current = file;
    // this.archivos.push(this.current);
    // event.target.value = null;
    // this.cargarDocumento = false;
  }

  subirDocumento() {
    this.clientesService.upload(this.current, this.cliente).subscribe(
      (resp: any) => {
        console.log(resp);
      },
      (err) => console.log(err)
    );
  }

  subirArchivo(arch: any) {
    this.clientesService.upload(arch, this.cliente).subscribe(
      (resp: any) => {
        console.log(resp);
      },
      (err) => console.log(err)
    );
  }

  eliminarDocumento(index: number, idDocumento: string) {
    let eliminar = false;
    Swal.fire({ title: 'Confirmación', text: 'Desea eliminar este archivo?', icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', }).then((result) => {
      if (result.isConfirmed) {
        eliminar = true;
        if (eliminar) {
          Swal.fire({ title: 'Espere', text: 'Eliminando información', allowOutsideClick: false, icon: 'info', });
          Swal.showLoading();

          this.clientesService.deleteDocumento(idDocumento).subscribe(
            (resp) => {
              Swal.fire('Eliminado!', 'Se eliminó el archivo de los registros', 'success').then((r) => {
                // this.router.navigateByUrl('clientes');
                this.cliente.documentos.splice(index, 1);
              });
            },
            (error) => {
              Swal.fire('Error!', 'Ocurrió un error al eliminar', 'error');
            }
          );
        }
      }
    });
  }

  descargarArchivo(documento: ClienteDocumentos) {
    return this.clientesService.downloadUrl(documento);
  }

  cargarTipoJuridica() {
    if (this.cliente.CLI_TIPOCLIENTE == 1 || this.cliente.CLI_TIPOCLIENTE == 2) {
      this.cliente.CLI_TIPOJURIDICA = null;
      this.mostrarTipoJuridica = false;
      this.mostrarAfiliadoIess = true;
      this.mostrarRegimenRuc = true;
      return;
    }
    if (this.cliente.CLI_TIPOCLIENTE == 3) {
      this.mostrarContratarAuditoria = true;
    } else {
      this.mostrarContratarAuditoria = false;
    }
    this.mostrarTipoJuridica = true;
    this.mostrarAfiliadoIess = false;
    this.mostrarRegimenRuc = false;
    this.clientesService.getTipoJuridicaCliente(this.cliente.CLI_TIPOCLIENTE).subscribe(resp => {
      this.tipoJuridica = resp;
    });
  }

  verComentarios(actividad: AgendaActividad) {
    const dialogRef = this.dialog.open(ComentariosModalComponent, {
      width: '100%',
      height: '100%',
      data: {
        id: actividad.id,
        estado: actividad.estado,
        bloquearComentarios: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        actividad.comentarios = result.comentarios;
      } else {
      }
    });
  }

  verDocumentos(actividad: AgendaActividad) {
    const dialogRef = this.dialog.open(DocumentosModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        id: actividad.id,
        estado: actividad.estado,
        bloquearIngresos: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // actividad.comentarios = result.comentarios;
      } else {
      }
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    // this.fetchPosts();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // this.fetchPosts();
  }

  ordenar(col: string) {
    this.actividadesCliente = orderBy(this.actividadesCliente, [col], [this.orden == 'a' ? 'asc' : 'desc']);
    this.orden = this.orden == 'a' ? 'd' : 'a';
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.page = 1;
    setTimeout(() => { this.busqueda.nativeElement.focus(); }, 0);
  }

}
