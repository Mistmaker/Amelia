import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedoresRoutingModule } from './proveedores.routes';
import { PipesModule } from './../shared/pipes/pipes.module';
import { CuentasContablesComponent } from './../shared/components/cuentas-contables/cuentas-contables.component';

@NgModule({
  declarations: [ProveedoresComponent, ProveedorComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ProveedoresRoutingModule,
    PipesModule,
    MatDialogModule,
  ],
  entryComponents: [CuentasContablesComponent],
})
export class ProveedoresModule {}
