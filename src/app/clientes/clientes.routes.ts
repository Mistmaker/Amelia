import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteComponent } from './pages/cliente/cliente.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { TipoClienteComponent } from './pages/tipo-cliente/tipo-cliente.component';
import { TiposClientesComponent } from './pages/tipos-clientes/tipos-clientes.component';
import { GruposClientesComponent } from './pages/grupos-clientes/grupos-clientes.component';
import { GrupoClienteComponent } from './pages/grupo-cliente/grupo-cliente.component';
import { AuthGuard } from '../auth/guards/auth-guard.guard';

const routes: Routes = [
    { path: 'tipos-clientes', component: TiposClientesComponent, canActivate: [AuthGuard]},
    { path: 'tipos-clientes/:id', component: TipoClienteComponent, canActivate: [AuthGuard]},
    { path: 'grupos', component: GruposClientesComponent, canActivate: [AuthGuard]},
    { path: 'grupos/:id', component: GrupoClienteComponent, canActivate: [AuthGuard]},
    { path: '', component: ClientesComponent, canActivate: [AuthGuard]},
    { path: ':id', component: ClienteComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '', pathMatch: 'full'},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule { }
