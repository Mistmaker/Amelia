import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaComponent } from './pages/factura/factura.component';
import { ComprasRoutingModule } from './compras.routes';

@NgModule({
  declarations: [FacturaComponent],
  imports: [CommonModule, ComprasRoutingModule, FormsModule],
})
export class ComprasModule {}
