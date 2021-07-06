import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'facturas', loadChildren: () => import('./compras/compras.module').then( m => m.ComprasModule) },
  { path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesModule) },
  { path: 'productos', loadChildren: () => import('./productos/productos.module').then( m => m.ProductosModule) },
  { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then( m => m.VentasModule) },
  { path: 'proveedores', loadChildren: () => import('./proveedores/proveedores.module').then( m => m.ProveedoresModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
