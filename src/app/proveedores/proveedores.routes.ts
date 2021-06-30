import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

const routes: Routes = [
  { path: '', component: ProveedoresComponent },
  { path: ':id', component: ProveedorComponent },
  // { path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProveedoresRoutingModule {}
