import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../shared/pipes/pipes.module';

import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { UsuariosRoutingModule } from './usuarios.routes';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { PerfilComponent } from './pages/perfil/perfil.component';



@NgModule({
  declarations: [
    UsuariosComponent,
    UsuarioComponent,
    PerfilesComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    NgxPaginationModule,
    FormsModule,
    PipesModule,
    MatDialogModule,
  ]
})
export class UsuariosModule { }
