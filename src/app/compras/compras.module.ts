import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturaComponent } from './pages/factura/factura.component';
import { ComprasRoutingModule } from './compras.routes';
import { CrearProductoComponent } from '../shared/components/crear-producto/crear-producto.component';

@NgModule({
  declarations: [FacturaComponent],
  imports: [CommonModule, ComprasRoutingModule, FormsModule, MatDialogModule],
  entryComponents: [CrearProductoComponent],
})
export class ComprasModule {}
