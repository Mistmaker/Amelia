import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaVentaComponent } from './pages/factura-venta/factura-venta.component';
import { VentasRoutingModule } from './ventas.routes';



@NgModule({
  declarations: [
    FacturaVentaComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
