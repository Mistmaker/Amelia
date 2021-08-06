import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ClientesComponent } from './pages/clientes/clientes.component';
import { ClientesRoutingModule } from './clientes.routes';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { TiposClientesComponent } from './pages/tipos-clientes/tipos-clientes.component';
import { TipoClienteComponent } from './pages/tipo-cliente/tipo-cliente.component';
import { CuentasContablesComponent } from './../shared/components/cuentas-contables/cuentas-contables.component';
import { GruposClientesComponent } from './pages/grupos-clientes/grupos-clientes.component';
import { GrupoClienteComponent } from './pages/grupo-cliente/grupo-cliente.component';
import { ClienteModalComponent } from './pages/cliente-modal/cliente-modal.component';
import { DocumentosClienteComponent } from './pages/documentos-cliente/documentos-cliente.component';



@NgModule({
  declarations: [
    ClientesComponent,
    ClienteComponent,
    TiposClientesComponent,
    TipoClienteComponent,
    GruposClientesComponent,
    GrupoClienteComponent,
    ClienteModalComponent,
    DocumentosClienteComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    NgxPaginationModule,
    FormsModule,
    PipesModule,
    MatDialogModule,
  ],
  entryComponents: [CuentasContablesComponent],
})
export class ClientesModule { }
