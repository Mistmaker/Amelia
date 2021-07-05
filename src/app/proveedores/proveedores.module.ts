import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedoresRoutingModule } from './proveedores.routes';
import { PipesModule } from './../shared/pipes/pipes.module';

@NgModule({
  declarations: [ProveedoresComponent, ProveedorComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ProveedoresRoutingModule,
    PipesModule,
  ],
})
export class ProveedoresModule {}
