import { TipoUnidadesComponent } from './pages/tipo-unidades/tipo-unidades.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosComponent } from './pages/productos/productos.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { GrupoProductosComponent } from './pages/grupo-productos/grupo-productos.component';
import { CrearGrupoProductoComponent } from './pages/crear-grupo-producto/crear-grupo-producto.component';
import { CrearTipoUnidadComponent } from './pages/crear-tipo-unidad/crear-tipo-unidad.component';

const routes: Routes = [
  { path: 'grupo-productos', component: GrupoProductosComponent },
  { path: 'grupo-productos/:id', component: CrearGrupoProductoComponent },
  { path: 'unidad-productos', component: TipoUnidadesComponent },
  { path: 'unidad-productos/:id', component: CrearTipoUnidadComponent },
  { path: '', component: ProductosComponent},
  { path: ':id', component: ProductoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRoutingModule {}
