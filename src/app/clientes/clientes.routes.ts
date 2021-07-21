import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteComponent } from './pages/cliente/cliente.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { TipoClienteComponent } from './pages/tipo-cliente/tipo-cliente.component';
import { TiposClientesComponent } from './pages/tipos-clientes/tipos-clientes.component';

const routes: Routes = [
    { path: 'tipos-clientes', component: TiposClientesComponent},
    { path: 'tipos-clientes/:id', component: TipoClienteComponent},
    { path: '', component: ClientesComponent},
    { path: ':id', component: ClienteComponent},
    // { path: '**', redirectTo: '', pathMatch: 'full'},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule { }
