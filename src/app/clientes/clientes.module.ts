import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ClientesRoutingModule } from './clientes.routes';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../shared/pipes/pipes.module';



@NgModule({
  declarations: [
    ClientesComponent,
    ClienteComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    NgxPaginationModule,
    FormsModule,
    PipesModule
  ]
})
export class ClientesModule { }
