import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { maxFileSize } from '../../../../environments/environment.prod';
import Swal from 'sweetalert2';
import { AgendaService } from '../../services/agenda.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfiguracionesService } from '../../../configuraciones/services/configuraciones.service';
import { ImgModaldialog } from '../../../clientes/pages/documentos-cliente/documentos-cliente.component';

@Component({
  selector: 'app-documentos-modal',
  templateUrl: './documentos-modal.component.html',
  styleUrls: ['./documentos-modal.component.css']
})
export class DocumentosModalComponent implements OnInit {

  nombreArchivo = '';
  current: any = null;
  archivos: any[] = [];
  idUsuario = '';
  bloquearIngresosModificaciones = false;

  constructor(
    public dialogRef: MatDialogRef<DocumentosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null,
    private agendaService: AgendaService,
    private authService: AuthService,
    private configuracionesService: ConfiguracionesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    console.log(usuario);
    this.idUsuario = usuario.USUIDENTIFICACION;
    this.obtenerArchivos();
    if (this.data.bloquearIngresos) {
      this.bloquearIngresosModificaciones = true;
    }
  }

  obtenerArchivos() {
    this.agendaService.getDocumentos(this.data.id).subscribe((resp: any) => {
      this.archivos = resp;
      console.log(this.archivos)
    });
  }

  cargaArchivo(event: any) {
    const file: File = event.target.files[0];
    if (file.size > maxFileSize) { Swal.fire('No se puede cargar el archivo', 'El archivo no debe pesar mas de 15Mb', 'warning'); return; }
    this.current = file;
  }

  agregarDocLista() {
    if (!this.nombreArchivo || this.nombreArchivo === '') { Swal.fire('No se puede cargar', 'Por favor agrege un nombre al archivo', 'warning'); return; }
    if (!this.current) { Swal.fire('No se puede cargar', 'Por favor agrege seleccione un archivo', 'warning'); return; }
    Swal.fire('Espere', 'Subiendo archivo...', 'info');
    Swal.showLoading();
    console.log(this.nombreArchivo + '.' + this.current.name.split('.').pop())
    this.current.newName = this.nombreArchivo + '.' + this.current.name.split('.').pop();
    const datos = {
      idAgenda: this.data.id,
      idUsuario: this.idUsuario
    }
    this.agendaService.upload(this.current, datos).subscribe(resp => {
      console.log(resp);
      Swal.fire('Listo', 'Archivo cargado con éxito', 'success');
      // this.obtenerImagenes();
      // this.archivos = [];
      this.nombreArchivo = '';
      this.current = null;
      // this.cargarDocumento = false;
      this.obtenerArchivos();
    }, err => {
      Swal.fire('Error', 'Ocurrió un inconveniente', 'error');
    });
  }

  async eliminar(id: number, pos: number) {

    const codigoAutorizacion = await this.configuracionesService.getConfig('AGENDA_COD_AUT_ELIM').toPromise();

    let eliminar = false;
    Swal.fire({
      title: 'Confirmación', html: `Desea eliminar esta tarea? <br> Por favor ingrese el código de autorización`, icon: 'warning', showDenyButton: true, confirmButtonText: `Eliminar`, denyButtonText: `No eliminar`, denyButtonColor: '#3085d6', confirmButtonColor: '#d33', input: 'password', inputPlaceholder: 'Código de autorización', inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
      preConfirm: (codigo) => {
        if (codigo == codigoAutorizacion.numero) {
          return true;
        } else {
          Swal.showValidationMessage(`Código no válido`);
        }
      }, allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {

        eliminar = true;
        if (eliminar) {
          Swal.fire({ title: 'Espere', text: 'Eliminando información', allowOutsideClick: false, icon: 'info', });
          Swal.showLoading();
          this.agendaService.deleteDocumento(id).subscribe(resp => {
            console.log(id, resp)
            this.archivos.splice(pos, 1);
            Swal.fire('Exito', 'Registro eliminado con éxito', 'success');
          });
        }

      }
    });

  }

  verDocumento(id: number) {
    Swal.fire({ title: 'Espere', text: 'Obteniendo imagen...', icon: 'info', allowOutsideClick: false });
    Swal.showLoading();
    this.agendaService.getDocumento(id).subscribe((resp: any) => {
      this.dialog.open(ImgModaldialog, {
        width: '100%',
        height: '100%',
        data: {
          img: resp.ADOC_DATOS
        }
      }).afterOpened().subscribe(r => {
        Swal.close();
      });
    });
  }

  descargarDocumento(id: number) {
    return this.agendaService.downloadDocumento(id);
  }

  onNoClick(): void {
    this.dialogRef.close({
      retorno: 'nada'
    });
  }

}
