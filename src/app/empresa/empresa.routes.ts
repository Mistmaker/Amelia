import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresaComponent } from './pages/empresa/empresa.component';

const routes: Routes = [
    { path: '', component: EmpresaComponent},
    { path: '**', redirectTo: '', pathMatch: 'full'},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpresaRoutingModule { }
