import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';

import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component';
import { BuscarClientesComponent } from './buscar-clientes/buscar-clientes.component';
import { BuscarActividadesComponent } from './buscar-actividades/buscar-actividades.component';

@NgModule({
  declarations: [
    NavbarComponent,
    CrearProductoComponent,
    CuentasContablesComponent,
    BuscarClientesComponent,
    BuscarActividadesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    NavbarComponent,
    CrearProductoComponent
  ]
})
export class ComponentsModule { }
