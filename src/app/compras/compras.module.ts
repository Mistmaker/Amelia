import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaComponent } from './pages/factura/factura.component';
import { ComprasRoutingModule } from './compras.routes';
import { ComponentsModule } from '../shared/components/components.module';

@NgModule({
  declarations: [FacturaComponent],
  imports: [CommonModule, ComprasRoutingModule, FormsModule, ComponentsModule],
})
export class ComprasModule {}
