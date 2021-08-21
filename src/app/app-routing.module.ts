import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth-guard.guard';

const routes: Routes = [
  { path: 'configuraciones', loadChildren: () => import('./configuraciones/configuraciones.module').then( m => m.ConfiguracionesModule), canActivate: [AuthGuard] },
  { path: 'vendedores', loadChildren: () => import('./vendedores/vendedores.module').then( m => m.VendedoresModule), canActivate: [AuthGuard] },
  { path: 'facturas', loadChildren: () => import('./compras/compras.module').then( m => m.ComprasModule), canActivate: [AuthGuard] },
  { path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesModule), canActivate: [AuthGuard] },
  { path: 'productos', loadChildren: () => import('./productos/productos.module').then( m => m.ProductosModule), canActivate: [AuthGuard] },
  { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then( m => m.VentasModule), canActivate: [AuthGuard] },
  { path: 'proveedores', loadChildren: () => import('./proveedores/proveedores.module').then( m => m.ProveedoresModule), canActivate: [AuthGuard] },
  { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosModule), canActivate: [AuthGuard] },
  { path: 'empresa', loadChildren: () => import('./empresa/empresa.module').then( m => m.EmpresaModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule) },
  { path: 'agenda', loadChildren: () => import('./agenda/agenda.module').then( m => m.AgendaModule) },
  { path: '**', redirectTo: 'clientes', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
