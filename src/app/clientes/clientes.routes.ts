import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ClienteComponent } from './pages/cliente/cliente.component';

const routes: Routes = [
    { path: '', component: ClientesComponent},
    { path: ':id', component: ClienteComponent},
    // { path: '**', redirectTo: '', pathMatch: 'full'},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule { }