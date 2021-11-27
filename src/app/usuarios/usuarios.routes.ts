import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
    { path: 'perfiles', component: PerfilesComponent },
    { path: 'perfiles/:id', component: PerfilComponent },
    { path: '', component: UsuariosComponent },
    { path: ':id', component: UsuarioComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosRoutingModule { }
