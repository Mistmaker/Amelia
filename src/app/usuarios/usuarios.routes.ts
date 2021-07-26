import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routes: Routes = [
    { path: '', component: UsuariosComponent },
    { path: ':id', component: UsuarioComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosRoutingModule { }
