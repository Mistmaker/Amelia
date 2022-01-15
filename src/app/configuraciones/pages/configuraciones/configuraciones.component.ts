import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';

import { Configuracion } from './../../../models/configuracion';
import { ConfiguracionesService } from './../../services/configuraciones.service';
import { Cliente } from '../../../models/clientes.model';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../models/usuarios.model';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { UtilidadesService } from '../../../shared/services/utilidades.service';
import { AgendaService } from '../../../agenda/services/agenda.service';

type AOA = any[][];

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css'],
})
export class ConfiguracionesComponent implements OnInit {
  configList: Configuracion[] = [];
  files: FileList | undefined;
  tab = 'GE';
  cargando = false;
  cargado = false;
  nombreArchivo: string | undefined;
  data: AOA = [];
  modelo: AOA = [["Nº", "RUC", "RAZON SOCIAL", "TELEFONO", "CORREO", "GRUPO", "TIPO", "REGION", "CLAVE SRI", "CLAVE IESS", "CLAVE MRL CONTRATOS", "CLAVE MRL FORMULARIOS", "CLAVE SUPERCIAS"], []];
  usr = new Usuario();
  constructor(private configService: ConfiguracionesService, private auth: AuthService, private clientesService: ClientesService, private utilidadesService: UtilidadesService, private agendaService: AgendaService) { }

  ngOnInit(): void {
    this.configService.getAllConfigs().subscribe((resp) => {
      this.configList = resp;
    });
    this.usr = JSON.parse(this.auth.getUsrFromLocalStorage());
  }

  toggleStatus(pos: number) {
    let codigo = this.configList[pos].codigo;
    this.configList[pos].codigo = codigo === 1 ? 0 : 1;
  }

  save(form: NgForm) {

    this.configService.postAllConfigs(this.configList).subscribe(
      (resp) => {
        Swal.fire('Éxito', 'Se actualizaron las configuraciones del sistema', 'success');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  cargaArchivo(event: any) {
    this.files = event.target.files;
  }

  async cargarExcel() {
    if (!this.files) { Swal.fire('No hay archivo', 'Seleccione un archivo excel antes de continuar', 'warning'); return; }
    const currentFile = this.files!.item(0);

    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let f = 0;
      for (const cliente of this.data) {
        console.log(cliente)
        if (f !== 0) {
          try {
            const c = new Cliente();
            const fila = cliente[0];
            c.CLI_TIPOIDE = cliente[1].length === 13 ? '1' : '2';
            c.CLI_CODIGO = cliente[1];
            c.CLI_NOMBRE = cliente[2];
            c.CLI_NOMBREC = cliente[2];
            c.CLI_TELEFONO1 = cliente[3] ? cliente[3] : '';
            c.CLI_CORREO = cliente[4] ? cliente[4] : '';
            c.VEN_CODIGO = this.usr.VEN_CODIGO;
            c.USUARIO = this.usr.USUIDENTIFICACION
            c.GRU_CODIGO = cliente[5];
            c.CLI_TIPOCLIENTE = cliente[6];
            c.CLI_REGION = cliente[7] ? cliente[7] : 'C';
            c.CLI_CLAVESRI = cliente[8] ? cliente[8] : '';
            c.CLI_CLAVEIESSEMPLEADOR = cliente[9] ? cliente[9] : '';
            c.CLI_CLAVEMRLCONTRATOS = cliente[10] ? cliente[10] : '';
            c.CLI_CLAVEMRLFORMULARIOS = cliente[11] ? cliente[11] : '';
            c.CLI_CLAVESUPER = cliente[12] ? cliente[12] : '';

            c.CLI_DIGITO = c.CLI_CODIGO.toString().slice(8, 9);
            c.CLI_VENCE = +this.calcularVence(c.CLI_DIGITO);


            // this.clientesService.postCliente(c).subscribe(r => {
            //   console.log(r);
            // });
            const resp = await this.clientesService.postCliente(c).toPromise();
            console.log(resp)
          } catch (error) {
            console.warn(error);
          }

        }
        f += 1;
      }

    };
    reader.readAsBinaryString(currentFile);
    Swal.fire('Exito', 'Datos cargados correctamente', 'success');
  }

  exportarExcel(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.modelo);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'DatosClientes.xlsx');
  }

