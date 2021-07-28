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

type AOA = any[][];

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css'],
})
export class ConfiguracionesComponent implements OnInit {
  configList: Configuracion[] = [];
  files: FileList | undefined;

  cargando = false;
  cargado = false;
  nombreArchivo: string | undefined;
  data: AOA = [];
  modelo: AOA = [["Nº","RUC","RAZON SOCIAL","TELEFONO","CORREO","GRUPO","TIPO","REGION","CLAVE SRI","CLAVE IESS","CLAVE MRL CONTRATOS","CLAVE MRL FORMULARIOS","CLAVE SUPERCIAS"],[]];
  usr = new Usuario();
  constructor(private configService: ConfiguracionesService, private auth: AuthService, private clientesService: ClientesService) { }

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

  cargarExcel() {
    console.log('cargando archivo....');
    if (!this.files) { Swal.fire('No hay archivo', 'Seleccione un archivo excel antes de continuar', 'warning'); return; }
    const currentFile = this.files!.item(0);
    console.log(currentFile);

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log(this.data);
      let f = 0;
      for (const cliente of this.data) {
        if (f !== 0) {
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

          c.CLI_DIGITO = c.CLI_CODIGO.slice(8, 9);
          c.CLI_VENCE = +this.calcularVence(c.CLI_DIGITO);
          // console.log(fila, c);
          this.clientesService.postCliente(c).subscribe(r => {
            // console.log(r);
          });
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
    XLSX.writeFile(wb, 'NombreArchivo.xlsx');
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

}
