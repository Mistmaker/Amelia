import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

import { VendedorRoutingModule } from './vendedores.routes';
import { VendedoresComponent } from './pages/vendedores/vendedores.component';
import { VendedorComponent } from './pages/vendedor/vendedor.component';
import { PipesModule } from './../shared/pipes/pipes.module';

@NgModule({
  declarations: [VendedoresComponent, VendedorComponent],
  imports: [
    CommonModule,
    VendedorRoutingModule,
    NgxPaginationModule,
    FormsModule,
    PipesModule,
  ],
})
export class VendedoresModule {}
