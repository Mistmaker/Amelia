import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionesComponent } from './pages/configuraciones/configuraciones.component';
import { ConfiguracionesRoutingModule } from './configuraciones.routes';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfiguracionesComponent],
  imports: [CommonModule, ConfiguracionesRoutingModule, FormsModule],
})
export class ConfiguracionesModule {}
