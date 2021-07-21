import { NgxPaginationModule } from 'ngx-pagination';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfiguracionesRoutingModule } from './configuraciones.routes';
import { ConfiguracionesComponent } from './pages/configuraciones/configuraciones.component';
import { CiudadesComponent } from './pages/ciudades/ciudades.component';
import { CiudadComponent } from './pages/ciudad/ciudad.component';
import { PipesModule } from './../shared/pipes/pipes.module';

@NgModule({
  declarations: [ConfiguracionesComponent, CiudadesComponent, CiudadComponent],
  imports: [
    CommonModule,
    ConfiguracionesRoutingModule,
    NgxPaginationModule,
    FormsModule,
    PipesModule,
  ],
})
export class ConfiguracionesModule {}
