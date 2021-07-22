import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendedorComponent } from './pages/vendedor/vendedor.component';
import { VendedoresComponent } from './pages/vendedores/vendedores.component';

const routes: Routes = [
    { path: '', component: VendedoresComponent},
    { path: ':id', component: VendedorComponent},
    // { path: '**', redirectTo: '', pathMatch: 'full'},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VendedorRoutingModule { }
