import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { ProductosComponent } from './pages/productos/productos.component';
import { ProductosRoutingModule } from './productos.routes';
import { PipesModule } from '../shared/pipes/pipes.module';
import { ProductoComponent } from './pages/producto/producto.component';
import { GrupoProductosComponent } from './pages/grupo-productos/grupo-productos.component';
import { CrearGrupoProductoComponent } from './pages/crear-grupo-producto/crear-grupo-producto.component';
import { CrearTipoUnidadComponent } from './pages/crear-tipo-unidad/crear-tipo-unidad.component';
import { TipoUnidadesComponent } from './pages/tipo-unidades/tipo-unidades.component';

@NgModule({
  declarations: [
    ProductosComponent,
    ProductoComponent,
    GrupoProductosComponent,
    CrearGrupoProductoComponent,
    CrearTipoUnidadComponent,
    TipoUnidadesComponent,
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    PipesModule,
    FormsModule,
    NgxPaginationModule,
  ],
})
export class ProductosModule {}
