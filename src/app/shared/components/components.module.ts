import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';



@NgModule({
  declarations: [
    NavbarComponent,
    CrearProductoComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    CrearProductoComponent
  ]
})
export class ComponentsModule { }
