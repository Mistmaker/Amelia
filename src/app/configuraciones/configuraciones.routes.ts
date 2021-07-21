import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracionesComponent } from './pages/configuraciones/configuraciones.component';
import { CiudadComponent } from './pages/ciudad/ciudad.component';
import { CiudadesComponent } from './pages/ciudades/ciudades.component';

const routes: Routes = [
  { path: 'ciudades', component: CiudadesComponent },
  { path: 'ciudades/:id', component: CiudadComponent },
  { path: '', component: ConfiguracionesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionesRoutingModule {}
