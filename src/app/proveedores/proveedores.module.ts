import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedoresRoutingModule } from './proveedores.routes';

@NgModule({
  declarations: [ProveedoresComponent, ProveedorComponent],
  imports: [CommonModule, ProveedoresRoutingModule],
})
export class ProveedoresModule {}
