import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaComponent } from './pages/factura/factura.component';
import { FacturasRoutingModule } from './facturas.routes';

@NgModule({
  declarations: [FacturaComponent],
  imports: [CommonModule, FacturasRoutingModule, FormsModule],
})
export class FacturasModule {}
