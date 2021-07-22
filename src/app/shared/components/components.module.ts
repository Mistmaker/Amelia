import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { FormsModule } from '@angular/forms';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component';

@NgModule({
  declarations: [
    NavbarComponent,
    CrearProductoComponent,
    CuentasContablesComponent
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
