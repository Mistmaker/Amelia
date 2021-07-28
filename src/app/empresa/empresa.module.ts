import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { HttpClientModule } from '@angular/common/http';
import { EmpresaRoutingModule } from './empresa.routes';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EmpresaComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    EmpresaRoutingModule,
    FormsModule
  ]
})
export class EmpresaModule { }
