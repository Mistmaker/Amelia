import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturaComponent } from './pages/factura/factura.component';

const routes: Routes = [
  { path: '', component: FacturaComponent },
  // { path: ':id', component: ProveedorComponent },
  // { path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturasRoutingModule {}
