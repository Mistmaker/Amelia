import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionesComponent } from './pages/configuraciones/configuraciones.component';

const routes: Routes = [{ path: '', component: ConfiguracionesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionesRoutingModule {}
