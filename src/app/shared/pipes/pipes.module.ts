import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroSimplePipe } from './filtro-simple.pipe';



@NgModule({
  declarations: [
    FiltroSimplePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltroSimplePipe
  ]
})
export class PipesModule { }
