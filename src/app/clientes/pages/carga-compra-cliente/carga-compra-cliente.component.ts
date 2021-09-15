import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImgModaldialog } from '../documentos-cliente/documentos-cliente.component';
import { ClientesService } from '../../services/clientes.service';
import { ClienteDocumentos } from '../../../models/clientesDocumentos';

@Component({
  selector: 'app-carga-compra-cliente',
  templateUrl: './carga-compra-cliente.component.html',
  styleUrls: ['./carga-compra-cliente.component.css']
})
export class CargaCompraClienteComponent implements OnInit {

  private idDocumento: string;
  imgSrc: any = '';
  registrado = false;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private clientesService: ClientesService, private router: Router) { }

  ngOnInit(): void {
    this.idDocumento = this.route.snapshot.paramMap.get('id');

    this.clientesService.getImagen(+this.idDocumento).subscribe(resp => {
      this.imgSrc = resp.DOC_DATOS;
    });
  }

  confirmarGuardado($event) {
    const data: any = $event;
    if (data.id) {
      const docu = new ClienteDocumentos();
      docu.DOC_CODIGO = +this.idDocumento;
      docu.DOC_ESTADO = 'R';
      docu.DOC_ORIGEN = 'DCL';
      docu.DOC_IDORIGEN = data.id;
      this.clientesService.putDocumento(docu).subscribe(resp => {
        if (resp.DOC_CODIGO) {
          const datosCli = {
            id: '1712660818001',
            tipo: 'P' // P = Permanente | T = Temporal
          }
          sessionStorage.setItem('idCliente', JSON.stringify(datosCli));
          this.router.navigateByUrl('clientes/documentos');
        }
      });
    }
  }

  verImagen() {
    this.dialog.open(ImgModaldialog, {
      width: '100%',
      height: '100%',
      data: {
        img: this.imgSrc
      }
    })
  }

}
