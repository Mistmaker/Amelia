import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectorioComponent } from './pages/directorio/directorio.component';
import { AuthGuard } from '../auth/guards/auth-guard.guard';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { TareasComponent } from './pages/tareas/tareas.component';

const routes: Routes = [
    { path: 'actividades', component: ActividadesComponent, canActivate: [AuthGuard] },
    { path: 'actividades/:id', component: ActividadComponent, canActivate: [AuthGuard] },
    { path: 'tareas', component: TareasComponent, canActivate: [AuthGuard] },
    // { path: 'tipos-clientes/:id', component: TipoClienteComponent, canActivate: [AuthGuard]},
    // { path: 'grupos', component: GruposClientesComponent, canActivate: [AuthGuard]},
    // { path: 'grupos/:id', component: GrupoClienteComponent, canActivate: [AuthGuard]},
    // { path: 'documentos', component: DocumentosClienteComponent, canActivate: [AuthGuard]},
    // { path: 'documentos/registro/:id', component: CargaCompraClienteComponent, canActivate: [AuthGuard]},
    { path: '', component: DirectorioComponent, canActivate: [AuthGuard] },
    // { path: ':id', component: ClienteComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgendaRoutingModule { }
