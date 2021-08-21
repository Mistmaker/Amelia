import { Component, Inject, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { ClienteDocumentos } from '../../../models/clientesDocumentos';
import { MatDialog } from '@angular/material/dialog';
import { BuscarClientesComponent } from '../../../shared/components/buscar-clientes/buscar-clientes.component';
import { Cliente } from '../../../models/clientes.model';
import { maxFileSize } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-documentos-cliente',
  templateUrl: './documentos-cliente.component.html',
  styleUrls: ['./documentos-cliente.component.css']
})
export class DocumentosClienteComponent implements OnInit {
  cargando = false;
  cargarDocumento = false;
  documentos: ClienteDocumentos[] = [];
  clienteSeleccionado = new Cliente();
  nombreCliente = '';
  nombreArchivo = '';
  valorTotal: number;
  // Para paginación
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [3, 6, 9, 12];

  current: any = null;
  archivos: any[] = [];

  constructor(private clientesService: ClientesService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  abrirModal() {
    const dialogRef = this.dialog.open(BuscarClientesComponent, {
      width: '100%',
      height: '100%',
      data: {
        name: this.clienteSeleccionado,
      },
    });

    dialogRef.afterClosed().subscribe((result: Cliente) => {
      if (result) {
        this.clienteSeleccionado = result;
        console.log(this.clienteSeleccionado);
        this.nombreCliente = this.clienteSeleccionado.CLI_NOMBRE;
        // Cargando imagenes
        this.obtenerImagenes();
      }
    });
  }

  agregarDocumento() {
    this.cargarDocumento = true;
  }

  cargaArchivo(event: any) {
    const file: File = event.target.files[0];
    console.log(file);
    console.log(this.archivos.length, this.documentos.length);
    if ((this.archivos.length + this.documentos.length) > 9) { Swal.fire('Excedido límite máximo de archivos', 'Solo se permiten 10 archivos', 'warning'); event.target.value = null; return; }
    if (file.size > maxFileSize) { Swal.fire('No se puede cargar el archivo', 'El archivo no debe pesar mas de 15Mb', 'warning'); return; }
    this.current = file;
  }

  agregarDocLista() {
    console.log(this.nombreArchivo);
    if (!this.nombreArchivo || this.nombreArchivo === '') { Swal.fire('No se puede cargar', 'Por favor agrege un nombre al archivo', 'warning'); return; }
    if (!this.valorTotal || this.valorTotal <= 0) { Swal.fire('No se puede cargar', 'Por favor ingrese un valor total correcto', 'warning'); return; }
    if (!this.current) { Swal.fire('No se puede cargar', 'Por favor agrege seleccione una imagen', 'warning'); return; }
    Swal.fire('Espere', 'Subiendo imagen...', 'info');
    Swal.showLoading();
    this.current.newName = this.nombreArchivo + '.' + this.current.name.split('.').pop();
    this.archivos.push(this.current);
    this.clientesService.upload2(this.archivos, this.clienteSeleccionado, this.valorTotal, 'P', 'i').subscribe(resp => {
      Swal.fire('Listo', 'Imagen cargada con éxito', 'success');
      console.log(resp);
      this.obtenerImagenes();
      this.archivos = [];
      this.nombreArchivo = '';
      this.valorTotal = null;
      this.current = null;
      this.cargarDocumento = false;
    }, err => {
      Swal.fire('Error', 'Ocurrió un inconveniente', 'error');
    });
    // console.log(this.current);
    // this.cargarDocumento = false;
  }

  obtenerImagenes() {
    this.cargando = true;
    this.clientesService.getImagenes(this.clienteSeleccionado.CLI_CODIGO).subscribe(resp => {
      console.log(resp);
      this.documentos = resp;
      this.cargando = false;
    }, err => {
      this.cargando = false;
    });
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
                this.documentos.splice(index, 1);
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

  verDocumento(doc: ClienteDocumentos) {
    // console.log(doc.DOC_DATOS);
    Swal.fire({ title: 'Espere', text: 'Obteniendo imagen...', icon: 'info', allowOutsideClick: false});
    Swal.showLoading();
    this.clientesService.getImagen(doc.DOC_CODIGO).subscribe(resp => {
      console.log('img from server', resp.DOC_DATOS);
      this.dialog.open(ImgModaldialog, {
        width: '100%',
        height: '100%',
        data: {
          img: resp.DOC_DATOS
        }
      }).afterOpened().subscribe(r => {
        Swal.close();
      });
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

}


@Component({
  selector: 'img-modal',
  templateUrl: 'img-modal.html',
})
export class ImgModaldialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}