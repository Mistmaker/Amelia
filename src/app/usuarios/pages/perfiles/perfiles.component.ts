import { Component, OnInit } from '@angular/core';
import { UsuarioPerfil } from '../../../models/usuarioPerfil.model';
import { PerfilesService } from '../../services/perfiles.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  perfiles: UsuarioPerfil[] = [];
  textoBusqueda = '';
  cargando = false;

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private perfilesService: PerfilesService) { }

  ngOnInit(): void {
    this.perfilesService.getPerfiles().subscribe(resp=>{
      console.log(resp)
      this.perfiles = resp;
    })
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

}
