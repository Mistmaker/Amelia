import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { ProductosComponent } from './pages/productos/productos.component';
import { ProductosRoutingModule } from './productos.routes';
import { PipesModule } from '../shared/pipes/pipes.module';
import { ProductoComponent } from './pages/producto/producto.component';
import { GrupoProductosComponent } from './pages/grupo-productos/grupo-productos.component';



@NgModule({
  declarations: [
    ProductosComponent,
    ProductoComponent,
    GrupoProductosComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    PipesModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class ProductosModule { }
