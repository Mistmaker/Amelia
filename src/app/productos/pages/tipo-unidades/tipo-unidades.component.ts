import { TipoUnidadesService } from './../../services/tipo-unidades.service';
import { TipoUnidad } from 'src/app/models/tipoUnidad.models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tipo-unidades',
  templateUrl: './tipo-unidades.component.html',
  styleUrls: ['./tipo-unidades.component.css'],
})
export class TipoUnidadesComponent implements OnInit {
  textoBusqueda = '';
  tipoUnidades: TipoUnidad[] = [];
  cargando = false;

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private tipoUnidadesService: TipoUnidadesService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.tipoUnidadesService.getAllUnidades().subscribe(
      (res) => {
        this.tipoUnidades = res;
        this.cargando = false;
      },
      (err) => {
      }
    );
  }

  search(event: any) {
    setTimeout(() => {
      this.textoBusqueda = event.target.value;
      if (this.textoBusqueda !== '') {
        this.tipoUnidadesService
          .getUnidadesByNombre(this.textoBusqueda)
          .subscribe((res) => {
            this.tipoUnidades = res;
            this.page = 1;
          });
      } else {
        this.tipoUnidadesService.getAllUnidades().subscribe((res) => {
          this.tipoUnidades = res;
          this.page = 1;
          this.cargando = false;
        });
      }
    }, 500);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
}
