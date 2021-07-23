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



@NgModule({
  declarations: [
    ClientesComponent,
    ClienteComponent,
    TiposClientesComponent,
    TipoClienteComponent
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
