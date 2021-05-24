import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturaVentaComponent } from './pages/factura-venta/factura-venta.component';

const routes: Routes = [
    { path: '', component: FacturaVentaComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VentasRoutingModule { }