import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectorioComponent } from './pages/directorio/directorio.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { TareasComponent } from './pages/tareas/tareas.component';
import { AgendaRoutingModule } from './agenda.routes';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../shared/pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { ComentariosModalComponent } from './pages/comentarios-modal/comentarios-modal.component';
import { DocumentosModalComponent } from './pages/documentos-modal/documentos-modal.component';



@NgModule({
  declarations: [
    DirectorioComponent,
    ActividadesComponent,
    TareasComponent,
    ActividadComponent,
    ComentariosModalComponent,
    DocumentosModalComponent,
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    NgxPaginationModule,
    FormsModule,
    PipesModule,
    MatDialogModule
  ]
})
export class AgendaModule { }