  actualizarDatosCatastrosClientes() {
    let nombreCliente = '';
    let clientes: Cliente[] = [];
    let i =0;
    Swal.fire({ title: 'Espere', text: 'Actualizando información' + nombreCliente, allowOutsideClick: false, icon: 'info', });
    Swal.showLoading();
    this.clientesService.getClientes().subscribe(async resp => {
      clientes = resp;
      if (clientes.length === 0) { Swal.fire('No se encontraron clientes', 'Registre clientes antes de utilizar esta opción', 'warning'); return; }
      for (const cliente of clientes) {
        nombreCliente = cliente.CLI_NOMBRE;
        i++;
        Swal.update({ title: 'Espere', html: `Actualizando información <br> ${nombreCliente}`, allowOutsideClick: false, icon: 'info', });
        Swal.showLoading();

        try {
          const isAr = await this.clientesService.getIsAgenteRentencion(cliente.CLI_CODIGO).toPromise();
          const isCe = await this.clientesService.getIsContribuyenteEspecial(cliente.CLI_CODIGO).toPromise();
          const isEf = await this.clientesService.getIsEmpresaFantasma(cliente.CLI_CODIGO).toPromise();
          // const isMi = await this.clientesService.getIsMicro(cliente.CLI_CODIGO).toPromise();
          const isRi = await this.clientesService.getIsRegimenRimpe(cliente.CLI_CODIGO).toPromise();
          const sriData = await this.clientesService.getClienteSri(cliente.CLI_CODIGO).toPromise();
          if (isAr["agentes"]) { cliente.CLI_AGENRETENCION = isAr["agentes"]; }
          if (isCe["especiales"]) { cliente.CLI_CONTRIESPECIAL = isCe["especiales"]; }
          if (isEf["fantasma"]) { cliente.CLI_EMPRESAFANTAS = isEf["fantasma"]; }

          console.log(i, nombreCliente, isRi);
          if (isRi["regimen"]) {
            cliente.CLI_MICROEMPRESA = `${isRi["regimen"]} Negocio Popular: ${isRi["negociopopular"]} - ${isRi["fecha"]}`;
          }else {
            cliente.CLI_MICROEMPRESA = `Régimen General`;
          }

          if (sriData["Actividad Económica Principal"]) { cliente.CLI_ACTIVIDAD = sriData["Actividad Económica Principal"]; cliente.CLI_NOMBREC = sriData["Nombre Comercial"]; }
          if (sriData["Nombre Comercial:"]) { cliente.CLI_NOMBREC = sriData["Nombre Comercial:"]; }
          if (isAr["agentes"] || isCe["especiales"] || isEf["fantasma"] || isRi) { cliente.CLI_FECHACONSULTA = this.utilidadesService.getFechaActual(); }
          if (!cliente.datosAdicionales) {
            const datosBusqueda = {
              CLI_CODIGO: cliente.CLI_CODIGO,
              COM_CODIGO: cliente.COM_CODIGO,
            }
            const datosAdi: any = await this.clientesService.getDatosAdicionales(datosBusqueda).toPromise();
            cliente.datosAdicionales = datosAdi;
          }
          const resp = await this.clientesService.putCliente(cliente.CLI_CODIGO, cliente).toPromise();
        } catch (error) {
          console.log(error);
        }

      }
      Swal.fire({ title: 'Listo', text: 'Realizado exitozamente', icon: 'success', });
    });
  }

  calcularVence(digito: string) {
    let vence = '';
    switch (digito) {
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
    return vence;
  }

  fechaActual() {
    let date = new Date();
    let dia: string, mes: string, anio: number;
    dia = date.getDate().toString().length < 2 ? `0${date.getDate().toString()}` : date.getDate().toString();
    mes = date.getMonth().toString().length < 2 ? `0${date.getMonth().toString()}` : date.getMonth().toString();
    anio = date.getFullYear();
    return `${anio}-${mes}-${dia}`;
  }


  // Por motivos de trabajo interno
  // Quitar o mejorar mas adelante

  crearAgenda() {

    let clientes: Cliente[] = [];
    Swal.fire({ title: 'Espere', text: 'Generando tareas...', icon: 'info', allowOutsideClick: false });
    Swal.showLoading();

    this.clientesService.getClientes().subscribe(async resp => {
      clientes = resp;
      if (clientes.length === 0) { Swal.fire('No se encontraron clientes', 'Registre clientes antes de utilizar esta opción', 'warning'); return; }
      for (const cliente of clientes) {

        const datos = { id: cliente.CLI_CODIGO, periodo: 2021, fecha: '2021-09-01' };

        setTimeout(() => {
          this.agendaService.generarAgenda(datos).subscribe(resp => {
          });
        }, 2000);

      }
      Swal.fire('Éxito', 'Tareas generadas con éxito', 'success');
    });


  }

}
