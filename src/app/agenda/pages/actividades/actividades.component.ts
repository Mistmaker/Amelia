import { Component, OnInit } from '@angular/core';
import { ActividadesService } from '../../services/actividades.service';
import { AgendaService } from '../../services/agenda.service';
import { Actividades } from '../../../models/actividades.model';
import { Entidad } from '../../../models/entidades.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {

  actividades: Actividades[] = [];
  entidades: Entidad[] = [];
  cargando = false;
  textoBusqueda = '';
  // Para paginación
  page = 1;
  count = 0;
  tableSize = 15;
  tableSizes = [3, 6, 9, 12];

  constructor(private agendaService: AgendaService, private actividadesService: ActividadesService) { }

  ngOnInit(): void {
    this.actividadesService.getActividades().subscribe(resp => {
      console.log(resp);
      this.actividades = resp;
    });
    this.agendaService.getEntidades().subscribe(resp => {
      console.log(resp);
      this.entidades = resp;
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
